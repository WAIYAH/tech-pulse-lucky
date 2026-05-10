export type LmsRole = "guest" | "student" | "admin";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CoursePricingModel = "free" | "paid";
export type CourseSortBy = "title" | "price_low_to_high" | "price_high_to_low";

export type LessonType = "video" | "text" | "assignment" | "quiz";

export type EnrollmentAccessStatus =
  | "free"
  | "pending_payment"
  | "approved"
  | "rejected";

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface LmsCourseFaq {
  question: string;
  answer: string;
}

export interface LmsLessonResource {
  id: string;
  title: string;
  url: string;
  type: "pdf" | "zip" | "doc" | "link";
}

export interface LmsQuizDefinition {
  title: string;
  instructions: string;
  totalQuestions: number;
}

export interface LmsAssignmentDefinition {
  title: string;
  instructions: string;
  dueInDays?: number;
}

export interface LmsLesson {
  id: string;
  courseId: string;
  title: string;
  lessonOrder: number;
  lessonType: LessonType;
  content: string;
  videoUrl?: string;
  resourceDownloads: LmsLessonResource[];
  quiz?: LmsQuizDefinition;
  assignment?: LmsAssignmentDefinition;
}

export interface LmsCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  price: number;
  currency: string;
  isFree: boolean;
  imageUrl: string;
  instructor: string;
  lessons: LmsLesson[];
  lessonsCount: number;
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  faqs: LmsCourseFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface LmsProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: LmsRole;
  dateJoined: string;
}

export interface LmsEnrollment {
  id: string;
  userId: string;
  courseId: string;
  accessStatus: EnrollmentAccessStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface LmsPayment {
  id: string;
  userId: string;
  courseId: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  transactionCode: string;
  paymentDate: string;
  status: PaymentStatus;
  adminNote?: string;
  screenshotUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LmsLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt?: string;
}

export interface LmsAssignment {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  instructions: string;
  dueDate?: string;
  createdAt: string;
}

export interface LmsCourseFilters {
  query?: string;
  category?: string;
  pricing?: CoursePricingModel;
  level?: CourseLevel;
  sortBy?: CourseSortBy;
}

export interface PaymentSubmissionInput {
  userId: string;
  courseSlug: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  transactionCode: string;
  paymentDate: string;
  screenshotUrl?: string;
}

export interface AdminPaymentUpdateInput {
  paymentId: string;
  status: PaymentStatus;
  adminNote?: string;
}

export interface AdminCourseLessonInput {
  title: string;
  lessonType: LessonType;
  content: string;
  videoUrl?: string;
}

export interface AdminCourseUpsertInput {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  price: number;
  currency?: string;
  isFree: boolean;
  imageUrl: string;
  instructor: string;
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  lessons: AdminCourseLessonInput[];
}

export interface AdminUserOverview {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: LmsRole;
  dateJoined: string;
  enrolledCourseIds: string[];
  approvedEnrollments: number;
  pendingEnrollments: number;
  rejectedEnrollments: number;
  totalPayments: number;
  latestPaymentStatus?: PaymentStatus;
}

export interface LmsPaymentConfig {
  methodName: string;
  paybillNumber: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  instructionSteps: string[];
}

export interface LmsFeatureFlags {
  useSupabaseProvider: boolean;
  enableCertificates: boolean;
  enableEmailNotifications: boolean;
  enableLiveClasses: boolean;
}

export interface LmsConfig {
  platformName: string;
  brandName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappCommunityLink: string;
  payment: LmsPaymentConfig;
  featureFlags: LmsFeatureFlags;
}
