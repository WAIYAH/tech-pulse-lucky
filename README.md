# Tech Pulse Insider LMS (Get Techy With Lucky)

This repository powers the Tech Pulse Insider website and now includes a full LMS extension for free and paid learning programs.

Live site: https://tech-pulse-lucky.vercel.app/

## LMS Overview

The LMS is built as a native extension of the existing brand, routes, and UX patterns.

Core goals:
- Support free and paid courses
- Gate paid lessons until admin payment approval
- Provide learner dashboard and progress tracking
- Provide admin tools for courses, payments, and users
- Stay mobile-first and production-ready

## LMS Features

### Public
- `/lms` landing page
- `/courses` searchable/filterable course catalog
- `/courses/:slug` course details with curriculum, outcomes, requirements, FAQ

### Auth
- `/register`
- `/login`
- `/forgot-password`
- Local auth mode and Supabase auth mode support

### Student
- `/dashboard`
- `/my-courses`
- `/learn/:courseSlug`
- `/payment/:courseSlug`

Student capabilities:
- Enroll in free courses
- Submit paid-course payment confirmation
- View payment status (`pending`, `approved`, `rejected`)
- Track lesson completion and course progress
- Access locked-course guidance when approval is missing

### Admin
- `/admin`
- `/admin/courses`
- `/admin/payments`
- `/admin/users`

Admin capabilities:
- Create/update/delete courses and lessons
- Review payment confirmations
- Approve/reject payments with notes
- Manage learner access status for paid content

## Payment Workflow (KCB Paybill)

Configured method:
- Paybill Number: `522522`
- Account Number: `1315657899`
- Account Name: set in `src/data/lmsConfig.ts`

Student flow:
1. Student opens paid course.
2. Student follows KCB Paybill instructions.
3. Student submits payment form with M-Pesa transaction code.
4. Status becomes `pending`.
5. Admin reviews in `/admin/payments`.
6. Admin approves or rejects.
7. Course unlocks only after approval.

Security note: paid lessons are not unlocked automatically by submission; approval is mandatory.

## Tech Stack

- React 18 + TypeScript + Vite
- React Router
- Tailwind CSS + shadcn/ui
- Framer Motion
- Supabase (Auth + Postgres + RLS-ready schema)

## Project Structure (LMS)

```txt
src/
  components/
    lms/
      AdminRoute.tsx
      AuthRoute.tsx
      CourseCard.tsx
      CourseProgress.tsx
      LessonSidebar.tsx
      ProtectedRoute.tsx
  contexts/
    AuthContext.tsx
  data/
    courses.ts
    lmsConfig.ts
  lib/
    lms/
      index.ts
      mockProvider.ts
      service.ts
      supabaseProvider.ts
  pages/
    auth/
      Login.tsx
      Register.tsx
      ForgotPassword.tsx
    lms/
      LMSLanding.tsx
      Courses.tsx
      CourseDetails.tsx
      StudentDashboard.tsx
      MyCourses.tsx
      LearnCourse.tsx
      PaymentPage.tsx
    admin/
      AdminDashboard.tsx
      AdminCourses.tsx
      AdminPayments.tsx
      AdminUsers.tsx
  types/
    lms.ts

supabase/
  migrations/
    20260509190000_phase7_lms_schema_and_rls.sql
```

## Setup Instructions

### 1) Install

```bash
npm install
```

### 2) Configure environment

Create `.env` with:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...

# LMS/auth behavior
VITE_ENABLE_SUPABASE_AUTH=true
VITE_LMS_DATA_PROVIDER=supabase

# Comma-separated admin emails
VITE_ADMIN_EMAILS=admin@example.com
```

Notes:
- `VITE_LMS_DATA_PROVIDER` supports `supabase` or `mock`.
- If Supabase config is missing/unavailable, the LMS provider falls back to mock storage mode.

### 3) Run locally

```bash
npm run dev
```

### 4) Validate

```bash
npm run lint
npm run build
```

## Supabase Setup Instructions

### 1) Link project

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
```

### 2) Apply migrations

```bash
supabase db push
```

This creates LMS tables, enums, triggers, and RLS policies from:
- `supabase/migrations/20260509190000_phase7_lms_schema_and_rls.sql`

### 3) Promote first admin user

After the first admin account signs up, set role to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

### 4) Verify RLS-sensitive flows

- Student can read only own payments/enrollments/progress.
- Student cannot approve own payment.
- Paid lessons stay locked until enrollment is `approved`.

## QA Hardening Summary (Phase 8)

Completed:
- Lint blockers fixed (TypeScript/ESLint errors)
- Build verified
- Payment hardening:
  - client submits canonical course price
  - provider rejects underpayments
- Access hardening:
  - free-course access logic aligned with RLS-accepted statuses
- Data safety improvements:
  - removed unsafe `any` usage in LMS mock provider
  - fixed lesson sort mutation on course details page

## User Workflow

1. Register/Login.
2. Browse courses.
3. Enroll directly for free courses.
4. For paid courses, submit payment confirmation.
5. Wait for admin approval.
6. Learn through lessons and track progress.

## Admin Workflow

1. Login as admin.
2. Manage courses in `/admin/courses`.
3. Review payment requests in `/admin/payments`.
4. Approve/reject with notes.
5. Monitor users and enrollments in `/admin/users`.

## Deployment Instructions

### Vercel (recommended)
1. Connect repository to Vercel.
2. Set environment variables in project settings.
3. Ensure Supabase migration has been applied before production traffic.
4. Deploy and validate key routes:
   - `/lms`
   - `/courses`
   - `/dashboard`
   - `/admin`

### Post-deploy smoke test
- Register student account
- Enroll in a free course
- Submit paid-course payment request
- Approve payment as admin
- Confirm paid lessons unlock

## Future Improvements

- Real M-Pesa/KCB API integration
- Email notifications for payment approvals/rejections
- Certificate issuance
- Assignment and quiz submission endpoints
- Live class links and session attendance
- Reporting and analytics dashboard

## Supabase Deployment Checklist

A step-by-step operations checklist is available here:
- `supabase/DEPLOYMENT_CHECKLIST.md`

---

If you are onboarding a new maintainer, start with:
1. `src/types/lms.ts`
2. `src/lib/lms/service.ts`
3. `src/lib/lms/supabaseProvider.ts`
4. `supabase/migrations/20260509190000_phase7_lms_schema_and_rls.sql`
