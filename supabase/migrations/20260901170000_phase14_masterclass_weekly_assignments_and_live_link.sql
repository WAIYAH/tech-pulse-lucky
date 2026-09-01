-- Phase 14: weekly project-based assignments (GitHub link submission) + a live-session link
-- marker on the existing resources table. Safe to run multiple times where possible.

-- =========================================================================
-- 1) Live-session link: just a flag on the existing resources table, no new schema
-- =========================================================================

alter table public.masterclass_resources
  add column if not exists is_live_link boolean not null default false;

drop index if exists idx_masterclass_resources_one_live_link_per_week;
create unique index idx_masterclass_resources_one_live_link_per_week
  on public.masterclass_resources(week_id)
  where is_live_link;

-- =========================================================================
-- 2) Weekly assignment briefs: one per week, admin-authored, shared curriculum like quizzes
-- =========================================================================

create table if not exists public.masterclass_assignments (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null unique references public.masterclass_weeks(id) on delete cascade,
  title text not null default 'Weekly Project',
  brief text not null default '',
  requirements text not null default '',
  submission_instructions text not null default 'Share the GitHub repository link for your project.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_masterclass_assignments_updated_at on public.masterclass_assignments;
create trigger trg_masterclass_assignments_updated_at
before update on public.masterclass_assignments
for each row execute function public.set_updated_at();

-- =========================================================================
-- 3) Weekly assignment submissions: per user+cohort+assignment, student-owned
-- =========================================================================

create table if not exists public.masterclass_assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.masterclass_assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid not null references public.masterclass_cohorts(id) on delete cascade,
  github_url text,
  notes text,
  status text not null default 'not_started',
  admin_feedback text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint masterclass_assignment_submissions_unique unique (assignment_id, user_id, cohort_id),
  constraint masterclass_assignment_submissions_status_check check (status in ('not_started', 'submitted'))
);

drop trigger if exists trg_masterclass_assignment_submissions_updated_at on public.masterclass_assignment_submissions;
create trigger trg_masterclass_assignment_submissions_updated_at
before update on public.masterclass_assignment_submissions
for each row execute function public.set_updated_at();

create index if not exists idx_masterclass_assignment_submissions_user on public.masterclass_assignment_submissions(user_id);
create index if not exists idx_masterclass_assignment_submissions_cohort on public.masterclass_assignment_submissions(cohort_id);

-- Guard: students may freely edit their own github_url/notes/status, never admin_feedback,
-- and never reassign the row to another student/cohort/assignment. Mirrors
-- guard_final_project_update() from the phase9 migration.
create or replace function public.guard_assignment_submission_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    return new;
  end if;

  if new.user_id <> old.user_id or new.cohort_id <> old.cohort_id or new.assignment_id <> old.assignment_id then
    raise exception 'You cannot reassign a submission to another student, cohort, or assignment.';
  end if;

  if coalesce(new.admin_feedback, '') <> coalesce(old.admin_feedback, '') then
    raise exception 'Only admins can set feedback on a submission.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_assignment_submission_update on public.masterclass_assignment_submissions;
create trigger trg_guard_assignment_submission_update
before update on public.masterclass_assignment_submissions
for each row execute function public.guard_assignment_submission_update();

-- =========================================================================
-- 4) Row Level Security
-- =========================================================================

alter table public.masterclass_assignments enable row level security;
alter table public.masterclass_assignment_submissions enable row level security;

drop policy if exists masterclass_assignments_select_by_access on public.masterclass_assignments;
drop policy if exists masterclass_assignments_admin_manage on public.masterclass_assignments;

drop policy if exists masterclass_assignment_submissions_select_own_or_admin on public.masterclass_assignment_submissions;
drop policy if exists masterclass_assignment_submissions_insert_own_or_admin on public.masterclass_assignment_submissions;
drop policy if exists masterclass_assignment_submissions_update_own_or_admin on public.masterclass_assignment_submissions;
drop policy if exists masterclass_assignment_submissions_delete_admin on public.masterclass_assignment_submissions;

-- Assignments: full content gated to admin or enrolled+approved/free students (mirrors lessons/quizzes)
create policy masterclass_assignments_select_by_access on public.masterclass_assignments for select using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.masterclass_weeks w
    where w.id = masterclass_assignments.week_id
      and public.is_enrolled_in_masterclass_program(w.program_id)
  )
);
create policy masterclass_assignments_admin_manage on public.masterclass_assignments for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Submissions: own-or-admin, content guarded by trg_guard_assignment_submission_update
create policy masterclass_assignment_submissions_select_own_or_admin on public.masterclass_assignment_submissions for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_assignment_submissions_insert_own_or_admin on public.masterclass_assignment_submissions for insert
  with check (
    public.is_admin(auth.uid())
    or (user_id = auth.uid() and public.is_enrolled_in_masterclass_cohort(masterclass_assignment_submissions.cohort_id))
  );
create policy masterclass_assignment_submissions_update_own_or_admin on public.masterclass_assignment_submissions for update
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy masterclass_assignment_submissions_delete_admin on public.masterclass_assignment_submissions for delete
  using (public.is_admin(auth.uid()));
