-- Phase 16: Course Resource Library
--
-- Turns masterclass_resources from a link list into a real, file-backed resource
-- library: uploaded documents live in a PRIVATE Supabase Storage bucket, the
-- database row carries the teaching metadata, and storage access is derived from
-- the row's own visibility so the two can never drift apart.
--
-- Nothing here is destructive. Existing link/github/video rows keep working
-- unchanged: they simply have a null storage_path and are served from `url`.
--
-- Safe to run multiple times.

-- =========================================================================
-- 1) Resource metadata
-- =========================================================================

alter table public.masterclass_resources
  -- Where this sits in the weekly learning journey. Mirrors the folder layout
  -- under resources/week-NN/<category>/ so files and rows stay traceable.
  add column if not exists category text not null default 'reference',
  -- Object key inside the `course-resources` bucket. Null for link-type rows.
  add column if not exists storage_path text,
  add column if not exists file_name text,
  add column if not exists file_size bigint,
  add column if not exists mime_type text,
  -- Teaching metadata
  add column if not exists is_required boolean not null default false,
  add column if not exists is_published boolean not null default true,
  add column if not exists learning_objective text not null default '',
  -- Content versioning: a new version supersedes the old row rather than
  -- overwriting it, so historical records and links stay intact.
  add column if not exists version integer not null default 1,
  add column if not exists supersedes_id uuid references public.masterclass_resources(id) on delete set null;

do $$
declare
  v_table constant regclass := 'public.masterclass_resources'::regclass;
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = v_table and conname = 'masterclass_resources_category_check'
  ) then
    alter table public.masterclass_resources
      add constraint masterclass_resources_category_check check (category in (
        'notes', 'presentation', 'practical', 'assignment', 'quiz',
        'reference', 'project', 'template', 'recording', 'link'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = v_table and conname = 'masterclass_resources_version_check'
  ) then
    alter table public.masterclass_resources
      add constraint masterclass_resources_version_check check (version > 0);
  end if;

  -- A resource is either a stored file or an external link. Never neither.
  if not exists (
    select 1 from pg_constraint
    where conrelid = v_table and conname = 'masterclass_resources_source_check'
  ) then
    alter table public.masterclass_resources
      add constraint masterclass_resources_source_check
      check (storage_path is not null or length(coalesce(url, '')) > 0);
  end if;
end $$;

-- The original unique (program_id, title) blocked the most natural naming
-- scheme there is - "Weekly Notes" in more than one week - and made versioning
-- impossible. Scope uniqueness to the week and version instead.
alter table public.masterclass_resources
  drop constraint if exists masterclass_resources_unique;

create unique index if not exists masterclass_resources_identity_unique
  on public.masterclass_resources (program_id, coalesce(week_id, '00000000-0000-0000-0000-000000000000'::uuid), title, version);

create unique index if not exists masterclass_resources_storage_path_unique
  on public.masterclass_resources (storage_path)
  where storage_path is not null;

create index if not exists idx_masterclass_resources_category
  on public.masterclass_resources (week_id, category, resource_order);

create index if not exists idx_masterclass_resources_published
  on public.masterclass_resources (program_id, is_published);

-- Broaden the type list: the library now carries spreadsheets and audio too.
alter table public.masterclass_resources
  drop constraint if exists masterclass_resources_type_check;

alter table public.masterclass_resources
  add constraint masterclass_resources_type_check
  check (resource_type in (
    'pdf', 'doc', 'ppt', 'sheet', 'image', 'zip', 'code', 'audio',
    'link', 'github', 'video'
  ));

-- =========================================================================
-- 2) Storage bucket (PRIVATE - reached only through signed URLs)
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('course-resources', 'course-resources', false)
on conflict (id) do update set public = false;

drop policy if exists course_resources_read on storage.objects;
drop policy if exists course_resources_admin_insert on storage.objects;
drop policy if exists course_resources_admin_update on storage.objects;
drop policy if exists course_resources_admin_delete on storage.objects;

-- Read access is derived from the resource row that owns the object, so a file
-- is exactly as reachable as its catalogue entry - no more, no less. Unpublished
-- resources and enrolled-only resources are unreachable to everyone but admins.
create policy course_resources_read
on storage.objects
for select
using (
  bucket_id = 'course-resources'
  and (
    public.is_admin(auth.uid())
    or exists (
      select 1
      from public.masterclass_resources r
      where r.storage_path = storage.objects.name
        and r.is_published
        and (
          r.visibility = 'public'
          or public.is_enrolled_in_masterclass_program(r.program_id)
        )
    )
  )
);

-- Only admins may put files into the library, replace them, or remove them.
create policy course_resources_admin_insert
on storage.objects
for insert
with check (bucket_id = 'course-resources' and public.is_admin(auth.uid()));

create policy course_resources_admin_update
on storage.objects
for update
using (bucket_id = 'course-resources' and public.is_admin(auth.uid()))
with check (bucket_id = 'course-resources' and public.is_admin(auth.uid()));

create policy course_resources_admin_delete
on storage.objects
for delete
using (bucket_id = 'course-resources' and public.is_admin(auth.uid()));

-- =========================================================================
-- 3) Row-level security: students never see unpublished resources
-- =========================================================================

drop policy if exists masterclass_resources_select_by_visibility on public.masterclass_resources;

create policy masterclass_resources_select_by_visibility
on public.masterclass_resources
for select
using (
  public.is_admin(auth.uid())
  or (
    is_published
    and (
      visibility = 'public'
      or public.is_enrolled_in_masterclass_program(program_id)
    )
  )
);

-- =========================================================================
-- 4) Backfill: classify the rows that already exist
-- =========================================================================

update public.masterclass_resources
set category = case
      when is_live_link then 'link'
      when resource_type in ('link', 'github') then 'link'
      when resource_type = 'ppt' then 'presentation'
      when resource_type = 'video' then 'recording'
      else 'reference'
    end
where category = 'reference'
  and (is_live_link or resource_type in ('link', 'github', 'ppt', 'video'));
