import { lmsConfig } from "@/data/lmsConfig";
import { supabase as _supabase } from "@/integrations/supabase/client";
import type {
  AdminCourseUpsertInput,
  AdminPaymentUpdateInput,
  AdminUserOverview,
  LmsConfig,
  LmsCourse,
  LmsCourseFaq,
  LmsCourseFilters,
  LmsEnrollment,
  LmsLesson,
  LmsLessonProgress,
  LmsPayment,
  PaymentSubmissionInput,
} from "@/types/lms";
import { MockLmsProvider } from "./mockProvider";
import type { LmsDataProvider } from "./service";

// LMS tables are managed externally; use loose typing until generated types are available.
const supabase = _supabase as any;
type CourseRow = any;
type LessonRow = any;
type EnrollmentRow = any;
type PaymentRow = any;
type LessonProgressRow = any;
type ProfileRow = any;

const COURSE_STORAGE_KEY = "lms_courses";

const isBrowser = typeof window !== "undefined";

const parseFaqs = (value: unknown): LmsCourseFaq[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        "question" in item &&
        "answer" in item
      ) {
        const question = String((item as { question: unknown }).question ?? "");
        const answer = String((item as { answer: unknown }).answer ?? "");
        return question && answer ? { question, answer } : null;
      }
      return null;
    })
    .filter((item): item is LmsCourseFaq => Boolean(item));
};

const parseLessonRows = (rows: LessonRow[]): LmsLesson[] => {
  return rows
    .sort((a, b) => a.lesson_order - b.lesson_order)
    .map((row) => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      lessonOrder: row.lesson_order,
      lessonType: row.lesson_type,
      content: row.content,
      videoUrl: row.video_url ?? undefined,
      resourceDownloads: Array.isArray(row.resource_downloads)
        ? (row.resource_downloads as LmsLesson["resourceDownloads"])
        : [],
      quiz:
        row.quiz && typeof row.quiz === "object"
          ? (row.quiz as LmsLesson["quiz"])
          : undefined,
      assignment:
        row.assignment && typeof row.assignment === "object"
          ? (row.assignment as LmsLesson["assignment"])
          : undefined,
    }));
};

const mapCourseRow = (row: CourseRow, lessons: LmsLesson[] = []): LmsCourse => {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    level: row.level,
    duration: row.duration,
    price: Number(row.price ?? 0),
    currency: row.currency,
    isFree: row.is_free,
    imageUrl: row.image_url,
    instructor: row.instructor,
    lessons,
    lessonsCount: lessons.length,
    learningOutcomes: row.learning_outcomes ?? [],
    requirements: row.requirements ?? [],
    targetAudience: row.target_audience ?? [],
    faqs: parseFaqs(row.faqs),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapEnrollmentRow = (row: EnrollmentRow): LmsEnrollment => ({
  id: row.id,
  userId: row.user_id,
  courseId: row.course_id,
  accessStatus: row.access_status,
  progress: row.progress,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapPaymentRow = (row: PaymentRow): LmsPayment => ({
  id: row.id,
  userId: row.user_id,
  courseId: row.course_id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  amount: Number(row.amount ?? 0),
  currency: row.currency,
  transactionCode: row.transaction_code,
  paymentDate: row.payment_date,
  status: row.status,
  adminNote: row.admin_note ?? undefined,
  screenshotUrl: row.screenshot_url ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapLessonProgressRow = (row: LessonProgressRow): LmsLessonProgress => ({
  id: row.id,
  userId: row.user_id,
  lessonId: row.lesson_id,
  courseId: row.course_id,
  completed: row.completed,
  completedAt: row.completed_at ?? undefined,
});

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export class SupabaseLmsProvider implements LmsDataProvider {
  private readonly fallback = new MockLmsProvider();
  private readonly hasSupabaseEnv = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );

  private warnedOperations = new Set<string>();

  private warn(operation: string, reason?: string): void {
    if (this.warnedOperations.has(operation)) return;

    const missingEnvHint = this.hasSupabaseEnv
      ? "Supabase operation failed, fallback to mock provider."
      : "Supabase env vars are missing, fallback to mock provider.";

    console.info(
      `[LMS Supabase Adapter] ${operation}: ${reason ?? missingEnvHint}`,
    );
    this.warnedOperations.add(operation);
  }

  private async withFallback<T>(
    operation: string,
    supabaseRun: () => Promise<T>,
    fallbackRun: () => Promise<T>,
  ): Promise<T> {
    if (!this.hasSupabaseEnv) {
      this.warn(operation);
      return fallbackRun();
    }

    try {
      return await supabaseRun();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.warn(operation, message);
      return fallbackRun();
    }
  }

  private saveCourseSnapshot(courses: LmsCourse[]): void {
    if (!isBrowser) return;
    window.localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  }

  private async fetchLessonsForCourses(courseIds: string[]): Promise<LessonRow[]> {
    if (courseIds.length === 0) return [];

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .in("course_id", courseIds)
      .order("lesson_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  private attachLessons(courses: CourseRow[], lessons: LessonRow[]): LmsCourse[] {
    const lessonsByCourseId = lessons.reduce<Record<string, LessonRow[]>>(
      (acc, lesson) => {
        if (!acc[lesson.course_id]) {
          acc[lesson.course_id] = [];
        }
        acc[lesson.course_id].push(lesson);
        return acc;
      },
      {},
    );

    return courses.map((course) =>
      mapCourseRow(course, parseLessonRows(lessonsByCourseId[course.id] ?? [])),
    );
  }

  getConfig(): LmsConfig {
    return lmsConfig;
  }

  async listCourses(filters?: LmsCourseFilters): Promise<LmsCourse[]> {
    return this.withFallback(
      "listCourses",
      async () => {
        let query = supabase.from("courses").select("*");

        if (filters?.query?.trim()) {
          const q = filters.query.trim();
          query = query.or(
            `title.ilike.%${q}%,short_description.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`,
          );
        }
        if (filters?.category) {
          query = query.eq("category", filters.category);
        }
        if (filters?.pricing) {
          query =
            filters.pricing === "free"
              ? query.eq("is_free", true)
              : query.eq("is_free", false);
        }
        if (filters?.level) {
          query = query.eq("level", filters.level);
        }

        if (filters?.sortBy === "price_low_to_high") {
          query = query.order("price", { ascending: true });
        } else if (filters?.sortBy === "price_high_to_low") {
          query = query.order("price", { ascending: false });
        } else {
          query = query.order("title", { ascending: true });
        }

        const { data: courses, error } = await query;
        if (error) throw error;
        const courseRows = courses ?? [];
        const lessons = await this.fetchLessonsForCourses(
          courseRows.map((course) => course.id),
        );
        const mapped = this.attachLessons(courseRows, lessons);
        this.saveCourseSnapshot(mapped);
        return mapped;
      },
      () => this.fallback.listCourses(filters),
    );
  }

  async getCourseBySlug(slug: string): Promise<LmsCourse | null> {
    return this.withFallback(
      "getCourseBySlug",
      async () => {
        const { data: course, error } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        if (!course) return null;

        const lessons = await this.fetchLessonsForCourses([course.id]);
        const mapped = mapCourseRow(course, parseLessonRows(lessons));
        return mapped;
      },
      () => this.fallback.getCourseBySlug(slug),
    );
  }

  async getFeaturedCourses(limit = 4): Promise<LmsCourse[]> {
    return this.withFallback(
      "getFeaturedCourses",
      async () => {
        const all = await this.listCourses({ sortBy: "title" });
        const featured = all.filter((course) =>
          ["basics-of-computers-phones-internet-101", "safe-internet-browsing-online-security", "web-development-html-css-javascript", "git-github-developer-portfolio-masterclass"].includes(course.slug),
        );
        return featured.slice(0, limit);
      },
      () => this.fallback.getFeaturedCourses(limit),
    );
  }

  async getCourseCategories(): Promise<string[]> {
    return this.withFallback<string[]>(
      "getCourseCategories",
      async () => {
        const { data, error } = await supabase.from("courses").select("category");
        if (error) throw error;
        const cats: string[] = ((data ?? []) as any[]).map((row) => String(row.category));
        return Array.from(new Set<string>(cats)).sort();
      },
      () => this.fallback.getCourseCategories(),
    );
  }

  async getEnrollments(userId: string): Promise<LmsEnrollment[]> {
    return this.withFallback(
      "getEnrollments",
      async () => {
        const { data, error } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map(mapEnrollmentRow);
      },
      () => this.fallback.getEnrollments(userId),
    );
  }

  async enrollInFreeCourse(userId: string, courseSlug: string): Promise<LmsEnrollment> {
    return this.withFallback(
      "enrollInFreeCourse",
      async () => {
        const course = await this.getCourseBySlug(courseSlug);
        if (!course) throw new Error("Course not found.");
        if (!course.isFree) throw new Error("This course requires payment approval.");

        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from("enrollments")
          .upsert(
            {
              user_id: userId,
              course_id: course.id,
              access_status: "free",
              progress: 0,
              updated_at: now,
            },
            { onConflict: "user_id,course_id" },
          )
          .select("*")
          .single();

        if (error) throw error;
        return mapEnrollmentRow(data);
      },
      () => this.fallback.enrollInFreeCourse(userId, courseSlug),
    );
  }

  async submitPaymentRequest(input: PaymentSubmissionInput): Promise<LmsPayment> {
    return this.withFallback(
      "submitPaymentRequest",
      async () => {
        const course = await this.getCourseBySlug(input.courseSlug);
        if (!course) throw new Error("Course not found.");
        if (course.isFree) throw new Error("Free courses do not require payment.");
        if (input.amount < course.price) {
          throw new Error(
            `Paid amount must be at least ${course.currency} ${course.price}.`,
          );
        }

        const { data: latestRows, error: latestError } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", input.userId)
          .eq("course_id", course.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (latestError) throw latestError;

        const latest = latestRows?.[0];
        if (latest?.status === "pending") {
          throw new Error(
            "You already have a pending payment request for this course. Please wait for admin review.",
          );
        }
        if (latest?.status === "approved") {
          throw new Error("This course payment is already approved for your account.");
        }

        const { data: paymentRow, error: paymentError } = await supabase
          .from("payments")
          .insert({
            user_id: input.userId,
            course_id: course.id,
            full_name: input.fullName,
            email: input.email,
            phone: input.phone,
            amount: input.amount,
            currency: course.currency,
            transaction_code: input.transactionCode,
            payment_date: input.paymentDate,
            status: "pending",
            screenshot_url: input.screenshotUrl ?? null,
          })
          .select("*")
          .single();
        if (paymentError) throw paymentError;

        const now = new Date().toISOString();
        const { error: enrollmentError } = await supabase
          .from("enrollments")
          .upsert(
            {
              user_id: input.userId,
              course_id: course.id,
              access_status: "pending_payment",
              progress: 0,
              updated_at: now,
            },
            { onConflict: "user_id,course_id" },
          );
        if (enrollmentError) throw enrollmentError;

        return mapPaymentRow(paymentRow);
      },
      () => this.fallback.submitPaymentRequest(input),
    );
  }

  async getPaymentsForUser(userId: string): Promise<LmsPayment[]> {
    return this.withFallback(
      "getPaymentsForUser",
      async () => {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map(mapPaymentRow);
      },
      () => this.fallback.getPaymentsForUser(userId),
    );
  }

  async getAllPayments(): Promise<LmsPayment[]> {
    return this.withFallback(
      "getAllPayments",
      async () => {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map(mapPaymentRow);
      },
      () => this.fallback.getAllPayments(),
    );
  }

  async updatePaymentStatus(
    input: AdminPaymentUpdateInput,
  ): Promise<LmsPayment | null> {
    return this.withFallback(
      "updatePaymentStatus",
      async () => {
        const { data: payment, error } = await supabase
          .from("payments")
          .update({
            status: input.status,
            admin_note: input.adminNote ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", input.paymentId)
          .select("*")
          .maybeSingle();
        if (error) throw error;
        if (!payment) return null;

        const accessStatus =
          input.status === "approved"
            ? "approved"
            : input.status === "rejected"
              ? "rejected"
              : "pending_payment";

        const { error: enrollmentError } = await supabase
          .from("enrollments")
          .upsert(
            {
              user_id: payment.user_id,
              course_id: payment.course_id,
              access_status: accessStatus,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,course_id" },
          );
        if (enrollmentError) throw enrollmentError;

        return mapPaymentRow(payment);
      },
      () => this.fallback.updatePaymentStatus(input),
    );
  }

  async createCourse(input: AdminCourseUpsertInput): Promise<LmsCourse> {
    return this.withFallback(
      "createCourse",
      async () => {
        const slug = toSlug(input.slug || input.title);
        const { data: courseRow, error: courseError } = await supabase
          .from("courses")
          .insert({
            title: input.title,
            slug,
            short_description: input.shortDescription,
            description: input.description,
            category: input.category,
            level: input.level,
            duration: input.duration,
            price: input.isFree ? 0 : input.price,
            currency: input.currency ?? "KES",
            is_free: input.isFree,
            image_url: input.imageUrl || "/placeholder.svg",
            instructor: input.instructor,
            learning_outcomes: input.learningOutcomes,
            requirements: input.requirements,
            target_audience: input.targetAudience,
            faqs: [],
          })
          .select("*")
          .single();
        if (courseError) throw courseError;

        if (input.lessons.length > 0) {
          const { error: lessonError } = await supabase.from("lessons").insert(
            input.lessons.map((lesson, index) => ({
              course_id: courseRow.id,
              title: lesson.title,
              lesson_order: index + 1,
              lesson_type: lesson.lessonType,
              content: lesson.content,
              video_url: lesson.videoUrl ?? null,
              resource_downloads: [],
              quiz: null,
              assignment: null,
            })),
          );
          if (lessonError) throw lessonError;
        }

        const created = await this.getCourseBySlug(courseRow.slug);
        if (!created) throw new Error("Course created but could not be loaded.");

        const all = await this.listCourses({ sortBy: "title" });
        this.saveCourseSnapshot(all);
        return created;
      },
      () => this.fallback.createCourse(input),
    );
  }

  async updateCourse(input: AdminCourseUpsertInput): Promise<LmsCourse | null> {
    return this.withFallback(
      "updateCourse",
      async () => {
        if (!input.id) return null;
        const slug = toSlug(input.slug || input.title);

        const { data: updatedCourse, error: courseError } = await supabase
          .from("courses")
          .update({
            title: input.title,
            slug,
            short_description: input.shortDescription,
            description: input.description,
            category: input.category,
            level: input.level,
            duration: input.duration,
            price: input.isFree ? 0 : input.price,
            currency: input.currency ?? "KES",
            is_free: input.isFree,
            image_url: input.imageUrl || "/placeholder.svg",
            instructor: input.instructor,
            learning_outcomes: input.learningOutcomes,
            requirements: input.requirements,
            target_audience: input.targetAudience,
            updated_at: new Date().toISOString(),
          })
          .eq("id", input.id)
          .select("*")
          .maybeSingle();
        if (courseError) throw courseError;
        if (!updatedCourse) return null;

        const { error: deleteLessonsError } = await supabase
          .from("lessons")
          .delete()
          .eq("course_id", input.id);
        if (deleteLessonsError) throw deleteLessonsError;

        if (input.lessons.length > 0) {
          const { error: lessonInsertError } = await supabase.from("lessons").insert(
            input.lessons.map((lesson, index) => ({
              course_id: input.id!,
              title: lesson.title,
              lesson_order: index + 1,
              lesson_type: lesson.lessonType,
              content: lesson.content,
              video_url: lesson.videoUrl ?? null,
              resource_downloads: [],
              quiz: null,
              assignment: null,
            })),
          );
          if (lessonInsertError) throw lessonInsertError;
        }

        const refreshed = await this.getCourseBySlug(updatedCourse.slug);
        const all = await this.listCourses({ sortBy: "title" });
        this.saveCourseSnapshot(all);
        return refreshed;
      },
      () => this.fallback.updateCourse(input),
    );
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    return this.withFallback(
      "deleteCourse",
      async () => {
        const { error } = await supabase.from("courses").delete().eq("id", courseId);
        if (error) throw error;

        const all = await this.listCourses({ sortBy: "title" });
        this.saveCourseSnapshot(all);
        return true;
      },
      () => this.fallback.deleteCourse(courseId),
    );
  }

  async listUsers(): Promise<AdminUserOverview[]> {
    return this.withFallback(
      "listUsers",
      async () => {
        const [{ data: profiles, error: profileError }, { data: enrollments, error: enrollmentError }, { data: payments, error: paymentError }] =
          await Promise.all([
            supabase.from("profiles").select("*"),
            supabase.from("enrollments").select("*"),
            supabase.from("payments").select("*"),
          ]);

        if (profileError) throw profileError;
        if (enrollmentError) throw enrollmentError;
        if (paymentError) throw paymentError;

        const enrollmentRows = (enrollments ?? []) as EnrollmentRow[];
        const paymentRows = (payments ?? []) as PaymentRow[];

        return (profiles ?? [])
          .map((profile: ProfileRow) => {
            const userEnrollments = enrollmentRows.filter(
              (row) => row.user_id === profile.id,
            );
            const userPayments = paymentRows
              .filter((row) => row.user_id === profile.id)
              .sort((a, b) => b.created_at.localeCompare(a.created_at));

            return {
              id: profile.id,
              fullName: profile.full_name,
              email: profile.email,
              phone: profile.phone,
              role: profile.role,
              dateJoined: profile.created_at,
              enrolledCourseIds: userEnrollments.map((row) => row.course_id),
              approvedEnrollments: userEnrollments.filter(
                (row) => row.access_status === "approved",
              ).length,
              pendingEnrollments: userEnrollments.filter(
                (row) => row.access_status === "pending_payment",
              ).length,
              rejectedEnrollments: userEnrollments.filter(
                (row) => row.access_status === "rejected",
              ).length,
              totalPayments: userPayments.length,
              latestPaymentStatus: userPayments[0]?.status,
            } satisfies AdminUserOverview;
          })
          .sort((a, b) => b.dateJoined.localeCompare(a.dateJoined));
      },
      () => this.fallback.listUsers(),
    );
  }

  async getLessonProgress(
    userId: string,
    courseSlug: string,
  ): Promise<LmsLessonProgress[]> {
    return this.withFallback(
      "getLessonProgress",
      async () => {
        const course = await this.getCourseBySlug(courseSlug);
        if (!course) return [];

        const { data, error } = await supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("course_id", course.id);
        if (error) throw error;
        return (data ?? []).map(mapLessonProgressRow);
      },
      () => this.fallback.getLessonProgress(userId, courseSlug),
    );
  }

  async markLessonComplete(
    userId: string,
    courseSlug: string,
    lessonId: string,
    completed = true,
  ): Promise<void> {
    return this.withFallback(
      "markLessonComplete",
      async () => {
        const course = await this.getCourseBySlug(courseSlug);
        if (!course) throw new Error("Course not found.");
        const lesson = course.lessons.find((row) => row.id === lessonId);
        if (!lesson) throw new Error("Lesson not found in this course.");

        const completedAt = completed ? new Date().toISOString() : null;
        const { error: progressError } = await supabase
          .from("lesson_progress")
          .upsert(
            {
              user_id: userId,
              lesson_id: lessonId,
              course_id: course.id,
              completed,
              completed_at: completedAt,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,lesson_id" },
          );
        if (progressError) throw progressError;

        const progress = await this.getCourseProgress(userId, courseSlug);
        const { error: enrollmentError } = await supabase
          .from("enrollments")
          .update({ progress, updated_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("course_id", course.id);
        if (enrollmentError) throw enrollmentError;
      },
      () => this.fallback.markLessonComplete(userId, courseSlug, lessonId, completed),
    );
  }

  async getCourseProgress(userId: string, courseSlug: string): Promise<number> {
    return this.withFallback(
      "getCourseProgress",
      async () => {
        const course = await this.getCourseBySlug(courseSlug);
        if (!course) return 0;
        if (course.lessons.length === 0) return 0;

        const totalLessons = course.lessons.length;
        const { count, error } = await supabase
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("course_id", course.id)
          .eq("completed", true);
        if (error) throw error;

        const completedCount = count ?? 0;
        return Math.round((completedCount / totalLessons) * 100);
      },
      () => this.fallback.getCourseProgress(userId, courseSlug),
    );
  }
}
