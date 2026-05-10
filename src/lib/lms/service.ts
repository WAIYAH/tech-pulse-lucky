import type {
  AdminCourseUpsertInput,
  AdminPaymentUpdateInput,
  AdminUserOverview,
  LmsConfig,
  LmsCourse,
  LmsCourseFilters,
  LmsEnrollment,
  LmsLessonProgress,
  LmsPayment,
  PaymentSubmissionInput,
} from "@/types/lms";

export type LmsProviderMode = "mock" | "supabase";

export interface LmsDataProvider {
  getConfig(): LmsConfig;
  listCourses(filters?: LmsCourseFilters): Promise<LmsCourse[]>;
  getCourseBySlug(slug: string): Promise<LmsCourse | null>;
  getFeaturedCourses(limit?: number): Promise<LmsCourse[]>;
  getCourseCategories(): Promise<string[]>;

  getEnrollments(userId: string): Promise<LmsEnrollment[]>;
  enrollInFreeCourse(userId: string, courseSlug: string): Promise<LmsEnrollment>;

  submitPaymentRequest(input: PaymentSubmissionInput): Promise<LmsPayment>;
  getPaymentsForUser(userId: string): Promise<LmsPayment[]>;
  getAllPayments(): Promise<LmsPayment[]>;
  updatePaymentStatus(input: AdminPaymentUpdateInput): Promise<LmsPayment | null>;
  createCourse(input: AdminCourseUpsertInput): Promise<LmsCourse>;
  updateCourse(input: AdminCourseUpsertInput): Promise<LmsCourse | null>;
  deleteCourse(courseId: string): Promise<boolean>;
  listUsers(): Promise<AdminUserOverview[]>;

  getLessonProgress(userId: string, courseSlug: string): Promise<LmsLessonProgress[]>;
  markLessonComplete(
    userId: string,
    courseSlug: string,
    lessonId: string,
    completed?: boolean,
  ): Promise<void>;
  getCourseProgress(userId: string, courseSlug: string): Promise<number>;
}
