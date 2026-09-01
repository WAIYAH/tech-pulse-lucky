import type { BadgeProps } from "@/components/ui/badge";
import type { EnrollmentAccessStatus, PaymentStatus } from "@/types/lms";
import type { StudentNotificationType } from "@/lib/student/studentPortalState";

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
