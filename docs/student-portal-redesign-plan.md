# Student Portal Redesign Plan

Scope: the private student dashboard shell and pages under `/dashboard/*` (`StudentPortalLayout.tsx` and everything it wraps). Does not touch the public marketing site, the admin console, or the overall brand palette — it applies the palette that already exists more boldly inside the student portal specifically.

## Why

The student dashboard currently reads as a generic, muted SaaS shell: no profile identity anywhere, a header cluttered with icon+text buttons, and a "My Courses" page that only shows courses a student is *already* enrolled in — sending them back out to the public marketing site just to see what else is available. This plan closes those gaps and gives the portal more visual energy consistent with the site's existing (but underused, inside the dashboard) blue/yellow brand system.

## Current state (verified by direct exploration, not assumed)

- **Header** (`src/pages/student/system/StudentPortalLayout.tsx:208-314`): mobile hamburger, desktop sidebar-collapse toggle, page title + description, then a right-hand cluster of three separate icon+text buttons — Notifications, **Browse Courses** (links to public `/courses`), Logout. No avatar, no dropdown menu anywhere in the app; the shadcn `Avatar` primitive exists but is unused.
- **Sidebar** (`src/pages/student/system/studentNavigation.ts`): 13 items, each with a label + description subtext. "My Courses" (`/dashboard/my-courses`) shows only existing enrollments — there is no catalog/browse entry.
- **"My Courses" page**: filters over `enrollments` only; empty state links out to the public `/courses` page. The full course catalog (`courses`/`courseById`) is *already* fetched into `StudentPortalContext` — it's just never rendered as a browse UI.
- **Webinars page**: informational list of upcoming webinars (local-storage-backed), no registration action in-dashboard either — but at least it *shows* the data, which is the behavior being asked for courses too.
- **Profile page** (`StudentProfilePage.tsx`): editable bio/job/links fields persisted to `localStorage` only (not Supabase), plus a read-only account snapshot. No photo/avatar section.
- **Avatar infrastructure**: `LmsProfile` type has no avatar field, the `profiles` table has no `avatar_url` column, no Supabase Storage bucket exists, and there is no file-upload pattern anywhere in this codebase to copy — admin image fields today are plain URL text inputs. This is being built from scratch.
- **Color system** (`src/index.css`): `--primary` (deep blue) and `--accent` (vivid yellow, `48 100% 50%`) are both already defined site-wide, with `--gradient-primary`, `--gradient-accent`, `--gradient-hero`, and glow shadows (`--shadow-glow`, `--shadow-accent-glow`) ready to use. The student portal shell currently uses almost none of this, leaning on neutral `card`/`muted` tokens instead.

## Decisions made while planning (flagging for visibility, not silently assuming)

- **Header reduced to icon-only.** Notifications stays as an icon-only bell (with its unread badge) since dropping visibility of new alerts would be a real regression nobody asked for — but its text label is removed. Logout moves out of the header entirely and into the new profile dropdown, as requested. "Browse Courses" is removed from the header and added as a proper sidebar entry (it didn't already exist on the sidebar — the request assumed it did, so this plan adds it there for real).
- **Structural chrome stays.** The mobile hamburger and desktop sidebar-collapse toggle are kept — they're navigation controls, not "descriptive wording," and removing them would break basic usability on smaller screens.
- **Header page-title trimmed.** The current label *and* description subtext (e.g. "Overview" / "Your learning dashboard and activity") collapses to just the short label — the description was the clearest instance of unnecessary wording in the shell.
- **New avatar dropdown**: Profile, Settings, a separator, then Logout — matching the exact order requested.
- **New route for course browsing**: `/dashboard/browse-courses` (existing `/dashboard/courses` already redirects to `/dashboard/my-courses` as a legacy alias — left untouched rather than repurposed, to avoid breaking any existing links).

## Phase 1 — Header & sidebar shell

- Add a profile avatar (photo if set, initials fallback otherwise, using the existing unused shadcn `Avatar` primitive) as the header's only right-side identity element, opening a dropdown: **Profile → Settings → ── → Logout**.
- Strip text labels from the notification bell; remove the standalone Logout button and the "Browse Courses" button from the header entirely.
- Trim the header's page-title area to a single short line.
- Add a new **Browse Courses** entry to the sidebar (and the bottom mobile tab bar), pointing at the new Phase 3 route.
- Replace the sidebar footer's plain-text "Signed in as {email}" with the avatar + name.
- Apply the brand's blue/yellow system more visibly across the shell: active-nav-item state, sidebar branding block, avatar ring, using the existing gradient/glow tokens rather than inventing new colors.

## Phase 2 — Profile picture upload

- New Supabase migration: `avatar_url` column on `profiles`, a new `avatars` storage bucket, and RLS policies (a user may write only their own file; avatars are publicly readable since they're just display photos).
- Extend `LmsProfile` and the `userToProfile()` mapping in `AuthContext.tsx` to carry `avatarUrl`.
- Build a reusable upload component (file picker, type/size validation, preview, upload to Storage, then update `profiles.avatar_url`) — this is the project's first real file-upload feature, so it's built cleanly enough to reuse later if needed (e.g. admin).
- Add a "Profile Picture" section to the Student Profile page using it.
- Wire the uploaded photo into the header avatar and sidebar footer from Phase 1.

## Phase 3 — In-dashboard course catalog

- New page at `/dashboard/browse-courses`, rendered inside the dashboard shell, reusing the course data already loaded in `StudentPortalContext` (no backend work needed) with the same search/category/price/level filtering the public Courses page already has.
- Card grid: free courses get an inline "Enroll" action (reusing the existing `enrollInFreeCourse` provider call); paid courses route into the existing `/payment/:slug` flow.
- Update "My Courses"'s empty-state CTA to point here instead of out to the public site.

## Phase 4 — Extend the visual pass + polish

- Carry the brighter, more intentional use of the blue/yellow system (gradients, glow shadows, accent highlights) into the remaining student pages (Overview, Progress, Certificates, Payments, etc.) for consistency with the redesigned shell.
- Sweep the rest of the portal for any other over-descriptive copy in the same spirit as the header cleanup.
- Stretch/optional, not required for this request: a lightweight "interested" action on the Webinars page, for symmetry with the new course-browsing capability.

## Verification per phase

- `npm run build` and `npm run lint` after each phase.
- Manual click-through in the browser: dropdown opens/closes/keyboard-navigable, avatar upload round-trips through Supabase Storage and persists across reload, course browsing filters correctly and a free-course enroll actually creates an enrollment row, sidebar/header responsive behavior still works at mobile widths.
