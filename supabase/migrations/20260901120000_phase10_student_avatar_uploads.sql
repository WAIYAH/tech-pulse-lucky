-- Phase 10: Student profile picture uploads
-- Safe to run multiple times where possible.

-- Profiles: avatar column
alter table public.profiles
  add column if not exists avatar_url text;

-- Storage bucket for avatars (public read — these are just display photos)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Drop old policies to keep migration idempotent
drop policy if exists avatars_public_read on storage.objects;
drop policy if exists avatars_insert_own on storage.objects;
drop policy if exists avatars_update_own on storage.objects;
drop policy if exists avatars_delete_own on storage.objects;

-- Anyone can view avatars (public profile photos)
create policy avatars_public_read
on storage.objects
for select
using (bucket_id = 'avatars');

-- A user may only write files under a path prefixed with their own user id,
-- e.g. "{auth.uid()}/avatar.webp" — this is the standard Supabase avatar pattern.
create policy avatars_insert_own
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avatars_update_own
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avatars_delete_own
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
