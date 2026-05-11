import { allCourses, featuredCourseSlugs, filterCourses } from "@/data/courses";
import { lmsConfig } from "@/data/lmsConfig";
import type {
  AdminCourseUpsertInput,
  AdminPaymentUpdateInput,
  AdminUserOverview,
  LmsConfig,
  LmsCourse,
  LmsCourseFilters,
  LmsEnrollment,
  LmsLesson,
  LmsLessonProgress,
  LmsPayment,
  PaymentSubmissionInput,
} from "@/types/lms";
import type { LmsDataProvider } from "./service";

const STORAGE_KEYS = {
  courses: "lms_courses",
  enrollments: "lms_enrollments",
  payments: "lms_payments",
  lessonProgress: "lms_lesson_progress",
} as const;

const LOCAL_USERS_KEY = "lms_auth_users";
const isBrowser = typeof window !== "undefined";

interface LocalAuthUserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "student" | "admin";
  dateJoined: string;
}

const generateId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export class MockLmsProvider implements LmsDataProvider {
  private readonly config: LmsConfig;
  private readonly seedCourses: LmsCourse[];
  private memoryState: {
    courses: LmsCourse[];
    enrollments: LmsEnrollment[];
    payments: LmsPayment[];
    lessonProgress: LmsLessonProgress[];
  };

  constructor(options?: { config?: LmsConfig; courses?: LmsCourse[] }) {
    this.config = options?.config ?? lmsConfig;
    this.seedCourses = options?.courses ?? allCourses;
    this.memoryState = {
      courses: clone(this.seedCourses),
      enrollments: [],
      payments: [],
      lessonProgress: [],
    };
  }

  getConfig(): LmsConfig {
    return clone(this.config);
  }

  async listCourses(filters?: LmsCourseFilters): Promise<LmsCourse[]> {
    return filterCourses(this.readCourses(), filters);
  }

  async getCourseBySlug(slug: string): Promise<LmsCourse | null> {
    return this.findCourseBySlug(slug) ?? null;
  }

  async getFeaturedCourses(limit = 4): Promise<LmsCourse[]> {
    return this.readCourses()
      .filter((course) => featuredCourseSlugs.includes(course.slug))
      .slice(0, limit);
  }

  async getCourseCategories(): Promise<string[]> {
    return Array.from(
      new Set(this.readCourses().map((course) => course.category)),
    ).sort();
  }

  async getEnrollments(userId: string): Promise<LmsEnrollment[]> {
    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );
    return enrollments
      .filter((enrollment) => enrollment.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async enrollInFreeCourse(
    userId: string,
    courseSlug: string,
  ): Promise<LmsEnrollment> {
    const course = this.findCourseBySlug(courseSlug);
    if (!course) {
      throw new Error("Course not found.");
    }

    if (!course.isFree) {
      throw new Error("This course requires payment approval.");
    }

    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );

    const existing = enrollments.find(
      (enrollment) =>
        enrollment.userId === userId && enrollment.courseId === course.id,
    );

    if (existing) {
      return existing;
    }

    const createdAt = new Date().toISOString();
    const enrollment: LmsEnrollment = {
      id: generateId(),
      userId,
      courseId: course.id,
      accessStatus: "free",
      progress: 0,
      createdAt,
      updatedAt: createdAt,
    };

    enrollments.push(enrollment);
    this.writeArrayToStorage(STORAGE_KEYS.enrollments, enrollments, "enrollments");
    return enrollment;
  }

  async submitPaymentRequest(input: PaymentSubmissionInput): Promise<LmsPayment> {
    const course = this.findCourseBySlug(input.courseSlug);
    if (!course) {
      throw new Error("Course not found.");
    }

    if (course.isFree) {
      throw new Error("Free courses do not require payment submission.");
    }
    if (input.amount < course.price) {
      throw new Error(
        `Paid amount must be at least ${course.currency} ${course.price}.`,
      );
    }

    const now = new Date().toISOString();

    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    );

    const existingCoursePayments = payments
      .filter(
        (payment) =>
          payment.userId === input.userId && payment.courseId === course.id,
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const latestPayment = existingCoursePayments[0];

    if (latestPayment?.status === "pending") {
      throw new Error(
        "You already have a pending payment request for this course. Please wait for admin review.",
      );
    }

    if (latestPayment?.status === "approved") {
      throw new Error("This course payment is already approved for your account.");
    }

    const payment: LmsPayment = {
      id: generateId(),
      userId: input.userId,
      courseId: course.id,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      amount: input.amount,
      currency: course.currency,
      transactionCode: input.transactionCode,
      paymentDate: input.paymentDate,
      status: "pending",
      screenshotUrl: input.screenshotUrl,
      createdAt: now,
      updatedAt: now,
    };

    payments.push(payment);
    this.writeArrayToStorage(STORAGE_KEYS.payments, payments, "payments");

    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );

    const existingEnrollment = enrollments.find(
      (enrollment) =>
        enrollment.userId === input.userId && enrollment.courseId === course.id,
    );

    if (!existingEnrollment) {
      enrollments.push({
        id: generateId(),
        userId: input.userId,
        courseId: course.id,
        accessStatus: "pending_payment",
        progress: 0,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      existingEnrollment.accessStatus = "pending_payment";
      existingEnrollment.updatedAt = now;
    }

    this.writeArrayToStorage(STORAGE_KEYS.enrollments, enrollments, "enrollments");
    return payment;
  }

  async getPaymentsForUser(userId: string): Promise<LmsPayment[]> {
    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    );

    return payments
      .filter((payment) => payment.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getAllPayments(): Promise<LmsPayment[]> {
    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    );

    return payments.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async updatePaymentStatus(
    input: AdminPaymentUpdateInput,
  ): Promise<LmsPayment | null> {
    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    );

    const payment = payments.find((row) => row.id === input.paymentId);
    if (!payment) {
      return null;
    }

    payment.status = input.status;
    payment.adminNote = input.adminNote;
    payment.updatedAt = new Date().toISOString();
    this.writeArrayToStorage(STORAGE_KEYS.payments, payments, "payments");

    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );
    const enrollment = enrollments.find(
      (row) => row.userId === payment.userId && row.courseId === payment.courseId,
    );

    const targetStatus =
      input.status === "approved"
        ? "approved"
        : input.status === "rejected"
          ? "rejected"
          : "pending_payment";

    if (enrollment) {
      enrollment.accessStatus = targetStatus;
      enrollment.updatedAt = new Date().toISOString();
    } else {
      const now = new Date().toISOString();
      enrollments.push({
        id: generateId(),
        userId: payment.userId,
        courseId: payment.courseId,
        accessStatus: targetStatus,
        progress: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    this.writeArrayToStorage(STORAGE_KEYS.enrollments, enrollments, "enrollments");
    return payment;
  }

  async createCourse(input: AdminCourseUpsertInput): Promise<LmsCourse> {
    const courses = this.readCourses();
    const now = new Date().toISOString();
    const courseId = generateId();
    const resolvedSlug = this.resolveUniqueSlug(input.slug, courses);

    const course = this.normalizeCourse({
      id: courseId,
      title: input.title.trim(),
      slug: resolvedSlug,
      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      level: input.level,
      duration: input.duration.trim(),
      price: input.isFree ? 0 : Number(input.price),
      currency: input.currency ?? "KES",
      isFree: input.isFree,
      imageUrl: input.imageUrl.trim() || "/placeholder.svg",
      instructor: input.instructor.trim(),
      lessons: this.buildLessons(courseId, input.lessons),
      learningOutcomes: input.learningOutcomes,
      requirements: input.requirements,
      targetAudience: input.targetAudience,
      faqs: [],
      createdAt: now,
      updatedAt: now,
      lessonsCount: 0,
    });

    courses.push(course);
    this.writeCourses(courses);
    return course;
  }

  async updateCourse(input: AdminCourseUpsertInput): Promise<LmsCourse | null> {
    if (!input.id) return null;

    const courses = this.readCourses();
    const targetIndex = courses.findIndex((course) => course.id === input.id);
    if (targetIndex === -1) return null;

    const existing = courses[targetIndex];
    const resolvedSlug = this.resolveUniqueSlug(input.slug, courses, existing.id);

    const updated = this.normalizeCourse({
      ...existing,
      title: input.title.trim(),
      slug: resolvedSlug,
      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      level: input.level,
      duration: input.duration.trim(),
      price: input.isFree ? 0 : Number(input.price),
      currency: input.currency ?? existing.currency,
      isFree: input.isFree,
      imageUrl: input.imageUrl.trim() || "/placeholder.svg",
      instructor: input.instructor.trim(),
      lessons: this.buildLessons(existing.id, input.lessons),
      learningOutcomes: input.learningOutcomes,
      requirements: input.requirements,
      targetAudience: input.targetAudience,
      updatedAt: new Date().toISOString(),
    });

    courses[targetIndex] = updated;
    this.writeCourses(courses);
    return updated;
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    const courses = this.readCourses();
    const nextCourses = courses.filter((course) => course.id !== courseId);
    if (nextCourses.length === courses.length) {
      return false;
    }

    this.writeCourses(nextCourses);

    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    ).filter((row) => row.courseId !== courseId);
    this.writeArrayToStorage(STORAGE_KEYS.enrollments, enrollments, "enrollments");

    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    ).filter((row) => row.courseId !== courseId);
    this.writeArrayToStorage(STORAGE_KEYS.payments, payments, "payments");

    const progress = this.readArrayFromStorage<LmsLessonProgress>(
      STORAGE_KEYS.lessonProgress,
      this.memoryState.lessonProgress,
    ).filter((row) => row.courseId !== courseId);
    this.writeArrayToStorage(STORAGE_KEYS.lessonProgress, progress, "lessonProgress");

    return true;
  }

  async listUsers(): Promise<AdminUserOverview[]> {
    if (!isBrowser) {
      return [];
    }

    const users = safeReadLocalUsers();
    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );
    const payments = this.readArrayFromStorage<LmsPayment>(
      STORAGE_KEYS.payments,
      this.memoryState.payments,
    );

    return users
      .map((user) => {
        const userEnrollments = enrollments.filter((row) => row.userId === user.id);
        const userPayments = payments
          .filter((row) => row.userId === user.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          dateJoined: user.dateJoined,
          enrolledCourseIds: userEnrollments.map((row) => row.courseId),
          approvedEnrollments: userEnrollments.filter(
            (row) => row.accessStatus === "approved",
          ).length,
          pendingEnrollments: userEnrollments.filter(
            (row) => row.accessStatus === "pending_payment",
          ).length,
          rejectedEnrollments: userEnrollments.filter(
            (row) => row.accessStatus === "rejected",
          ).length,
          totalPayments: userPayments.length,
          latestPaymentStatus: userPayments[0]?.status,
        } satisfies AdminUserOverview;
      })
      .sort((a, b) => b.dateJoined.localeCompare(a.dateJoined));
  }

  async getLessonProgress(
    userId: string,
    courseSlug: string,
  ): Promise<LmsLessonProgress[]> {
    const course = this.findCourseBySlug(courseSlug);
    if (!course) return [];

    const lessonProgress = this.readArrayFromStorage<LmsLessonProgress>(
      STORAGE_KEYS.lessonProgress,
      this.memoryState.lessonProgress,
    );

    return lessonProgress.filter(
      (row) => row.userId === userId && row.courseId === course.id,
    );
  }

  async markLessonComplete(
    userId: string,
    courseSlug: string,
    lessonId: string,
    completed = true,
  ): Promise<void> {
    const course = this.findCourseBySlug(courseSlug);
    if (!course) {
      throw new Error("Course not found.");
    }

    const lesson = course.lessons.find((row) => row.id === lessonId);
    if (!lesson) {
      throw new Error("Lesson not found in this course.");
    }

    const enrollments = this.readArrayFromStorage<LmsEnrollment>(
      STORAGE_KEYS.enrollments,
      this.memoryState.enrollments,
    );
    const enrollment = enrollments.find(
      (row) => row.userId === userId && row.courseId === course.id,
    );

    const hasAccess = course.isFree
      ? enrollment?.accessStatus === "free" || enrollment?.accessStatus === "approved"
      : enrollment?.accessStatus === "approved";

    if (!hasAccess) {
      if (course.isFree) {
        throw new Error("Please enroll in this free course first.");
      }

      throw new Error("This course requires payment approval.");
    }

    const lessonProgress = this.readArrayFromStorage<LmsLessonProgress>(
      STORAGE_KEYS.lessonProgress,
      this.memoryState.lessonProgress,
    );

    const existing = lessonProgress.find(
      (row) =>
        row.userId === userId &&
        row.courseId === course.id &&
        row.lessonId === lessonId,
    );

    if (existing) {
      existing.completed = completed;
      existing.completedAt = completed ? new Date().toISOString() : undefined;
    } else {
      lessonProgress.push({
        id: generateId(),
        userId,
        courseId: course.id,
        lessonId: lesson.id,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      });
    }

    this.writeArrayToStorage(
      STORAGE_KEYS.lessonProgress,
      lessonProgress,
      "lessonProgress",
    );

    if (enrollment) {
      enrollment.progress = await this.getCourseProgress(userId, courseSlug);
      enrollment.updatedAt = new Date().toISOString();
      this.writeArrayToStorage(STORAGE_KEYS.enrollments, enrollments, "enrollments");
    }
  }

  async getCourseProgress(userId: string, courseSlug: string): Promise<number> {
    const course = this.findCourseBySlug(courseSlug);
    if (!course) return 0;

    if (course.lessons.length === 0) return 0;

    const lessonProgress = this.readArrayFromStorage<LmsLessonProgress>(
      STORAGE_KEYS.lessonProgress,
      this.memoryState.lessonProgress,
    );

    const completedLessonIds = new Set(
      lessonProgress
        .filter(
          (row) =>
            row.userId === userId &&
            row.courseId === course.id &&
            row.completed,
        )
        .map((row) => row.lessonId),
    );

    const ratio = completedLessonIds.size / course.lessons.length;
    return Math.round(ratio * 100);
  }

  private buildLessons(courseId: string, inputLessons: AdminCourseUpsertInput["lessons"]): LmsLesson[] {
    return inputLessons.map((lesson, index) => ({
      id: `${courseId}-lesson-${index + 1}`,
      courseId,
      title: lesson.title.trim(),
      lessonOrder: index + 1,
      lessonType: lesson.lessonType,
      content: lesson.content.trim(),
      videoUrl: lesson.videoUrl?.trim() || undefined,
      resourceDownloads: [],
    }));
  }

  private resolveUniqueSlug(
    slugCandidate: string,
    courses: LmsCourse[],
    excludeCourseId?: string,
  ): string {
    const base = slugify(slugCandidate || "course");
    let resolved = base || "course";
    let counter = 2;

    while (
      courses.some(
        (course) => course.slug === resolved && course.id !== excludeCourseId,
      )
    ) {
      resolved = `${base}-${counter}`;
      counter += 1;
    }

    return resolved;
  }

  private normalizeCourse(course: LmsCourse): LmsCourse {
    return {
      ...course,
      lessons: [...course.lessons].sort((a, b) => a.lessonOrder - b.lessonOrder),
      lessonsCount: course.lessons.length,
      updatedAt: course.updatedAt || new Date().toISOString(),
    };
  }

  private readCourses(): LmsCourse[] {
    const stored = this.readArrayFromStorage<LmsCourse>(
      STORAGE_KEYS.courses,
      this.memoryState.courses,
    );

    return stored.map((course) => this.normalizeCourse(course));
  }

  private writeCourses(courses: LmsCourse[]): void {
    this.writeArrayToStorage(STORAGE_KEYS.courses, courses, "courses");
  }

  private readArrayFromStorage<T>(key: string, fallback: T[]): T[] {
    if (!isBrowser) {
      return clone(fallback);
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return clone(fallback);
    }

    try {
      const parsed = JSON.parse(raw) as T[];
      return Array.isArray(parsed) ? parsed : clone(fallback);
    } catch {
      return clone(fallback);
    }
  }

  private writeArrayToStorage<T>(
    key: string,
    value: T[],
    memoryKey: "courses" | "enrollments" | "payments" | "lessonProgress",
  ): void {
    if (!isBrowser) {
      if (memoryKey === "courses") {
        this.memoryState.courses = clone(value as unknown as LmsCourse[]);
      } else if (memoryKey === "enrollments") {
        this.memoryState.enrollments = clone(
          value as unknown as LmsEnrollment[],
        );
      } else if (memoryKey === "payments") {
        this.memoryState.payments = clone(value as unknown as LmsPayment[]);
      } else {
        this.memoryState.lessonProgress = clone(
          value as unknown as LmsLessonProgress[],
        );
      }
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }

  private findCourseBySlug(slug: string): LmsCourse | undefined {
    return this.readCourses().find((course) => course.slug === slug);
  }
}

const safeReadLocalUsers = (): LocalAuthUserRecord[] => {
  if (!isBrowser) return [];

  const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LocalAuthUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
