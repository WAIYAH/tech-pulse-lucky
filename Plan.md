# Tech Pulse Insider LMS Implementation Plan

## 1) Vision and Product Direction

Build a practical, modern, and secure Learning Management System (LMS) inside the current Tech Pulse Insider platform so that:

- Free content is easy to discover and enroll in.
- Paid masterclasses are monetized through a clear KCB Paybill workflow.
- Learners can track progress with a clean dashboard experience.
- Admins can manage courses, learners, and payment approvals efficiently.

This LMS will be an extension of the existing product, not a separate app.

---

## 2) Current Platform Analysis Summary

### 2.1 Existing Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Framer Motion animations
- React Router
- Supabase client present (auth/database not fully modeled yet)

### 2.2 Existing UX and Brand Language

- Strong blue/yellow identity with white backgrounds and dark text
- Rounded cards and rounded CTA buttons
- Gradient hero and CTA sections
- Motion-driven reveal animations
- Card-based sections with clear CTAs
- Mobile-first responsive grid layouts

### 2.3 Existing Routing and Layout Behavior

- Shared app shell: sticky navbar, global footer, floating WhatsApp button
- Public informational routes already established
- No current RBAC routes for student/admin workflows

### 2.4 Integration Requirement

LMS pages must reuse current styling tokens, spacing rhythm, interaction patterns, and route conventions so the LMS feels native to Tech Pulse Insider.

---

## 3) Scope and Feature Definition

### 3.1 Must-Have Functional Scope

- User registration and login
- Course catalog with free/paid distinctions
- Course detail pages with curriculum visibility
- Free enrollment flow
- Paid access request flow via manual KCB Paybill confirmation
- Student dashboards and progress tracking
- Admin dashboard with payment approval/rejection
- Locked access for unpaid/unapproved paid courses

### 3.2 Nice-to-Have Scope (Placeholders Included)

- Certificate placeholders
- Quiz/assignment placeholders
- Notification hooks (email/WhatsApp) placeholders
- Future API integration hooks (M-Pesa/KCB API)

---

## 4) Role Model and Access Control

### 4.1 Roles

- `guest`: public browsing only
- `student`: learning and enrollment actions
- `admin`: full LMS management actions

### 4.2 Core Authorization Rules

- Admin routes only accessible by `admin`
- Student routes require authentication
- Paid course learning route requires approved payment access
- Free learning route requires free enrollment
- Client-side guards + backend policy enforcement (when Supabase tables and RLS are active)

---

## 5) Route Architecture

### 5.1 Public LMS Routes

- `/lms`
- `/courses`
- `/courses/:slug`
- `/register`
- `/login`
- `/forgot-password`

### 5.2 Student Routes

- `/dashboard`
- `/my-courses`
- `/learn/:courseSlug`
- `/payment/:courseSlug`

### 5.3 Admin Routes

- `/admin`
- `/admin/courses`
- `/admin/payments`
- `/admin/users`

---

## 6) Data and Domain Model

### 6.1 Core Entities

- Profiles
- Courses
- Lessons
- Enrollments
- Payments
- Lesson Progress
- Assignments/Quizzes (initial placeholder)

### 6.2 Access and Payment State Enums

- Enrollment access: `free`, `pending_payment`, `approved`, `rejected`
- Payment status: `pending`, `approved`, `rejected`

---

## 7) Payment Flow (Manual KCB Paybill First)

### 7.1 Student Flow

1. Student opens paid course details.
2. Student proceeds to payment page.
3. Student follows KCB Paybill instructions.
4. Student submits payment confirmation form and M-Pesa code.
5. Payment becomes `pending`.
6. Admin reviews and updates to `approved` or `rejected`.
7. Access unlocks only when status is `approved`.

### 7.2 Admin Flow

1. Review pending submissions in `/admin/payments`.
2. Verify transaction details.
3. Approve or reject with optional admin note.
4. Enrollment state is synchronized with decision.

---

## 8) Security Baseline

- Route guards for student/admin pages
- Strict content gating logic for paid lessons
- Environment variable usage for backend keys
- Input validation for all forms
- No private credentials hardcoded in frontend code
- RLS-ready schema and least-privilege query patterns

---

## 9) UI/UX Direction for LMS

- Reuse existing `index.css` design tokens and gradients
- Preserve card-heavy, CTA-first structure
- Keep forms short and practical
- Add clear status indicators (badges, progress bars, banners)
- Include loading, empty, success, and error states on all pages
- Maintain mobile-first layout consistency

---

## 10) Implementation Phases

### 10.0 Current Status (Updated: 2026-05-09)

- Phase 0: Completed
- Phase 1: Completed
- Phase 2: Completed
- Phase 3: Completed
- Phase 4: Completed
- Phase 5: Completed
- Phase 6: Completed
- Phase 7: Completed
- Phase 8: Completed

## Phase 0: Safety and Baseline

- Snapshot current routes and page behavior
- Confirm build/lint baseline
- Avoid regressions in existing public pages

## Phase 1: Foundation (Start Immediately)

- Create LMS domain types (`src/types/lms.ts`)
- Create LMS config (`src/data/lmsConfig.ts`)
- Create sample courses + lessons data (`src/data/courses.ts`)
- Create data provider abstraction with:
  - mock/local provider
  - Supabase adapter scaffold
  - provider factory (`src/lib/lms/*`)

## Phase 2: Auth and RBAC

- Add auth context/provider hooks
- Implement `ProtectedRoute`, `AdminRoute`, and course-access guard
- Add register/login/forgot-password pages and wiring

## Phase 3: Public LMS Pages

- Build `/lms`, `/courses`, `/courses/:slug`
- Add search/filtering and CTA routing

## Phase 4: Enrollment and Payment Flows

- Free enrollment actions
- Paid payment request flow on `/payment/:courseSlug`
- Status synchronization between payments and enrollments

## Phase 5: Student Experience

- Build `/dashboard`, `/my-courses`, `/learn/:courseSlug`
- Lesson completion and progress calculations
- Locked screen for unauthorized course access

## Phase 6: Admin Experience

- Build `/admin`, `/admin/courses`, `/admin/payments`, `/admin/users`
- Course CRUD + lesson management UI
- Payment review workflow with notes

## Phase 7: Supabase Schema + RLS

- Add SQL migrations and table definitions
- Add role-aware RLS policies
- Switch provider mode to Supabase

## Phase 8: QA, Hardening, and Documentation

- Regression test existing website routes
- Validate edge cases for access controls and status states
- Update README with LMS setup and workflows

---

## 11) Initial Course Catalog (Seed Plan)

### Free Courses

1. Basics of Computers, Phones & Internet 101
2. Safe Internet Browsing & Online Security
3. AI & Machine Learning: Getting Started
4. Digital Marketing for Tech Startups

### Paid Courses

1. Web Development Using HTML, CSS & JavaScript
2. Advanced Software Engineering with JavaScript, XAMPP & MySQL
3. DevOps & Cloud Computing
4. Git, GitHub & Developer Portfolio Masterclass

---

## 12) Folder Structure Targets

```txt
src/
  components/
    lms/
  pages/
    admin/
  data/
    courses.ts
    lmsConfig.ts
  lib/
    lms/
  types/
    lms.ts
```

---

## 13) Acceptance Criteria

- LMS appears integrated and visually consistent with existing product
- Existing routes remain functional and unbroken
- Free enrollment and paid manual verification flow both work end-to-end
- Admin can approve/reject payments and control paid access
- Course progress is visible and updates with lesson completion
- Architecture supports migration from mock provider to Supabase provider

---

## 14) Risks and Mitigation

### Risk: Route conflicts or shell regressions
- Mitigation: append-only route additions and smoke testing existing pages

### Risk: Incomplete backend schema at UI build time
- Mitigation: mock provider + adapter abstraction first

### Risk: Unauthorized paid content access
- Mitigation: explicit access checks on route-level and content rendering

---

## 15) Execution Start Point

Execution begins with **Phase 1**, implementing LMS types, config, sample course data, and provider abstraction files.
