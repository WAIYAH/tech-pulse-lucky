# Supabase Deployment Checklist (LMS)

Use this checklist when promoting LMS changes to staging or production.

## 1) Pre-deploy

- [ ] Confirm local `npm run lint` passes (warnings acceptable, no errors)
- [ ] Confirm local `npm run build` passes
- [ ] Confirm `.env` values are present in deployment platform:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_ENABLE_SUPABASE_AUTH=true`
  - [ ] `VITE_LMS_DATA_PROVIDER=supabase`
  - [ ] `VITE_ADMIN_EMAILS` includes admin emails

## 2) Database migration

- [ ] Login and link Supabase project

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
```

- [ ] Push migrations

```bash
supabase db push
```

- [ ] Verify migration exists in remote history:
  - `20260509190000_phase7_lms_schema_and_rls.sql`

## 3) Post-migration DB checks

- [ ] Tables exist:
  - [ ] `profiles`
  - [ ] `courses`
  - [ ] `lessons`
  - [ ] `enrollments`
  - [ ] `payments`
  - [ ] `lesson_progress`
  - [ ] `assignments`
- [ ] Enums exist:
  - [ ] `lms_role`
  - [ ] `lms_course_level`
  - [ ] `lms_lesson_type`
  - [ ] `lms_access_status`
  - [ ] `lms_payment_status`
- [ ] RLS is enabled on all LMS tables
- [ ] `handle_new_user_profile()` trigger is active on `auth.users`

## 4) Admin bootstrap

- [ ] Create first admin account via app signup/login
- [ ] Promote role in SQL editor:

```sql
update public.profiles
set role = 'admin'
where email = '<ADMIN_EMAIL>';
```

- [ ] Verify admin can access `/admin`

## 5) Functional verification

### Student flow
- [ ] Register learner account
- [ ] Enroll in a free course
- [ ] Open `/learn/:courseSlug` for free course
- [ ] Submit paid-course payment request on `/payment/:courseSlug`
- [ ] Confirm status shown as `pending_payment`

### Admin flow
- [ ] Open `/admin/payments`
- [ ] Approve payment request
- [ ] Confirm learner access becomes `approved`
- [ ] Reject another payment and add note
- [ ] Confirm learner sees rejection status + note

### Access control
- [ ] Non-authenticated users cannot access `/dashboard` or `/admin`
- [ ] Non-admin users cannot access `/admin/*`
- [ ] Paid lessons remain locked until approval

## 6) Observability and rollback readiness

- [ ] Verify Supabase logs show no policy errors for happy-path flows
- [ ] Snapshot export/backups are confirmed
- [ ] Rollback strategy documented (revert app deployment + DB mitigation plan)

## 7) Go-live sign-off

- [ ] Product sign-off (UX/content)
- [ ] Security sign-off (RLS + route protections)
- [ ] Ops sign-off (env, migrations, monitoring)
- [ ] Announce release
