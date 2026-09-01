import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  CircleDollarSign,
  Clock3,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { lmsProvider } from "@/lib/lms";
import { paymentStatusBadgeVariant } from "@/lib/statusBadges";
import { routes } from "@/routes/routeConfig";
import type { AdminUserOverview, LmsCourse, LmsPayment } from "@/types/lms";
import { adminNavItems } from "./adminNavigation";

const formatMoney = (amount: number, currency = "KES") => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AdminOverviewPage = () => {
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [users, setUsers] = useState<AdminUserOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [courseRows, paymentRows, userRows] = await Promise.all([
        lmsProvider.listCourses(),
        lmsProvider.getAllPayments(),
        lmsProvider.listUsers(),
      ]);

      setCourses(courseRows);
      setPayments(paymentRows);
      setUsers(userRows);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const pendingCount = payments.filter((row) => row.status === "pending").length;
    const approvedCount = payments.filter((row) => row.status === "approved").length;
    const rejectedCount = payments.filter((row) => row.status === "rejected").length;
    const approvedRevenue = payments
      .filter((row) => row.status === "approved")
      .reduce((sum, row) => sum + row.amount, 0);
    const pendingRevenue = payments
      .filter((row) => row.status === "pending")
      .reduce((sum, row) => sum + row.amount, 0);
    const activeLearners = users.filter((row) => row.enrolledCourseIds.length > 0).length;
    const freeCourses = courses.filter((row) => row.isFree).length;
    const paidCourses = courses.length - freeCourses;

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      approvedRevenue,
      pendingRevenue,
      activeLearners,
      freeCourses,
      paidCourses,
    };
  }, [courses, payments, users]);

  const latestPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8);
  }, [payments]);

  const courseTitleById = useMemo(() => {
    return courses.reduce<Record<string, string>>((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
  }, [courses]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Central operations panel for students, courses, payments, finance, and LMS
          controls.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
                <p className="text-3xl font-semibold">{stats.activeLearners}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Catalog</p>
                <p className="text-3xl font-semibold">{courses.length}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.freeCourses} free • {stats.paidCourses} paid
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Revenue</p>
                <p className="text-2xl font-semibold">
                  {formatMoney(stats.approvedRevenue)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <CircleDollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval Value</p>
                <p className="text-2xl font-semibold">{formatMoney(stats.pendingRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Payment Submissions</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading admin analytics...</p>
            ) : latestPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payment activity yet. New submissions will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {latestPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{payment.fullName}</p>
                        <p className="break-all text-xs text-muted-foreground">
                          {payment.email} • {courseTitleById[payment.courseId] ?? "Unknown course"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={paymentStatusBadgeVariant[payment.status]}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm font-medium">
                          {formatMoney(payment.amount, payment.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild size="sm">
                <Link to={routes.admin.payments}>Open Payment Queue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">System Snapshot</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Payment States
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-semibold">{stats.pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div>
                  <p className="font-semibold">{stats.approvedCount}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <div>
                  <p className="font-semibold">{stats.rejectedCount}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4 text-primary" />
                Admin Modules
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Dedicated screens now exist for students, finance, website content, LMS
                control, and settings.
              </p>
            </div>

            <div className="rounded-lg border border-amber-300/40 bg-amber-100/40 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <ShieldAlert className="h-4 w-4" />
                Access Control
              </div>
              <p className="mt-2 text-xs text-amber-800/90">
                Admin routes are role-protected. Non-admin users are redirected away from
                this area.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Navigation</h2>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {adminNavItems
              .filter((item) => item.path !== "/admin")
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-2 font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </Link>
                );
              })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminOverviewPage;
