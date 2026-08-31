-- Phase 9: Web Development Masterclass — reusable program/cohort schema + RLS
-- Reuses existing courses/enrollments/payments for money+access (see masterclass_cohorts.course_id).
-- Safe to run multiple times where possible.

-- =========================================================================
-- Helper functions (enrollment checks, mirrors public.is_admin())
-- =========================================================================

create or replace function public.is_enrolled_in_masterclass_cohort(p_cohort_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.masterclass_cohorts c
    join public.enrollments e on e.course_id = c.course_id
    where c.id = p_cohort_id
      and e.user_id = coalesce(p_user_id, auth.uid())
      and e.access_status in ('approved', 'free')
  );
$$;

grant execute on function public.is_enrolled_in_masterclass_cohort(uuid, uuid) to authenticated, anon;

create or replace function public.is_enrolled_in_masterclass_program(p_program_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.masterclass_cohorts c
    join public.enrollments e on e.course_id = c.course_id
    where c.program_id = p_program_id
      and e.user_id = coalesce(p_user_id, auth.uid())
      and e.access_status in ('approved', 'free')
  );
$$;

grant execute on function public.is_enrolled_in_masterclass_program(uuid, uuid) to authenticated, anon;

-- =========================================================================
-- Tables
-- =========================================================================

-- Programs: reusable curriculum container (e.g. "web-development-masterclass")
create table if not exists public.masterclass_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text not null default '',
  summary text not null default '',
  philosophy text not null default '',
  technologies text[] not null default '{}',
  total_weeks integer not null default 8,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_programs_total_weeks_check check (total_weeks > 0)
);

drop trigger if exists trg_masterclass_programs_updated_at on public.masterclass_programs;
create trigger trg_masterclass_programs_updated_at
before update on public.masterclass_programs
for each row execute function public.set_updated_at();

-- Cohorts: 1:1 extends an existing `courses` row (money/access flow reused as-is)
create table if not exists public.masterclass_cohorts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.masterclass_programs(id) on delete cascade,
  course_id uuid not null unique references public.courses(id) on delete restrict,
  cohort_label text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'upcoming',
  max_seats integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_cohorts_status_check check (status in ('upcoming', 'active', 'completed', 'archived')),
  constraint masterclass_cohorts_dates_check check (end_date >= start_date)
);

drop trigger if exists trg_masterclass_cohorts_updated_at on public.masterclass_cohorts;
create trigger trg_masterclass_cohorts_updated_at
before update on public.masterclass_cohorts
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_cohorts_program on public.masterclass_cohorts(program_id);

-- Weeks: curriculum shared across all cohorts of a program (Week doubles as the "module" level)
create table if not exists public.masterclass_weeks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.masterclass_programs(id) on delete cascade,
  week_number integer not null,
  title text not null,
  theme text not null default '',
  learning_objectives text[] not null default '{}',
  topics text[] not null default '{}',
  estimated_study_time text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_weeks_number_unique unique (program_id, week_number),
  constraint masterclass_weeks_number_check check (week_number > 0)
);

drop trigger if exists trg_masterclass_weeks_updated_at on public.masterclass_weeks;
create trigger trg_masterclass_weeks_updated_at
before update on public.masterclass_weeks
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_weeks_program on public.masterclass_weeks(program_id);

-- Lessons: nested directly under a week
create table if not exists public.masterclass_lessons (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.masterclass_weeks(id) on delete cascade,
  title text not null,
  lesson_order integer not null,
  lesson_type text not null default 'concept',
  content text not null default '',
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_lessons_order_unique unique (week_id, lesson_order),
  constraint masterclass_lessons_type_check check (lesson_type in ('intro', 'concept', 'practical'))
);

drop trigger if exists trg_masterclass_lessons_updated_at on public.masterclass_lessons;
create trigger trg_masterclass_lessons_updated_at
before update on public.masterclass_lessons
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_lessons_week on public.masterclass_lessons(week_id);

-- Terminology / glossary entries per week
create table if not exists public.masterclass_terminology (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.masterclass_weeks(id) on delete cascade,
  term text not null,
  definition text not null,
  simple_explanation text not null default '',
  example text not null default '',
  related_concept text not null default '',
  term_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_terminology_unique unique (week_id, term)
);

drop trigger if exists trg_masterclass_terminology_updated_at on public.masterclass_terminology;
create trigger trg_masterclass_terminology_updated_at
before update on public.masterclass_terminology
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_terminology_week on public.masterclass_terminology(week_id);

-- Quizzes: one per week
create table if not exists public.masterclass_quizzes (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null unique references public.masterclass_weeks(id) on delete cascade,
  title text not null,
  instructions text not null default '',
  passing_score integer not null default 70,
  time_limit_minutes integer,
  max_attempts integer not null default 3,
  randomize_questions boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_quizzes_passing_score_check check (passing_score between 0 and 100),
  constraint masterclass_quizzes_max_attempts_check check (max_attempts > 0)
);

drop trigger if exists trg_masterclass_quizzes_updated_at on public.masterclass_quizzes;
create trigger trg_masterclass_quizzes_updated_at
before update on public.masterclass_quizzes
for each row execute function public.set_updated_at();

-- Quiz questions: correct_answer/explanation must never be student-readable via the base table
create table if not exists public.masterclass_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.masterclass_quizzes(id) on delete cascade,
  question_order integer not null,
  question_type text not null default 'mcq',
  question_text text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null default '',
  points integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_quiz_questions_order_unique unique (quiz_id, question_order),
  constraint masterclass_quiz_questions_type_check check (question_type in ('mcq', 'true_false', 'scenario')),
  constraint masterclass_quiz_questions_points_check check (points > 0)
);

drop trigger if exists trg_masterclass_quiz_questions_updated_at on public.masterclass_quiz_questions;
create trigger trg_masterclass_quiz_questions_updated_at
before update on public.masterclass_quiz_questions
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_quiz_questions_quiz on public.masterclass_quiz_questions(quiz_id);

-- Quiz attempts: cohort-scoped so a repeat cohort doesn't inherit stale completion state
create table if not exists public.masterclass_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.masterclass_quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  attempt_number integer not null default 1,
  answers jsonb not null default '{}'::jsonb,
  score numeric(5, 2) not null default 0,
  max_score numeric(5, 2) not null default 100,
  passed boolean not null default false,
  started_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  constraint masterclass_quiz_attempts_unique unique (quiz_id, user_id, cohort_id, attempt_number)
);

create index if not exists idx_masterclass_quiz_attempts_user on public.masterclass_quiz_attempts(user_id);
create index if not exists idx_masterclass_quiz_attempts_quiz on public.masterclass_quiz_attempts(quiz_id);

-- Resources: program-wide (week_id null) or week-scoped
create table if not exists public.masterclass_resources (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.masterclass_programs(id) on delete cascade,
  week_id uuid references public.masterclass_weeks(id) on delete cascade,
  title text not null,
  description text not null default '',
  resource_type text not null default 'link',
  url text not null,
  visibility text not null default 'enrolled',
  resource_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_resources_unique unique (program_id, title),
  constraint masterclass_resources_type_check
    check (resource_type in ('pdf', 'doc', 'ppt', 'image', 'zip', 'code', 'link', 'github', 'video')),
  constraint masterclass_resources_visibility_check check (visibility in ('public', 'enrolled'))
);

drop trigger if exists trg_masterclass_resources_updated_at on public.masterclass_resources;
create trigger trg_masterclass_resources_updated_at
before update on public.masterclass_resources
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_resources_week on public.masterclass_resources(week_id);
create index if not exists idx_masterclass_resources_program on public.masterclass_resources(program_id);

-- Lesson progress: mirrors public.lesson_progress but scoped to a masterclass cohort run
create table if not exists public.masterclass_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.masterclass_lessons(id) on delete cascade,
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_lesson_progress_unique unique (user_id, lesson_id, cohort_id)
);

drop trigger if exists trg_masterclass_lesson_progress_updated_at on public.masterclass_lesson_progress;
create trigger trg_masterclass_lesson_progress_updated_at
before update on public.masterclass_lesson_progress
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_lesson_progress_user on public.masterclass_lesson_progress(user_id);
create index if not exists idx_masterclass_lesson_progress_cohort on public.masterclass_lesson_progress(cohort_id);

-- Final projects: self-reported stage progress, admin approves/feedbacks
create table if not exists public.masterclass_final_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  project_type text not null default '',
  problem_statement text not null default '',
  target_users text not null default '',
  requirements text not null default '',
  github_url text,
  deployment_url text,
  stage_proposal integer not null default 0,
  stage_requirements integer not null default 0,
  stage_ui integer not null default 0,
  stage_database integer not null default 0,
  stage_development integer not null default 0,
  stage_testing integer not null default 0,
  stage_deployment integer not null default 0,
  status text not null default 'not_started',
  admin_feedback text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_final_projects_unique unique (user_id, cohort_id),
  constraint masterclass_final_projects_status_check
    check (status in ('not_started', 'in_progress', 'submitted', 'approved')),
  constraint masterclass_final_projects_stage_bounds check (
    stage_proposal between 0 and 100 and stage_requirements between 0 and 100 and
    stage_ui between 0 and 100 and stage_database between 0 and 100 and
    stage_development between 0 and 100 and stage_testing between 0 and 100 and
    stage_deployment between 0 and 100
  )
);

drop trigger if exists trg_masterclass_final_projects_updated_at on public.masterclass_final_projects;
create trigger trg_masterclass_final_projects_updated_at
before update on public.masterclass_final_projects
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_final_projects_cohort on public.masterclass_final_projects(cohort_id);

-- Guard: students may edit their own project's progress/links, but never admin_feedback or approve themselves
create or replace function public.guard_final_project_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    return new;
  end if;

  if new.user_id <> old.user_id or new.cohort_id <> old.cohort_id then
    raise exception 'You cannot reassign a final project to another student or cohort.';
  end if;

  if coalesce(new.admin_feedback, '') <> coalesce(old.admin_feedback, '') then
    raise exception 'Only admins can set feedback on a final project.';
  end if;

  if new.status = 'approved' and old.status <> 'approved' then
    raise exception 'Only admins can approve a final project.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_final_project_update on public.masterclass_final_projects;
create trigger trg_guard_final_project_update
before update on public.masterclass_final_projects
for each row execute function public.guard_final_project_update();

-- Certificates: admin-issued, references an admin-supplied link (no automated PDF generation)
create table if not exists public.masterclass_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  certificate_code text not null unique,
  status text not null default 'not_eligible',
  certificate_url text,
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_certificates_unique unique (user_id, cohort_id),
  constraint masterclass_certificates_status_check check (status in ('not_eligible', 'eligible', 'issued', 'revoked'))
);

drop trigger if exists trg_masterclass_certificates_updated_at on public.masterclass_certificates;
create trigger trg_masterclass_certificates_updated_at
before update on public.masterclass_certificates
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_certificates_cohort on public.masterclass_certificates(cohort_id);

-- Announcements: cohort-wide (target_user_id null), week-specific, or one student
create table if not exists public.masterclass_announcements (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  week_id uuid references public.masterclass_weeks(id) on delete cascade,
  target_user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  is_pinned boolean not null default false,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_masterclass_announcements_updated_at on public.masterclass_announcements;
create trigger trg_masterclass_announcements_updated_at
before update on public.masterclass_announcements
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_announcements_cohort on public.masterclass_announcements(cohort_id);
create index if not exists idx_masterclass_announcements_target on public.masterclass_announcements(target_user_id);

-- Attendance
create table if not exists public.masterclass_attendance (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  week_id uuid references public.masterclass_weeks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  session_label text not null default '',
  status text not null default 'present',
  notes text,
  marked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_attendance_status_check check (status in ('present', 'absent')),
  constraint masterclass_attendance_unique unique (cohort_id, user_id, session_date)
);

drop trigger if exists trg_masterclass_attendance_updated_at on public.masterclass_attendance;
create trigger trg_masterclass_attendance_updated_at
before update on public.masterclass_attendance
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_attendance_cohort on public.masterclass_attendance(cohort_id);
create index if not exists idx_masterclass_attendance_user on public.masterclass_attendance(user_id);

-- =========================================================================
-- Row Level Security
-- =========================================================================

alter table public.masterclass_programs enable row level security;
alter table public.masterclass_cohorts enable row level security;
alter table public.masterclass_weeks enable row level security;
alter table public.masterclass_lessons enable row level security;
alter table public.masterclass_terminology enable row level security;
alter table public.masterclass_quizzes enable row level security;
alter table public.masterclass_quiz_questions enable row level security;
alter table public.masterclass_quiz_attempts enable row level security;
alter table public.masterclass_resources enable row level security;
alter table public.masterclass_lesson_progress enable row level security;
alter table public.masterclass_final_projects enable row level security;
alter table public.masterclass_certificates enable row level security;
alter table public.masterclass_announcements enable row level security;
alter table public.masterclass_attendance enable row level security;

-- Drop old policies to keep migration idempotent
drop policy if exists masterclass_programs_public_read on public.masterclass_programs;
drop policy if exists masterclass_programs_admin_manage on public.masterclass_programs;

drop policy if exists masterclass_cohorts_public_read on public.masterclass_cohorts;
drop policy if exists masterclass_cohorts_admin_manage on public.masterclass_cohorts;

drop policy if exists masterclass_weeks_public_read on public.masterclass_weeks;
drop policy if exists masterclass_weeks_admin_manage on public.masterclass_weeks;

drop policy if exists masterclass_lessons_select_by_access on public.masterclass_lessons;
drop policy if exists masterclass_lessons_admin_manage on public.masterclass_lessons;

drop policy if exists masterclass_terminology_select_by_access on public.masterclass_terminology;
drop policy if exists masterclass_terminology_admin_manage on public.masterclass_terminology;

drop policy if exists masterclass_quizzes_select_by_access on public.masterclass_quizzes;
drop policy if exists masterclass_quizzes_admin_manage on public.masterclass_quizzes;

drop policy if exists masterclass_quiz_questions_admin_manage on public.masterclass_quiz_questions;

drop policy if exists masterclass_quiz_attempts_select_own_or_admin on public.masterclass_quiz_attempts;
drop policy if exists masterclass_quiz_attempts_admin_manage on public.masterclass_quiz_attempts;

drop policy if exists masterclass_resources_select_by_visibility on public.masterclass_resources;
drop policy if exists masterclass_resources_admin_manage on public.masterclass_resources;

drop policy if exists masterclass_lesson_progress_select_own_or_admin on public.masterclass_lesson_progress;
drop policy if exists masterclass_lesson_progress_insert_own_or_admin on public.masterclass_lesson_progress;
drop policy if exists masterclass_lesson_progress_update_own_or_admin on public.masterclass_lesson_progress;
drop policy if exists masterclass_lesson_progress_delete_own_or_admin on public.masterclass_lesson_progress;

drop policy if exists masterclass_final_projects_select_own_or_admin on public.masterclass_final_projects;
drop policy if exists masterclass_final_projects_insert_own_or_admin on public.masterclass_final_projects;
drop policy if exists masterclass_final_projects_update_own_or_admin on public.masterclass_final_projects;
drop policy if exists masterclass_final_projects_delete_admin on public.masterclass_final_projects;

drop policy if exists masterclass_certificates_select_own_or_admin on public.masterclass_certificates;
drop policy if exists masterclass_certificates_admin_manage on public.masterclass_certificates;

drop policy if exists masterclass_announcements_select_own_or_admin on public.masterclass_announcements;
drop policy if exists masterclass_announcements_admin_manage on public.masterclass_announcements;

drop policy if exists masterclass_attendance_select_own_or_admin on public.masterclass_attendance;
drop policy if exists masterclass_attendance_admin_manage on public.masterclass_attendance;

-- Programs: public read (marketing/SEO), admin manage
create policy masterclass_programs_public_read on public.masterclass_programs for select using (true);
create policy masterclass_programs_admin_manage on public.masterclass_programs for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Cohorts: public read (marketing page shows cohort dates/status), admin manage
create policy masterclass_cohorts_public_read on public.masterclass_cohorts for select using (true);
create policy masterclass_cohorts_admin_manage on public.masterclass_cohorts for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Weeks: public read (curriculum overview is marketing content), admin manage
create policy masterclass_weeks_public_read on public.masterclass_weeks for select using (true);
create policy masterclass_weeks_admin_manage on public.masterclass_weeks for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Lessons: full content gated to admin or enrolled+approved/free students
create policy masterclass_lessons_select_by_access on public.masterclass_lessons for select using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.masterclass_weeks w
    where w.id = masterclass_lessons.week_id
      and public.is_enrolled_in_masterclass_program(w.program_id)
  )
);
create policy masterclass_lessons_admin_manage on public.masterclass_lessons for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Terminology: same gating as lessons (part of paid course value, not a free public glossary)
create policy masterclass_terminology_select_by_access on public.masterclass_terminology for select using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.masterclass_weeks w
    where w.id = masterclass_terminology.week_id
      and public.is_enrolled_in_masterclass_program(w.program_id)
  )
);
create policy masterclass_terminology_admin_manage on public.masterclass_terminology for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Quiz metadata (not questions): gated same as lessons
create policy masterclass_quizzes_select_by_access on public.masterclass_quizzes for select using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.masterclass_weeks w
    where w.id = masterclass_quizzes.week_id
      and public.is_enrolled_in_masterclass_program(w.program_id)
  )
);
create policy masterclass_quizzes_admin_manage on public.masterclass_quizzes for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Quiz questions: admin-only. Students never read this table directly — see the
-- masterclass_quiz_questions_public view below and the grading RPC.
create policy masterclass_quiz_questions_admin_manage on public.masterclass_quiz_questions for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Quiz attempts: students can see their own attempts; writes only via the RPC (bypasses RLS as
-- a SECURITY DEFINER function) or by an admin.
create policy masterclass_quiz_attempts_select_own_or_admin on public.masterclass_quiz_attempts for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_quiz_attempts_admin_manage on public.masterclass_quiz_attempts for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Resources: public ones visible to everyone, enrolled ones gated
create policy masterclass_resources_select_by_visibility on public.masterclass_resources for select using (
  public.is_admin(auth.uid())
  or visibility = 'public'
  or (visibility = 'enrolled' and public.is_enrolled_in_masterclass_program(program_id))
);
create policy masterclass_resources_admin_manage on public.masterclass_resources for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Lesson progress: mirrors public.lesson_progress's own-or-admin + enrollment-gated insert/update
create policy masterclass_lesson_progress_select_own_or_admin on public.masterclass_lesson_progress for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_lesson_progress_insert_own_or_admin on public.masterclass_lesson_progress for insert
  with check (
    public.is_admin(auth.uid())
    or (user_id = auth.uid() and public.is_enrolled_in_masterclass_cohort(masterclass_lesson_progress.cohort_id))
  );
create policy masterclass_lesson_progress_update_own_or_admin on public.masterclass_lesson_progress for update
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (
    public.is_admin(auth.uid())
    or (user_id = auth.uid() and public.is_enrolled_in_masterclass_cohort(masterclass_lesson_progress.cohort_id))
  );
create policy masterclass_lesson_progress_delete_own_or_admin on public.masterclass_lesson_progress for delete
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Final projects: own-or-admin, content guarded by trg_guard_final_project_update
create policy masterclass_final_projects_select_own_or_admin on public.masterclass_final_projects for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_final_projects_insert_own_or_admin on public.masterclass_final_projects for insert
  with check (
    public.is_admin(auth.uid())
    or (user_id = auth.uid() and public.is_enrolled_in_masterclass_cohort(masterclass_final_projects.cohort_id))
  );
create policy masterclass_final_projects_update_own_or_admin on public.masterclass_final_projects for update
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_final_projects_delete_admin on public.masterclass_final_projects for delete
  using (public.is_admin(auth.uid()));

-- Certificates: students read their own; only admins issue/update
create policy masterclass_certificates_select_own_or_admin on public.masterclass_certificates for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_certificates_admin_manage on public.masterclass_certificates for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Announcements: cohort-wide, week-specific, or targeted to one student; admin-authored only
create policy masterclass_announcements_select_own_or_admin on public.masterclass_announcements for select using (
  public.is_admin(auth.uid())
  or target_user_id = auth.uid()
  or (target_user_id is null and public.is_enrolled_in_masterclass_cohort(cohort_id))
);
create policy masterclass_announcements_admin_manage on public.masterclass_announcements for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Attendance: students read their own; only admins record it
create policy masterclass_attendance_select_own_or_admin on public.masterclass_attendance for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_attendance_admin_manage on public.masterclass_attendance for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- Quiz answer security: view (no correct_answer/explanation) + grading RPC
-- =========================================================================

drop view if exists public.masterclass_quiz_questions_public;
create view public.masterclass_quiz_questions_public as
select
  q.id,
  q.quiz_id,
  q.question_order,
  q.question_type,
  q.question_text,
  q.options,
  q.points
from public.masterclass_quiz_questions q
where
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.masterclass_quizzes qz
    join public.masterclass_weeks w on w.id = qz.week_id
    where qz.id = q.quiz_id
      and public.is_enrolled_in_masterclass_program(w.program_id)
  );

grant select on public.masterclass_quiz_questions_public to authenticated;

create or replace function public.submit_masterclass_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_week_id uuid;
  v_program_id uuid;
  v_cohort_id uuid;
  v_max_attempts integer;
  v_passing_score integer;
  v_attempt_count integer;
  v_question record;
  v_total_points numeric := 0;
  v_earned_points numeric := 0;
  v_correct_answers jsonb := '{}'::jsonb;
  v_explanations jsonb := '{}'::jsonb;
  v_given text;
  v_is_correct boolean;
  v_score numeric;
  v_passed boolean;
  v_attempt_number integer;
  v_attempt_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to submit a quiz.';
  end if;

  select w.id, w.program_id, qz.max_attempts, qz.passing_score
    into v_week_id, v_program_id, v_max_attempts, v_passing_score
  from public.masterclass_quizzes qz
  join public.masterclass_weeks w on w.id = qz.week_id
  where qz.id = p_quiz_id;

  if v_week_id is null then
    raise exception 'Quiz not found.';
  end if;

  select c.id into v_cohort_id
  from public.masterclass_cohorts c
  join public.enrollments e on e.course_id = c.course_id
  where c.program_id = v_program_id
    and e.user_id = auth.uid()
    and e.access_status in ('approved', 'free')
  order by c.start_date desc
  limit 1;

  if v_cohort_id is null then
    raise exception 'You must be enrolled and approved for this program to submit this quiz.';
  end if;

  select count(*) into v_attempt_count
  from public.masterclass_quiz_attempts
  where quiz_id = p_quiz_id and user_id = auth.uid() and cohort_id = v_cohort_id;

  if v_attempt_count >= v_max_attempts then
    raise exception 'You have used all % attempts for this quiz.', v_max_attempts;
  end if;

  v_attempt_number := v_attempt_count + 1;

  for v_question in
    select id, correct_answer, explanation, points
    from public.masterclass_quiz_questions
    where quiz_id = p_quiz_id
    order by question_order
  loop
    v_total_points := v_total_points + v_question.points;
    v_given := p_answers ->> v_question.id::text;
    v_is_correct := v_given is not null and lower(trim(v_given)) = lower(trim(v_question.correct_answer));

    if v_is_correct then
      v_earned_points := v_earned_points + v_question.points;
    end if;

    v_correct_answers := v_correct_answers || jsonb_build_object(v_question.id::text, v_question.correct_answer);
    v_explanations := v_explanations || jsonb_build_object(v_question.id::text, v_question.explanation);
  end loop;

  if v_total_points = 0 then
    v_score := 0;
  else
    v_score := round((v_earned_points / v_total_points) * 100, 2);
  end if;

  v_passed := v_score >= v_passing_score;

  insert into public.masterclass_quiz_attempts (
    quiz_id, user_id, cohort_id, attempt_number, answers, score, max_score, passed, started_at, submitted_at
  ) values (
    p_quiz_id, auth.uid(), v_cohort_id, v_attempt_number, p_answers, v_score, 100, v_passed, now(), now()
  )
  returning id into v_attempt_id;

  return jsonb_build_object(
    'attemptId', v_attempt_id,
    'score', v_score,
    'passed', v_passed,
    'attemptNumber', v_attempt_number,
    'attemptsRemaining', greatest(v_max_attempts - v_attempt_number, 0),
    'correctAnswers', v_correct_answers,
    'explanations', v_explanations
  );
end;
$$;

grant execute on function public.submit_masterclass_quiz_attempt(uuid, jsonb) to authenticated;
