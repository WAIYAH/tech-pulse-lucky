# Tech Pulse Insider / Get Techy With Lucky LMS

Production-ready React + TypeScript platform for:
- Public marketing website
- LMS course experience
- Student portal
- Admin operations dashboard

Live domain target: `https://gettechy.nakolaexpertsystems.com`

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
- `/courses/web-development-masterclass` (static route, matched before `/courses/:slug`)
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
- `/dashboard/masterclass` (Web Development Masterclass overview)
- `/dashboard/masterclass/week/:weekNumber`
- `/dashboard/masterclass/final-project`

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
- `/admin/masterclass` (Cohorts / Curriculum / Final Projects / Certificates / Announcements / Attendance)
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

## Web Development Masterclass

A reusable 8-week cohort program (Program -> Cohort -> Week -> Lesson/Terminology/Quiz/Resources -> Final Project -> Certificate -> Attendance -> Announcements), built to be reused for future cohorts (2027+) without code changes. Full design rationale, security model, and current build status live in `PLAN.md`.

Key points:
- The 2026 Cohort's payment/enrollment reuses the existing `courses`/`enrollments`/`payments` tables unmodified — it is a `courses` row (`slug: web-development-masterclass`) like any other paid course, linked 1:1 to a `masterclass_cohorts` row. Future cohorts are a new course row + a new cohort row; the curriculum (`masterclass_weeks` and everything beneath it) is keyed to the program, not the cohort, so it is never duplicated.
- Quiz correct answers are never sent to the browser before submission: students read questions through the `masterclass_quiz_questions_public` view (no answer/explanation columns) and grade via the `submit_masterclass_quiz_attempt` Postgres RPC, which independently re-verifies enrollment server-side.
- Curriculum content is edited from `/admin/masterclass` (Curriculum tab) — Week 1 ships fully authored (56 terms, 5 lessons, a 14-question quiz) as the reference template; Weeks 2-8 ship with real but lighter content, extensible from the same UI.
- New Supabase objects live in `supabase/migrations/20260901090000_phase9_masterclass_schema_and_rls.sql` (schema + RLS + the quiz-grading RPC) and `supabase/migrations/20260901091500_phase9_masterclass_seed_content.sql` (seed data) — **these must be applied manually** to a live Supabase project (they are not run automatically); see `PLAN.md` section 29.
- Until those migrations are applied, the app does not break: every masterclass read falls back to the public-safe content in `src/data/masterclassContent.ts` (program + week metadata only — no gated content ever ships in the client bundle).

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
    masterclassContent.ts
  hooks/
    useSEO.ts
  lib/
    admin/
    student/
    lms/
    masterclass/
  pages/
    auth/
    admin/system/
      masterclass/
    student/system/
      masterclass/
    lms/
    (public pages)
  routes/
    routeConfig.ts
  types/
    lms.ts
    masterclass.ts

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
VITE_SITE_URL=https://gettechy.nakolaexpertsystems.com
```

Notes:
- `VITE_ENABLE_SUPABASE_AUTH=false` enables local auth mode (bootstrap accounts, no real backend). This project currently runs with it set to `true` against a real Supabase project — see "Supabase Setup Status" below.
- LMS provider falls back to mock/local data if Supabase is unreachable or a table is missing, so the app never hard-crashes, but real users need the real project configured.
- `VITE_SUPABASE_PUBLISHABLE_KEY` is the public/anon key — safe to ship to the browser. The database password and the `service_role`/`secret` key (from the Supabase dashboard's API settings) are **never** put in `.env` or any file that ships to the client; they grant full database access bypassing RLS.
- Set the same variables in your hosting provider's environment settings (e.g. Vercel Project Settings > Environment Variables) for production/preview deploys — `.env` is git-ignored and local-only.

## Supabase Setup Status

This project's own Supabase project (not a demo/placeholder) is live and migrated:
- Project: TechPulseInsider, region eu-west-2 (London).
- All four migrations applied, in order: `20260509190000_phase7_lms_schema_and_rls.sql`, `20260518103000_phase8_support_notifications_sync.sql`, `20260901090000_phase9_masterclass_schema_and_rls.sql`, `20260901091500_phase9_masterclass_seed_content.sql`.
- Real Supabase auth is enabled (`VITE_ENABLE_SUPABASE_AUTH=true`); local mock accounts no longer work.

To set this up again from scratch (a new environment, a staging project, disaster recovery):
1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard) (or `supabase projects create <name> --org-id <id> --region <region>` if the CLI is authenticated).
2. Copy the Project URL and the publishable (anon) key into `.env` (Project Settings > API > "Framework" tab gives you both, formatted for a client library like `@supabase/supabase-js`, which is what this app uses).
3. Link and push migrations: `supabase link --project-ref <ref>` then `supabase db push` — this applies every file in `supabase/migrations/` in filename order.
4. Set `VITE_ENABLE_SUPABASE_AUTH=true` and `VITE_ADMIN_EMAILS` to your real admin email(s).
5. Create your admin account by registering normally at `/register`, then promote it: `update public.profiles set role = 'admin' where email = 'you@example.com';` in the Supabase SQL editor (or pass `user_metadata: { role: "admin" }` when creating the user via the Admin API, which the signup trigger reads automatically).
6. Restart the dev server (`npm run dev`) — Vite only reads `.env` at startup, not on hot reload.

## Test Accounts

With `VITE_ENABLE_SUPABASE_AUTH=true` (current setup), there are no bootstrap accounts — sign up for a real account at `/register`, or use whatever real admin account was created per the steps above.

With `VITE_ENABLE_SUPABASE_AUTH=false` (local auth mode, no backend needed), bootstrap accounts exist automatically:
- Admin: seeded from configured admin bootstrap logic.
- Student: `student@nakolaexpertsystems.com` / `LuckyStudent@2026!`

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

Recommended: Cloudflare Pages, connected to this repo's GitHub remote.

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select this repository, branch `main`.
2. Build command `npm run build`, output directory `dist` (`.nvmrc` pins the Node version automatically).
3. Configure environment variables (same names as `.env` — see "Environment Variables" above; Cloudflare Pages does not read your local `.env` file, you re-enter them in its dashboard) for both Production and Preview.
4. Ensure Supabase migrations are applied (see "Supabase Setup Status" above) — this is done for the current project.
5. Deploy, then add the custom domain under the Pages project's "Custom domains" settings (`gettechy.nakolaexpertsystems.com`) and add the DNS record Cloudflare provides wherever the domain's DNS is managed.
6. Run production build checks before release: `npm run lint && npm run build`.
7. Validate:
   - Public routes load and index correctly.
   - Direct-loading a deep link (e.g. `/about`) works via the `public/_redirects` SPA fallback.
   - Protected routes require auth.
   - `robots.txt` and `sitemap.xml` are reachable.
   - Login works with a real account (not a stale local-mode test account).

`public/_redirects` and `public/_headers` provide a SPA routing fallback and security headers; `wrangler.jsonc`'s `assets.not_found_handling: "single-page-application"` does the same SPA-fallback job at the platform level (Cloudflare does not read `vercel.json`, which remains in the repo only for reference/rollback to Vercel).

Because a `wrangler.jsonc` exists in the repo, Cloudflare's Git-integration build runs `npx wrangler deploy` (not the older `wrangler pages deploy`) as its deploy step — this serves the site as a Worker with static assets rather than classic Pages, but behaves identically from a hosting perspective (same custom domain setup, same dashboard project view under "Workers & Pages").

### Alternative: deploy from the CLI

`wrangler.jsonc` and the `wrangler` devDependency are already set up, so a one-off deploy doesn't require the Git integration at all:

```bash
npx wrangler login   # once, opens a browser to authorize this machine
npm run cf:deploy     # builds and pushes dist/ straight to Cloudflare
```

This creates/updates the `gettechy` project directly. Environment variables still need to be set in the Cloudflare dashboard (project → Settings → Variables and Secrets) since `wrangler deploy` doesn't read `.env`.

This is a static single-page app (Vite build output = plain HTML/CSS/JS) talking to Supabase directly from the browser — there is no separate backend server to containerize or deploy. **Docker is not required to run or host this project.** Docker only appears in this codebase as *course content* the Masterclass program teaches students in Week 7 (`supabase/migrations/.../phase9...` seeds a lesson on containers/Dockerfiles) — that is unrelated to this platform's own infrastructure.

### What else is actually needed before this is fully production-ready

- **Real KCB Paybill details**: confirm `src/data/lmsConfig.ts`'s `paybillNumber`/`accountNumber`/`accountName` are the real business ones, not placeholders, before advertising paid enrollment.
- **Domain/DNS/SSL**: only relevant if `gettechy.nakolaexpertsystems.com` isn't already pointed at the Cloudflare Pages deployment — not something this repo controls.
- **Regenerate `src/integrations/supabase/types.ts`**: currently stale/empty (`supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts`); every provider in this codebase already works around this with hand-rolled types, so it's a nice-to-have for stronger type safety, not a blocker.
- **A second admin, if wanted**: add more emails (comma-separated) to `VITE_ADMIN_EMAILS`, or set `role: "admin"` in a user's metadata the same way the first admin account was created.
- **Automated tests**: none exist in this repo today (no vitest/jest); verification has been manual + scripted-browser (Playwright) checks. Optional to add, not required to ship.
- **Not needed**: Docker, a separate backend/API server, an ORM (Supabase's client library is used directly), or a message queue/cache layer — this platform's whole backend surface is Supabase (Postgres + Auth + RLS + PostgREST).

## Supabase Migration Reference

LMS schema migration:
- `supabase/migrations/20260509190000_phase7_lms_schema_and_rls.sql`

Support/notifications sync:
- `supabase/migrations/20260518103000_phase8_support_notifications_sync.sql`

Web Development Masterclass:
- `supabase/migrations/20260901090000_phase9_masterclass_schema_and_rls.sql`
- `supabase/migrations/20260901091500_phase9_masterclass_seed_content.sql`

All four are applied to the current live project (see "Supabase Setup Status" above). To reproduce on a new project, `supabase link --project-ref <ref>` then `supabase db push` applies all of them in filename order in one step.

Deployment checklist:
- `supabase/DEPLOYMENT_CHECKLIST.md`
