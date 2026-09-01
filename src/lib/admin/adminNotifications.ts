import type { BadgeProps } from "@/components/ui/badge";
import { lmsProvider } from "@/lib/lms";
import { readAllSupportTickets } from "@/lib/student/studentPortalState";
import { paymentStatusBadgeVariant, ticketStatusBadgeVariant } from "@/lib/statusBadges";
import { routes } from "@/routes/routeConfig";

export type AdminActivityType = "payment" | "support";

export interface AdminActivityItem {
  id: string;
  type: AdminActivityType;
  title: string;
  message: string;
  createdAt: string;
  needsAction: boolean;
  badgeVariant: NonNullable<BadgeProps["variant"]>;
  badgeLabel: string;
  actionPath: string;
}

const formatMoney = (amount: number, currency = "KES"): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const readAdminActivityFeed = async (): Promise<AdminActivityItem[]> => {
  const [payments, courses, tickets] = await Promise.all([
    lmsProvider.getAllPayments(),
    lmsProvider.listCourses(),
    readAllSupportTickets(),
  ]);

  const paymentItems: AdminActivityItem[] = payments.map((payment) => {
    const course = courses.find((row) => row.id === payment.courseId);
    return {
      id: `payment-${payment.id}`,
      type: "payment",
      title: payment.status === "pending" ? "Payment awaiting review" : `Payment ${payment.status}`,
      message: `${payment.fullName} paid ${formatMoney(payment.amount, payment.currency)} for "${course?.title ?? "a course"}".`,
      createdAt: payment.createdAt,
      needsAction: payment.status === "pending",
      badgeVariant: paymentStatusBadgeVariant[payment.status],
      badgeLabel: payment.status,
      actionPath: routes.admin.payments,
    };
  });

  const ticketItems: AdminActivityItem[] = tickets.map((ticket) => ({
    id: `ticket-${ticket.id}`,
    type: "support",
    title: ticket.subject,
    message: `${ticket.userName}: ${ticket.message}`,
    createdAt: ticket.createdAt,
    needsAction: ticket.status !== "resolved",
    badgeVariant: ticketStatusBadgeVariant[ticket.status],
    badgeLabel: ticket.status.replace("_", " "),
    actionPath: routes.admin.support,
  }));

  return [...paymentItems, ...ticketItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
