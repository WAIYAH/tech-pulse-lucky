import type { BadgeProps } from "@/components/ui/badge";
import type { EnrollmentAccessStatus, PaymentStatus } from "@/types/lms";
import type { StudentNotificationType } from "@/lib/student/studentPortalState";
import type {
  MasterclassAttendanceStatus,
  MasterclassCertificateStatus,
  MasterclassCohortStatus,
  MasterclassFinalProjectStatus,
  MasterclassLessonType,
} from "@/types/masterclass";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export const enrollmentStatusBadgeVariant: Record<EnrollmentAccessStatus, BadgeVariant> = {
  free: "success",
  approved: "success",
  pending_payment: "warning",
  rejected: "destructive",
};

export const paymentStatusBadgeVariant: Record<PaymentStatus, BadgeVariant> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
};

export const ticketStatusBadgeVariant: Record<"open" | "in_progress" | "resolved", BadgeVariant> = {
  open: "warning",
  in_progress: "default",
  resolved: "success",
};

export const notificationTypeBadgeVariant: Record<StudentNotificationType, BadgeVariant> = {
  payment: "success",
  support: "warning",
  learning: "default",
  webinar: "accent",
  system: "secondary",
};

export const cohortStatusBadgeVariant: Record<MasterclassCohortStatus, BadgeVariant> = {
  upcoming: "accent",
  active: "success",
  completed: "default",
  archived: "secondary",
};

export const finalProjectStatusBadgeVariant: Record<MasterclassFinalProjectStatus, BadgeVariant> = {
  not_started: "secondary",
  in_progress: "default",
  submitted: "warning",
  approved: "success",
};

export const certificateStatusBadgeVariant: Record<MasterclassCertificateStatus, BadgeVariant> = {
  not_eligible: "secondary",
  eligible: "warning",
  issued: "success",
  revoked: "destructive",
};

export const attendanceStatusBadgeVariant: Record<MasterclassAttendanceStatus, BadgeVariant> = {
  present: "success",
  absent: "destructive",
};

export const lessonTypeBadgeVariant: Record<MasterclassLessonType, BadgeVariant> = {
  intro: "accent",
  concept: "default",
  practical: "success",
};
