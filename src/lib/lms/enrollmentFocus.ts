/**
 * Enrollment focus window.
 *
 * While the window is open, the Web Development Masterclass is the only course
 * accepting NEW enrollments. Every other course still appears in the catalog but
 * renders as locked, and each enrollment/payment entry point refuses it.
 *
 * Students already enrolled elsewhere keep full access to what they paid for --
 * this gates new sign-ups only, so nobody loses a course they already own.
 *
 * Admin screens deliberately ignore this module: the admin still sees, edits and
 * reports on the whole catalog.
 *
 * To reopen the catalog early, flip `enabled` to false. Otherwise the lock lifts
 * by itself once `reopensOn` passes -- no code change needed.
 */
/** The one course carrying enrollments while the window is open. */
export const FOCUSED_COURSE_SLUG = "web-development-masterclass";

export const enrollmentFocus = {
  enabled: true,
  /** Catalog reopens automatically from this date (local time). */
  reopensOn: "2026-10-07",
  /** Slugs that stay open while the window is active. */
  openCourseSlugs: [FOCUSED_COURSE_SLUG] as readonly string[],
};

const reopenDate = (): Date => new Date(`${enrollmentFocus.reopensOn}T00:00:00`);

export const isEnrollmentFocusActive = (now: Date = new Date()): boolean => {
  if (!enrollmentFocus.enabled) return false;
  return now < reopenDate();
};

export const isCourseOpenForEnrollment = (
  slug: string,
  now: Date = new Date(),
): boolean => {
  if (!isEnrollmentFocusActive(now)) return true;
  return enrollmentFocus.openCourseSlugs.includes(slug);
};

export const isCourseLocked = (slug: string, now: Date = new Date()): boolean =>
  !isCourseOpenForEnrollment(slug, now);

/** e.g. "7 October 2026" -- used in badges and notices. */
export const enrollmentReopenLabel = (): string =>
  reopenDate().toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const lockedCourseNotice = (): string =>
  `Enrollment for this course is paused while the Web Development Masterclass cohort runs. It reopens on ${enrollmentReopenLabel()}.`;
