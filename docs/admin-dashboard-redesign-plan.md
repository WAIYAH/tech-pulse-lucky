# Admin Dashboard Redesign Plan

Scope: the admin console shell and all pages under `/admin/*` (`AdminLayout.tsx` and everything it wraps, including the nested masterclass subsystem). Brings the admin side up to the same standard as the just-completed student portal redesign — same color system, same icon-driven minimal-text header, same semantic badge/button coloring.

## Why

The admin console is functionally complete but visually untouched — plain neutral surfaces, a header still cluttered with icon+text buttons, no avatar, no search, and status badges that are almost universally flattened to gray regardless of actual state (several pages already compute the *correct* semantic icon color right next to the badge, they just don't use it on the badge itself). One real bug was found along the way: the Support page's "Resolve" button is red (`destructive`) for what's a positive, ticket-closing action.

## Phases (implementing one at a time, pausing for review after each)

**Phase 1 — Header & sidebar shell**
- Header: replace the icon+text "Back to Site" / "Logout" buttons with an icon-only "Back to Site" action, a search icon opening a Cmd/Ctrl+K command palette (admin nav only, mirroring the student portal's), and a profile avatar dropdown (Settings, Support, Logout — there's no separate admin "Profile" page, account info already lives on Settings).
- Header title trimmed to a single line (drop the description subtext).
- Sidebar: labels only (drop description subtext under each of the 12 items), bold `gradient-primary` + `shadow-glow` active state, sidebar brand block using the shared `gradient-hero` token, avatar+name footer instead of plain email text.

**Phase 2 — Fix the real bug + wire up semantic status colors**
- Support page: "Resolve" button `destructive` → `success`.
- Wire the already-added `success`/`warning`/`destructive` badge variants into every page that currently hardcodes `variant="secondary"` for a stateful value where a matching icon color already exists nearby: Payments, Support, Finance, Overview's payment badges, Students' payment-status badges, LMS Control's on/off feature toggles.

**Phase 3 — Stat-card icons, button color variety, and copy cleanup on the remaining main pages**
- Add colored icon chips to stat cards that don't have any (Students, Webinars, Articles, Support, Settings, LMS Control).
- Diversify Save/Create/Update buttons beyond uniform blue where it makes sense (e.g. `success` for save/create actions).
- Trim dev-facing jargon copy ("Full CRUD controls for...", "robots profile") on Courses/Webinars/Content; remove LMS Control's redundant "Feature Flags" card that just re-displays the toggles already shown above it.

**Phase 4 — Masterclass subsystem (6 tabs, 11 files)**
- Add icons and semantic badge coloring to cohort status, certificate status, attendance, and final-project approval state — currently zero icon usage and no color-coded status anywhere in this subsystem.
- The quiz panel (460 lines, the largest file here) gets a careful manual pass rather than a mechanical one given its conditional MCQ/true-false form logic.

**Phase 5 — New capabilities (optional, confirm before starting)**
- Admin avatar upload: the underlying `avatar_url` column, storage bucket, RLS policies, and `AvatarUpload` component are already built and aren't student-specific (RLS is keyed on `auth.uid()`, not role) — this would just be adding the existing component to the Settings page.
- An admin Notifications page, if wanted — none exists today, unlike the student side.

## Verification per phase

`npx tsc --noEmit`, `npm run lint`, `npm run build`, then a live browser pass (logged in as the real admin account) with screenshots before reporting each phase done.
