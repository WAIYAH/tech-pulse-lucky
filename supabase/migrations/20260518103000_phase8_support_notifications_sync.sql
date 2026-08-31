-- Phase 8: Support + notifications sync for cross-device/admin production workflows
-- Safe to run multiple times where possible.

-- Support tickets
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default '',
  user_email text not null default '',
  subject text not null,
  message text not null,
  category text not null default 'general',
  priority text not null default 'medium',
  status text not null default 'open',
  admin_reply text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint support_tickets_category_check
    check (category in ('billing', 'course', 'technical', 'general')),
  constraint support_tickets_priority_check
    check (priority in ('low', 'medium', 'high')),
  constraint support_tickets_status_check
    check (status in ('open', 'in_progress', 'resolved'))
);

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row
execute function public.set_updated_at();

create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_tickets_updated_at on public.support_tickets(updated_at desc);

-- Notifications
create table if not exists public.student_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'system',
  action_path text,
  read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_notifications_type_check
    check (type in ('payment', 'support', 'learning', 'webinar', 'system'))
);

drop trigger if exists trg_student_notifications_updated_at on public.student_notifications;
create trigger trg_student_notifications_updated_at
before update on public.student_notifications
for each row
execute function public.set_updated_at();

create index if not exists idx_student_notifications_user on public.student_notifications(user_id);
create index if not exists idx_student_notifications_created_at on public.student_notifications(created_at desc);
create index if not exists idx_student_notifications_user_read on public.student_notifications(user_id, read);

-- Student-side update guards
create or replace function public.guard_support_ticket_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    if new.status = 'resolved' and new.resolved_at is null then
      new.resolved_at := now();
    elsif new.status <> 'resolved' then
      new.resolved_at := null;
    end if;
    return new;
  end if;

  if old.user_id <> auth.uid() then
    raise exception 'You cannot modify another user''s support ticket.';
  end if;

  -- Students can only toggle their own ticket between open/resolved.
  if new.user_id <> old.user_id
     or new.user_name <> old.user_name
     or new.user_email <> old.user_email
     or new.subject <> old.subject
     or new.message <> old.message
     or new.category <> old.category
     or new.priority <> old.priority
     or coalesce(new.admin_reply, '') <> coalesce(old.admin_reply, '') then
    raise exception 'Students can only update ticket status.';
  end if;

  if new.status not in ('open', 'resolved') then
    raise exception 'Students can only set ticket status to open or resolved.';
  end if;

  if new.status = 'resolved' then
    new.resolved_at := coalesce(new.resolved_at, now());
  else
    new.resolved_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_support_ticket_update on public.support_tickets;
create trigger trg_guard_support_ticket_update
before update on public.support_tickets
for each row
execute function public.guard_support_ticket_update();

create or replace function public.guard_student_notification_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    if new.read = true and new.read_at is null then
      new.read_at := now();
    elsif new.read = false then
      new.read_at := null;
    end if;
    return new;
  end if;

  if old.user_id <> auth.uid() then
    raise exception 'You cannot modify another user''s notifications.';
  end if;

  if new.user_id <> old.user_id
     or new.title <> old.title
     or new.message <> old.message
     or new.type <> old.type
     or coalesce(new.action_path, '') <> coalesce(old.action_path, '')
     or new.created_at <> old.created_at then
    raise exception 'Students can only mark notifications as read.';
  end if;

  if new.read = false then
    raise exception 'Students can only set notifications to read.';
  end if;

  new.read := true;
  new.read_at := coalesce(old.read_at, new.read_at, now());

  return new;
end;
$$;

drop trigger if exists trg_guard_student_notification_update on public.student_notifications;
create trigger trg_guard_student_notification_update
before update on public.student_notifications
for each row
execute function public.guard_student_notification_update();

-- Enable RLS
alter table public.support_tickets enable row level security;
alter table public.student_notifications enable row level security;

-- Reset policies for idempotency
drop policy if exists support_tickets_select_own_or_admin on public.support_tickets;
drop policy if exists support_tickets_insert_own_or_admin on public.support_tickets;
drop policy if exists support_tickets_update_own_or_admin on public.support_tickets;
drop policy if exists support_tickets_delete_admin on public.support_tickets;

drop policy if exists student_notifications_select_own_or_admin on public.student_notifications;
drop policy if exists student_notifications_insert_own_or_admin on public.student_notifications;
drop policy if exists student_notifications_update_own_or_admin on public.student_notifications;
drop policy if exists student_notifications_delete_admin on public.student_notifications;

-- Support ticket policies
create policy support_tickets_select_own_or_admin
on public.support_tickets
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy support_tickets_insert_own_or_admin
on public.support_tickets
for insert
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy support_tickets_update_own_or_admin
on public.support_tickets
for update
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy support_tickets_delete_admin
on public.support_tickets
for delete
using (public.is_admin(auth.uid()));

-- Notification policies
create policy student_notifications_select_own_or_admin
on public.student_notifications
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy student_notifications_insert_own_or_admin
on public.student_notifications
for insert
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy student_notifications_update_own_or_admin
on public.student_notifications
for update
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy student_notifications_delete_admin
on public.student_notifications
for delete
using (public.is_admin(auth.uid()));
