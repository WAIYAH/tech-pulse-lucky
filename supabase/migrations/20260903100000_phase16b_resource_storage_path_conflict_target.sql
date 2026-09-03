-- Phase 16b: make storage_path usable as an ON CONFLICT target
--
-- Phase 16 created the storage_path uniqueness as a PARTIAL index
-- (`where storage_path is not null`). Postgres will not infer a partial index as
-- an ON CONFLICT arbiter unless the statement repeats the same WHERE clause,
-- which PostgREST's upsert cannot express - so `tools/sync-resources.mjs` failed
-- with "there is no unique or exclusion constraint matching the ON CONFLICT
-- specification".
--
-- A plain unique index gives the same guarantee here: Postgres treats NULLs as
-- distinct, so link-type resources (which have no storage_path) are unaffected
-- and any number of them may coexist, while every stored file still maps to
-- exactly one catalogue row.
--
-- Safe to run multiple times.

drop index if exists public.masterclass_resources_storage_path_unique;

create unique index if not exists masterclass_resources_storage_path_unique
  on public.masterclass_resources (storage_path);
