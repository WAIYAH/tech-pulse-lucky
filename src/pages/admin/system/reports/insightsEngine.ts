import type { AdminUserOverview, LmsCourse, LmsEnrollment, LmsPayment } from "@/types/lms";
import { buildCoursePerformanceSeries, buildMonthlyRevenueSeries, formatMoney } from "./reportsData";

export const REVENUE_TREND_SIGNIFICANCE_PCT = 10;
export const AT_RISK_STALE_DAYS = 14;
export const AT_RISK_PROGRESS_THRESHOLD = 25;
export const LOW_APPROVAL_RATE_PCT = 50;
export const MIN_SAMPLE_FOR_RATE_INSIGHT = 5;
export const NEW_COURSE_GRACE_DAYS = 30;
export const NEW_STUDENT_WINDOW_DAYS = 30;

export type InsightSeverity = "positive" | "warning" | "critical" | "info";

export interface AtRiskDetail {
  userId: string;
  fullName: string;
  email: string;
  courseTitle: string;
  progress: number;
  daysSinceActivity: number;
}

export interface Insight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description?: string;
  detail?: AtRiskDetail[];
  actionLabel?: string;
  actionPath?: string;
}

interface InsightsInput {
  courses: LmsCourse[];
  payments: LmsPayment[];
  users: AdminUserOverview[];
  enrollments: LmsEnrollment[];
}

const daysSince = (isoDate: string): number => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return diffMs / (1000 * 60 * 60 * 24);
};

export const isAtRiskEnrollment = (enrollment: LmsEnrollment): boolean => {
  const hasAccess = enrollment.accessStatus === "approved" || enrollment.accessStatus === "free";
  return (
    hasAccess &&
    daysSince(enrollment.updatedAt) > AT_RISK_STALE_DAYS &&
    enrollment.progress < AT_RISK_PROGRESS_THRESHOLD
  );
};

const computeTrendLabel = (
  current: number,
  previous: number,
): { direction: "up" | "down" | "flat"; pct: number } => {
  if (previous === 0) {
    return { direction: current > 0 ? "up" : "flat", pct: current > 0 ? 100 : 0 };
  }
  const pct = ((current - previous) / previous) * 100;
  if (pct >= REVENUE_TREND_SIGNIFICANCE_PCT) return { direction: "up", pct };
  if (pct <= -REVENUE_TREND_SIGNIFICANCE_PCT) return { direction: "down", pct };
  return { direction: "flat", pct };
};

const buildRevenueTrendInsight = (payments: LmsPayment[]): Insight | null => {
  const series = buildMonthlyRevenueSeries(payments);
  if (series.length === 0) return null;

  const last = series[series.length - 1];
  const previous = series.length >= 2 ? series[series.length - 2] : null;

  if (!previous) {
    if (last.approved <= 0) return null;
    return {
      id: "revenue-trend",
      severity: "info",
      title: `First recorded revenue of ${formatMoney(last.approved)} in ${last.monthLabel}.`,
    };
  }

  const trend = computeTrendLabel(last.approved, previous.approved);
  if (trend.direction === "up") {
    return {
      id: "revenue-trend",
      severity: "positive",
      title: `Revenue is trending up: approved revenue reached ${formatMoney(last.approved)} in ${last.monthLabel}, up ${trend.pct.toFixed(0)}% from ${formatMoney(previous.approved)} the prior month.`,
    };
  }
  if (trend.direction === "down") {
    return {
      id: "revenue-trend",
      severity: "warning",
      title: `Revenue is trending down: approved revenue fell ${Math.abs(trend.pct).toFixed(0)}% month-over-month, from ${formatMoney(previous.approved)} to ${formatMoney(last.approved)}.`,
    };
  }
  const sign = trend.pct >= 0 ? "+" : "";
  return {
    id: "revenue-trend",
    severity: "info",
    title: `Revenue is holding steady month-over-month (${formatMoney(last.approved)}, ${sign}${trend.pct.toFixed(0)}% change).`,
  };
};

const buildCoursePerformanceInsights = (
  courses: LmsCourse[],
  enrollments: LmsEnrollment[],
  payments: LmsPayment[],
): Insight[] => {
  const performance = buildCoursePerformanceSeries(courses, enrollments, payments);
  if (performance.length === 0) return [];

  const insights: Insight[] = [];
  const top = performance[0];
  if (top.activeEnrollments > 0) {
    insights.push({
      id: "top-course",
      severity: "positive",
      title: `${top.title} is the top-performing course with ${top.activeEnrollments} active enrollment${top.activeEnrollments === 1 ? "" : "s"} and ${formatMoney(top.approvedRevenue)} in approved revenue.`,
    });
  }

  const eligibleForWorst = performance.filter((row) => {
    const course = courses.find((item) => item.id === row.courseId);
    if (!course || row.isFree) return false;
    return daysSince(course.createdAt) > NEW_COURSE_GRACE_DAYS;
  });

  if (eligibleForWorst.length >= 3) {
    const worst = eligibleForWorst[eligibleForWorst.length - 1];
    insights.push({
      id: "worst-course",
      severity: "warning",
      title: `${worst.title} has the fewest active enrollments (${worst.activeEnrollments}) among courses live for over a month — consider reviewing its pricing or promotion.`,
    });
  }

  return insights;
};

const buildAtRiskInsight = (
  enrollments: LmsEnrollment[],
  users: AdminUserOverview[],
  courses: LmsCourse[],
): Insight | null => {
  const atRisk = enrollments.filter(isAtRiskEnrollment);
  const affectedUserIds = new Set(atRisk.map((row) => row.userId));
  if (affectedUserIds.size === 0) return null;

  const detail: AtRiskDetail[] = atRisk.slice(0, 5).map((enrollment) => {
    const user = users.find((row) => row.id === enrollment.userId);
    const course = courses.find((row) => row.id === enrollment.courseId);
    return {
      userId: enrollment.userId,
      fullName: user?.fullName ?? "Unknown learner",
      email: user?.email ?? "",
      courseTitle: course?.title ?? "Unknown course",
      progress: enrollment.progress,
      daysSinceActivity: Math.round(daysSince(enrollment.updatedAt)),
    };
  });

  return {
    id: "at-risk-students",
    severity: "warning",
    title: `${affectedUserIds.size} student${affectedUserIds.size === 1 ? "" : "s"} show${affectedUserIds.size === 1 ? "s" : ""} signs of disengagement — enrolled but under ${AT_RISK_PROGRESS_THRESHOLD}% complete with no activity in over ${AT_RISK_STALE_DAYS} days.`,
    detail,
  };
};

const buildPaymentBacklogInsights = (payments: LmsPayment[]): Insight[] => {
  const insights: Insight[] = [];
  const pending = payments.filter((row) => row.status === "pending");
  const pendingValue = pending.reduce((sum, row) => sum + row.amount, 0);

  if (pending.length > 0) {
    insights.push({
      id: "payment-backlog",
      severity: "warning",
      title: `${pending.length} payment submission${pending.length === 1 ? "" : "s"} worth ${formatMoney(pendingValue)} ${pending.length === 1 ? "is" : "are"} awaiting approval.`,
      actionLabel: "Review Payments",
      actionPath: "/admin/payments",
    });
  }

  if (payments.length >= MIN_SAMPLE_FOR_RATE_INSIGHT) {
    const approvedCount = payments.filter((row) => row.status === "approved").length;
    const approvalRate = (approvedCount / payments.length) * 100;
    if (approvalRate < LOW_APPROVAL_RATE_PCT) {
      insights.push({
        id: "low-approval-rate",
        severity: "warning",
        title: `Only ${approvalRate.toFixed(0)}% of submitted payments have been approved — review recurring rejection reasons in the payment queue.`,
        actionLabel: "Review Payments",
        actionPath: "/admin/payments",
      });
    }
  }

  return insights;
};

const buildStudentGrowthInsight = (users: AdminUserOverview[]): Insight | null => {
  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const currentWindowStart = now - NEW_STUDENT_WINDOW_DAYS * dayMs;
  const previousWindowStart = now - NEW_STUDENT_WINDOW_DAYS * 2 * dayMs;

  const currentCount = users.filter((user) => {
    const joined = new Date(user.dateJoined).getTime();
    return joined >= currentWindowStart;
  }).length;
  const previousCount = users.filter((user) => {
    const joined = new Date(user.dateJoined).getTime();
    return joined >= previousWindowStart && joined < currentWindowStart;
  }).length;

  if (currentCount === 0 && previousCount === 0) return null;

  const trend = computeTrendLabel(currentCount, previousCount);
  if (trend.direction === "up") {
    return {
      id: "student-growth",
      severity: "positive",
      title: `New student signups are up: ${currentCount} in the last ${NEW_STUDENT_WINDOW_DAYS} days, versus ${previousCount} the ${NEW_STUDENT_WINDOW_DAYS} days before.`,
    };
  }
  if (trend.direction === "down") {
    return {
      id: "student-growth",
      severity: "warning",
      title: `New student signups have slowed: ${currentCount} in the last ${NEW_STUDENT_WINDOW_DAYS} days, down from ${previousCount} the ${NEW_STUDENT_WINDOW_DAYS} days before.`,
    };
  }
  return {
    id: "student-growth",
    severity: "info",
    title: `New student signups are steady at ${currentCount} in the last ${NEW_STUDENT_WINDOW_DAYS} days.`,
  };
};

export const computeInsights = (input: InsightsInput): Insight[] => {
  const insights: Insight[] = [];

  const revenueTrend = buildRevenueTrendInsight(input.payments);
  if (revenueTrend) insights.push(revenueTrend);

  insights.push(...buildCoursePerformanceInsights(input.courses, input.enrollments, input.payments));

  const atRisk = buildAtRiskInsight(input.enrollments, input.users, input.courses);
  if (atRisk) insights.push(atRisk);

  insights.push(...buildPaymentBacklogInsights(input.payments));

  const growth = buildStudentGrowthInsight(input.users);
  if (growth) insights.push(growth);

  const severityRank: Record<InsightSeverity, number> = {
    critical: 0,
    warning: 1,
    positive: 2,
    info: 3,
  };
  return insights.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
};
