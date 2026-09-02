import type { LmsCourse, LmsEnrollment, LmsPayment } from "@/types/lms";

export const formatMoney = (amount: number, currency = "KES"): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface MonthlyRevenuePoint {
  monthKey: string;
  monthLabel: string;
  approved: number;
  pending: number;
  rejected: number;
  approvedCount: number;
  totalCount: number;
}

const monthKeyOf = (isoDate: string): string => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabelOf = (isoDate: string): string => {
  return new Intl.DateTimeFormat("en-KE", { month: "short", year: "numeric" }).format(
    new Date(isoDate),
  );
};

export const buildMonthlyRevenueSeries = (payments: LmsPayment[]): MonthlyRevenuePoint[] => {
  const byMonth: Record<string, MonthlyRevenuePoint> = {};

  payments.forEach((payment) => {
    const monthKey = monthKeyOf(payment.createdAt);
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = {
        monthKey,
        monthLabel: monthLabelOf(payment.createdAt),
        approved: 0,
        pending: 0,
        rejected: 0,
        approvedCount: 0,
        totalCount: 0,
      };
    }

    const point = byMonth[monthKey];
    point.totalCount += 1;

    if (payment.status === "approved") {
      point.approved += payment.amount;
      point.approvedCount += 1;
    } else if (payment.status === "pending") {
      point.pending += payment.amount;
    } else {
      point.rejected += payment.amount;
    }
  });

  return Object.values(byMonth).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
};

export interface CoursePerformancePoint {
  courseId: string;
  title: string;
  category: string;
  level: string;
  price: number;
  isFree: boolean;
  activeEnrollments: number;
  pendingEnrollments: number;
  approvedRevenue: number;
}

export const buildCoursePerformanceSeries = (
  courses: LmsCourse[],
  enrollments: LmsEnrollment[],
  payments: LmsPayment[],
): CoursePerformancePoint[] => {
  return courses
    .map((course) => {
      const courseEnrollments = enrollments.filter((row) => row.courseId === course.id);
      const activeEnrollments = courseEnrollments.filter(
        (row) => row.accessStatus === "approved" || row.accessStatus === "free",
      ).length;
      const pendingEnrollments = courseEnrollments.filter(
        (row) => row.accessStatus === "pending_payment",
      ).length;
      const approvedRevenue = payments
        .filter((row) => row.courseId === course.id && row.status === "approved")
        .reduce((sum, row) => sum + row.amount, 0);

      return {
        courseId: course.id,
        title: course.title,
        category: course.category,
        level: course.level,
        price: course.price,
        isFree: course.isFree,
        activeEnrollments,
        pendingEnrollments,
        approvedRevenue,
      };
    })
    .sort((a, b) => b.activeEnrollments - a.activeEnrollments);
};
