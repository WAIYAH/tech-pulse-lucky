# Tech Pulse Insider / Get Techy With Lucky LMS

Production-ready React + TypeScript platform for:
- Public marketing website
- LMS course experience
- Student portal
- Admin operations dashboard

Live domain target: `https://techpulseinsider.com`

## Platform Overview

This project is structured as one integrated system:
- Public pages for discovery, content, webinars, and lead capture.
- LMS flows for free and paid courses.
- Private student portal at `/dashboard/*`.
- Private admin console at `/admin/*`.

Core goals:
- Keep routes predictable and scalable.
- Centralize navigation and route definitions.
- Improve technical SEO and on-page metadata.
- Preserve mobile usability and existing UI patterns.

## Route Structure

Canonical route map:

Public:
- `/`
- `/about`
- `/courses`
- `/courses/:slug`
- `/lms`
- `/webinars`
- `/events/:eventSlug`
- `/articles`
- `/articles/:slug`
- `/custom-training`
- `/community`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/editorial-policy`

Auth:
- `/login`
- `/register`
- `/forgot-password`

Student:
- `/dashboard`
- `/dashboard/overview`
- `/dashboard/progress`
- `/dashboard/my-courses`
- `/dashboard/learn/:courseSlug`
- `/dashboard/payments`
- `/dashboard/assignments`
- `/dashboard/certificates`
- `/dashboard/webinars`
- `/dashboard/resources`
- `/dashboard/support`
- `/dashboard/profile`
- `/dashboard/settings`

Admin:
- `/admin`
- `/admin/dashboard` (redirects to `/admin`)
- `/admin/students`
- `/admin/courses`
- `/admin/payments`
- `/admin/finance`
- `/admin/webinars`
- `/admin/articles`
- `/admin/content`
- `/admin/lms-control`
- `/admin/settings`

Legacy redirects:
- `/tips` -> `/articles`
- `/terms-of-service` -> `/terms`
- `/my-courses` -> `/dashboard/my-courses`
- `/dashboard/courses` -> `/dashboard/my-courses`

## Navigation System

Navigation is centralized in:
- `src/routes/routeConfig.ts`

This file defines:
- Canonical route constants (`routes.public`, `routes.auth`, `routes.student`, `routes.admin`).
- Public navbar links.
- Footer quick/resource links.

If you need to update menus or destination paths, update this file first.

## SEO Setup

SEO is implemented in layers:
- Base global metadata in `index.html`.
- Page-level SEO with reusable component:
  - `src/components/common/SEO.tsx`
  - `src/hooks/useSEO.ts`
- Crawl control and discovery files:
  - `public/robots.txt`
  - `public/sitemap.xml`
  - `public/manifest.json`

Current SEO behavior:
- Unique title/description/canonical applied on key public pages.
- Open Graph + Twitter tags managed per page.
- Structured data supported through `<SEO structuredData={...} />`.
- Private routes are excluded from crawl intent via `robots.txt`.

## Content and Data Sources

Courses:
- `src/data/courses.ts`

Webinars:
- `src/data/webinars.ts`

Articles:
- Markdown content in `src/content/articles/*.md`
- Metadata/index in `src/content/articles/index.ts`

LMS config:
- `src/data/lmsConfig.ts`

## Project Structure

```txt
src/
  components/
    common/
      SEO.tsx
    lms/
    ui/
    Navbar.tsx
    Footer.tsx
  contexts/
    AuthContext.tsx
  content/
    articles/
  data/
    courses.ts
    webinars.ts
    lmsConfig.ts
  hooks/
    useSEO.ts
  lib/
    admin/
    student/
    lms/
  pages/
    auth/
    admin/system/
    student/system/
    lms/
    (public pages)
  routes/
    routeConfig.ts
  types/
    lms.ts

public/
  robots.txt
  sitemap.xml
  manifest.json
  favicon.ico
```

## Auth and Protected Routes

Guards:
- `src/components/lms/AuthRoute.tsx`
- `src/components/lms/ProtectedRoute.tsx`
- `src/components/lms/AdminRoute.tsx`

Behavior:
- Unauthenticated users are redirected to `/login`.
- Admin-only routes are restricted to role `admin`.
- Auth pages redirect logged-in users to role-appropriate dashboards.

## Local Development

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Environment Variables

Create `.env` from `.env.example` and configure:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...

VITE_ENABLE_SUPABASE_AUTH=true
VITE_LMS_DATA_PROVIDER=supabase
VITE_ADMIN_EMAILS=admin@example.com
VITE_SITE_URL=https://techpulseinsider.com
```

Notes:
- `VITE_ENABLE_SUPABASE_AUTH=false` enables local auth mode.
- LMS provider falls back to mock/local data if Supabase is unavailable.

## Test Accounts (Local Auth Mode)

When `VITE_ENABLE_SUPABASE_AUTH=false`, bootstrap users are created for testing:
- Admin email is seeded from configured admin bootstrap logic.
- Student test account:
  - Email: `student@techpulseinsider.com`
  - Password: `LuckyStudent@2026!`

## How To Add New Pages

1. Create the page component under the relevant feature folder.
2. Add route constant in `src/routes/routeConfig.ts` when needed.
3. Register route in `src/App.tsx`.
4. Add nav link in route config arrays if it should appear in menus.
5. Add `<SEO />` metadata for public pages.

## How To Add New Courses

1. Add/modify records in `src/data/courses.ts`.
2. Ensure each course has:
   - Unique `slug`
   - Valid `lessons`
   - Clear pricing (`isFree`, `price`, `currency`)
3. Verify:
   - `/courses/:slug` renders properly
   - Enrollment/payment flow works
   - Student portal reflects status

## How To Add New Articles

1. Add markdown file under `src/content/articles/`.
2. Register metadata in `src/content/articles/index.ts`.
3. Confirm:
   - `/articles` listing includes it
   - `/articles/:slug` renders
   - Sitemap includes the public slug when appropriate

## How To Update Navigation Links

1. Edit `src/routes/routeConfig.ts`.
2. Use route constants in components/pages instead of hardcoded strings.
3. Run:
   - `npm run lint`
   - `npm run build`
4. Smoke test navbar, footer, dashboard sidebars, and CTA buttons.

## Deployment

Recommended: Vercel

1. Connect repository.
2. Configure environment variables.
3. Ensure Supabase migrations are applied if using Supabase provider.
4. Run production build checks before release.
5. Validate:
   - Public routes load and index correctly.
   - Protected routes require auth.
   - `robots.txt` and `sitemap.xml` are reachable.

## Supabase Migration Reference

LMS schema migration:
- `supabase/migrations/20260509190000_phase7_lms_schema_and_rls.sql`

Deployment checklist:
- `supabase/DEPLOYMENT_CHECKLIST.md`
