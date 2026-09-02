import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, Percent, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/student/EmptyState";
import ListSkeleton from "@/components/student/ListSkeleton";
import { lmsProvider } from "@/lib/lms";
import type { AdminUserOverview, LmsCourse, LmsEnrollment, LmsPayment } from "@/types/lms";
import noResultsImage from "@/assets/empty-states/no-results.svg";
import CoursePerformanceChart from "./CoursePerformanceChart";
import InsightsPanel from "./InsightsPanel";
import RevenueTrendChart from "./RevenueTrendChart";
import { buildCoursePerformanceSeries, buildMonthlyRevenueSeries, formatMoney } from "./reportsData";
import { computeInsights } from "./insightsEngine";

const AdminReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [users, setUsers] = useState<AdminUserOverview[]>([]);
  const [enrollments, setEnrollments] = useState<LmsEnrollment[]>([]);

  useEffect(() => {
    const load = async () => {
      const [courseRows, paymentRows, userRows, enrollmentRows] = await Promise.all([
        lmsProvider.listCourses(),
        lmsProvider.getAllPayments(),
        lmsProvider.listUsers(),
        lmsProvider.getAllEnrollments(),
      ]);
      setCourses(courseRows);
      setPayments(paymentRows);
      setUsers(userRows);
      setEnrollments(enrollmentRows);
      setIsLoading(false);
    };

    void load();
  }, []);

  const totals = useMemo(() => {
    const approved = payments
      .filter((row) => row.status === "approved")
      .reduce((sum, row) => sum + row.amount, 0);
    const pending = payments
      .filter((row) => row.status === "pending")
      .reduce((sum, row) => sum + row.amount, 0);
    const approvalRate =
      payments.length === 0
        ? 0
        : (payments.filter((row) => row.status === "approved").length / payments.length) * 100;
    const activeLearners = users.filter((user) => user.enrolledCourseIds.length > 0).length;

    return { approved, pending, approvalRate, activeLearners };
  }, [payments, users]);

  const revenueSeries = useMemo(() => buildMonthlyRevenueSeries(payments), [payments]);
  const performanceSeries = useMemo(
    () => buildCoursePerformanceSeries(courses, enrollments, payments),
    [courses, enrollments, payments],
  );
  const insights = useMemo(
    () => computeInsights({ courses, payments, users, enrollments }),
    [courses, payments, users, enrollments],
  );

  const hasAnyData = courses.length > 0 || payments.length > 0 || users.length > 0;

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue trends, course performance, and rule-based insights computed from your live data.
        </p>
      </section>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : !hasAnyData ? (
        <EmptyState
          image={noResultsImage}
          title="Nothing to report yet"
          description="Once courses, payments, or enrollments start coming in, reports and insights will appear here."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Revenue</p>
                    <p className="text-2xl font-semibold">{formatMoney(totals.approved)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Value</p>
                    <p className="text-2xl font-semibold">{formatMoney(totals.pending)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                    <CircleDollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-semibold">{totals.approvalRate.toFixed(1)}%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                    <Percent className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Learners</p>
                    <p className="text-2xl font-semibold">{totals.activeLearners}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <RevenueTrendChart data={revenueSeries} />
            <CoursePerformanceChart data={performanceSeries} />
          </section>

          <section>
            <InsightsPanel insights={insights} users={users} enrollments={enrollments} />
          </section>
        </>
      )}
    </div>
  );
};

export default AdminReportsPage;
