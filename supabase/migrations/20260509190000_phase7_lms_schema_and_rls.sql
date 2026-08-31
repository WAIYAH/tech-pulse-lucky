-- Phase 7: LMS schema + RLS policies
-- Safe to run multiple times where possible.

create extension if not exists pgcrypto;

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lms_role') then
    create type public.lms_role as enum ('guest', 'student', 'admin');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lms_course_level') then
    create type public.lms_course_level as enum ('Beginner', 'Intermediate', 'Advanced');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lms_lesson_type') then
    create type public.lms_lesson_type as enum ('video', 'text', 'assignment', 'quiz');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lms_access_status') then
    create type public.lms_access_status as enum ('free', 'pending_payment', 'approved', 'rejected');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lms_payment_status') then
    create type public.lms_payment_status as enum ('pending', 'approved', 'rejected');
  end if;
end$$;

-- Shared helper: updated_at timestamp trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null unique,
  phone text not null default '',
  role public.lms_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Role helper (must come after public.profiles exists: this is a `language sql`
-- function, which Postgres validates against the catalog at creation time,
-- unlike plpgsql's deferred binding)
create or replace function public.is_admin(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(target_user_id, auth.uid())
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to authenticated, anon;

-- Auto-create profile from auth.users
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  role_text text;
begin
  role_text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  if role_text not in ('guest', 'student', 'admin') then
    role_text := 'student';
  end if;

  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    role_text::public.lms_role
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        role = excluded.role,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null,
  category text not null,
  level public.lms_course_level not null default 'Beginner',
  duration text not null,
  price numeric(10,2) not null default 0,
  currency text not null default 'KES',
  is_free boolean not null default true,
  image_url text not null default '/placeholder.svg',
  instructor text not null default 'Lucky Nakola',
  learning_outcomes text[] not null default '{}',
  requirements text[] not null default '{}',
  target_audience text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_price_check check (price >= 0),
  constraint courses_free_price_check check ((is_free = true and price = 0) or (is_free = false and price >= 0))
);

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row
execute function public.set_updated_at();

create index if not exists idx_courses_slug on public.courses(slug);
create index if not exists idx_courses_category on public.courses(category);
create index if not exists idx_courses_level on public.courses(level);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  lesson_order integer not null,
  lesson_type public.lms_lesson_type not null default 'text',
  content text not null,
  video_url text,
  resource_downloads jsonb not null default '[]'::jsonb,
  quiz jsonb,
  assignment jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_order_unique unique (course_id, lesson_order)
);

drop trigger if exists trg_lessons_updated_at on public.lessons;
create trigger trg_lessons_updated_at
before update on public.lessons
for each row
execute function public.set_updated_at();

create index if not exists idx_lessons_course on public.lessons(course_id);

-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  access_status public.lms_access_status not null default 'pending_payment',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enrollments_unique unique (user_id, course_id),
  constraint enrollments_progress_check check (progress >= 0 and progress <= 100)
);

drop trigger if exists trg_enrollments_updated_at on public.enrollments;
create trigger trg_enrollments_updated_at
before update on public.enrollments
for each row
execute function public.set_updated_at();

-- Prevent non-admin users from escalating access status
create or replace function public.guard_enrollment_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    if new.user_id <> old.user_id
       or new.course_id <> old.course_id
       or new.access_status <> old.access_status then
      raise exception 'Only admins can modify enrollment access details';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_enrollment_update on public.enrollments;
create trigger trg_guard_enrollment_update
before update on public.enrollments
for each row
execute function public.guard_enrollment_update();

create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  amount numeric(10,2) not null,
  currency text not null default 'KES',
  transaction_code text not null,
  payment_date date not null,
  status public.lms_payment_status not null default 'pending',
  admin_note text,
  screenshot_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_amount_check check (amount >= 0)
);

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_course on public.payments(course_id);
create index if not exists idx_payments_status on public.payments(status);

-- Lesson progress
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_progress_unique unique (user_id, lesson_id)
);

drop trigger if exists trg_lesson_progress_updated_at on public.lesson_progress;
create trigger trg_lesson_progress_updated_at
before update on public.lesson_progress
for each row
execute function public.set_updated_at();

create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_lesson_progress_course on public.lesson_progress(course_id);

-- Assignments placeholder
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  instructions text not null,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_assignments_updated_at on public.assignments;
create trigger trg_assignments_updated_at
before update on public.assignments
for each row
execute function public.set_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assignments enable row level security;

-- Drop old policies to keep migration idempotent
drop policy if exists profiles_select_own_or_admin on public.profiles;
drop policy if exists profiles_insert_own_or_admin on public.profiles;
drop policy if exists profiles_update_own_or_admin on public.profiles;
drop policy if exists profiles_delete_admin on public.profiles;

drop policy if exists courses_public_read on public.courses;
drop policy if exists courses_admin_manage on public.courses;

drop policy if exists lessons_select_by_access on public.lessons;
drop policy if exists lessons_admin_manage on public.lessons;

drop policy if exists enrollments_select_own_or_admin on public.enrollments;
drop policy if exists enrollments_insert_own_or_admin on public.enrollments;
drop policy if exists enrollments_update_own_or_admin on public.enrollments;
drop policy if exists enrollments_delete_admin on public.enrollments;

drop policy if exists payments_select_own_or_admin on public.payments;
drop policy if exists payments_insert_own_or_admin on public.payments;
drop policy if exists payments_update_admin on public.payments;
drop policy if exists payments_delete_admin on public.payments;

drop policy if exists lesson_progress_select_own_or_admin on public.lesson_progress;
drop policy if exists lesson_progress_insert_own_or_admin on public.lesson_progress;
drop policy if exists lesson_progress_update_own_or_admin on public.lesson_progress;
drop policy if exists lesson_progress_delete_own_or_admin on public.lesson_progress;

drop policy if exists assignments_public_read on public.assignments;
drop policy if exists assignments_admin_manage on public.assignments;

-- Profiles policies
create policy profiles_select_own_or_admin
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy profiles_insert_own_or_admin
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy profiles_update_own_or_admin
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy profiles_delete_admin
on public.profiles
for delete
using (public.is_admin(auth.uid()));

-- Courses policies
create policy courses_public_read
on public.courses
for select
using (true);

create policy courses_admin_manage
on public.courses
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Lessons policies: paid lesson content protected
create policy lessons_select_by_access
on public.lessons
for select
using (
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.courses c
    where c.id = lessons.course_id
      and c.is_free = true
  )
  or exists (
    select 1
    from public.enrollments e
    where e.course_id = lessons.course_id
      and e.user_id = auth.uid()
      and e.access_status in ('free', 'approved')
  )
);

create policy lessons_admin_manage
on public.lessons
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Enrollments policies
create policy enrollments_select_own_or_admin
on public.enrollments
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy enrollments_insert_own_or_admin
on public.enrollments
for insert
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy enrollments_update_own_or_admin
on public.enrollments
for update
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy enrollments_delete_admin
on public.enrollments
for delete
using (public.is_admin(auth.uid()));

-- Payments policies
create policy payments_select_own_or_admin
on public.payments
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy payments_insert_own_or_admin
on public.payments
for insert
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy payments_update_admin
on public.payments
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy payments_delete_admin
on public.payments
for delete
using (public.is_admin(auth.uid()));

-- Lesson progress policies
create policy lesson_progress_select_own_or_admin
on public.lesson_progress
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy lesson_progress_insert_own_or_admin
on public.lesson_progress
for insert
with check (
  public.is_admin(auth.uid())
  or (
    user_id = auth.uid()
    and exists (
      select 1
      from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = lesson_progress.course_id
        and e.access_status in ('free', 'approved')
    )
  )
);

create policy lesson_progress_update_own_or_admin
on public.lesson_progress
for update
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (
  public.is_admin(auth.uid())
  or (
    user_id = auth.uid()
    and exists (
      select 1
      from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = lesson_progress.course_id
        and e.access_status in ('free', 'approved')
    )
  )
);

create policy lesson_progress_delete_own_or_admin
on public.lesson_progress
for delete
using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Assignments policies
create policy assignments_public_read
on public.assignments
for select
using (true);

create policy assignments_admin_manage
on public.assignments
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

