import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  Clock3,
  CreditCard,
  GraduationCap,
  LifeBuoy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseProgress from "@/components/lms/CourseProgress";
import { routes } from "@/routes/routeConfig";
import { enrollmentStatusBadgeVariant } from "@/lib/student/enrollmentStatusBadge";
import { useStudentPortal } from "./StudentPortalContext";

const StudentOverviewPage = () => {
  const {
    isLoading,
    user,
    enrollments,
    payments,
    latestPaymentByCourseId,
    courseById,
    averageProgress,
    completedLessons,
    totalLessons,
    supportTickets,
    unreadNotificationsCount,
  } = useStudentPortal();

  const pendingPayments = payments.filter((payment) => payment.status === "pending").length;

  const nextBestAction = useMemo(() => {
    if (isLoading) return null;

    if (unreadNotificationsCount > 0) {
      return {
        title: "Review your latest updates",
        description: `${unreadNotificationsCount} unread notification${unreadNotificationsCount === 1 ? "" : "s"} waiting.`,
        ctaLabel: "Open Notifications",
        href: routes.student.notifications,
      };
    }

    const unresolvedSupport = supportTickets.filter((ticket) => ticket.status !== "resolved");
    if (unresolvedSupport.length > 0) {
      const active = unresolvedSupport[0];
      return {
        title: "Follow up on support request",
        description: `Ticket "${active.subject}" is currently ${active.status.replace("_", " ")}.`,
        ctaLabel: "Open Support Center",
        href: routes.student.support,
      };
    }

    const blockedPaidEnrollment = enrollments.find((enrollment) => {
      const course = courseById[enrollment.courseId];
      if (!course || course.isFree) return false;
      return enrollment.accessStatus !== "approved";
    });

    if (blockedPaidEnrollment) {
      const course = courseById[blockedPaidEnrollment.courseId];
      if (course) {
        return {
          title: "Unlock your paid course",
          description: `${course.title} still needs payment verification.`,
          ctaLabel: "Resolve Payment Access",
          href: routes.student.payment(course.slug),
        };
      }
    }

    const activeCourse = enrollments
      .filter((enrollment) => {
        const hasAccess =
          enrollment.accessStatus === "free" || enrollment.accessStatus === "approved";
        return hasAccess && enrollment.progress < 100;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

    if (activeCourse) {
      const course = courseById[activeCourse.courseId];
      if (course) {
        return {
          title: "Continue your learning streak",
          description: `Next step: ${course.title} (${activeCourse.progress}% complete).`,
          ctaLabel: "Continue Course",
          href: routes.student.learn(course.slug),
        };
      }
    }

    if (enrollments.length === 0) {
      return {
        title: "Start your first learning track",
        description: "Choose a beginner-friendly course and begin today.",
        ctaLabel: "Explore Courses",
        href: routes.student.browseCourses,
      };
    }

    return {
      title: "Explore live events",
      description: "Keep momentum with upcoming webinars and workshops.",
      ctaLabel: "Open Webinars",
      href: routes.student.webinars,
    };
  }, [
    courseById,
    enrollments,
    isLoading,
    supportTickets,
    unreadNotificationsCount,
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-hero p-5 text-primary-foreground shadow-glow">
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {user?.fullName ?? "Learner"}
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/85">
          Track progress, access status, payments, and study support in one place.
        </p>
      </section>

      {nextBestAction && (
        <section>
          <Card className="border-accent/40 bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground/80">
                Next Best Action
              </p>
              <h2 className="mt-2 text-xl font-semibold">{nextBestAction.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{nextBestAction.description}</p>
              <div className="mt-4">
                <Button variant="hero" asChild>
                  <Link to={nextBestAction.href}>{nextBestAction.ctaLabel}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                <p className="text-3xl font-semibold">{enrollments.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <BookOpenCheck className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Progress</p>
                <p className="text-3xl font-semibold">{averageProgress}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payments Submitted</p>
                <p className="text-3xl font-semibold">{payments.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-semibold">{pendingPayments}</p>
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
            <h2 className="text-xl font-semibold">My Learning Access</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading your portal...</p>
            ) : enrollments.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You are not enrolled in any course yet. Start with available tracks.
                </p>
                <Button variant="accent" asChild>
                  <Link to={routes.student.browseCourses}>Explore Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments
                  .slice()
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                  .slice(0, 6)
                  .map((enrollment) => {
                    const course = courseById[enrollment.courseId];
                    const latestPayment = latestPaymentByCourseId[enrollment.courseId];
                    const hasAccess =
                      enrollment.accessStatus === "free" ||
                      enrollment.accessStatus === "approved";

                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{course?.title ?? "Course"}</p>
                            <p className="text-xs text-muted-foreground">
                              {course?.duration ?? "Duration not set"} •{" "}
                              {course?.lessonsCount ?? 0} lessons
                            </p>
                          </div>
                          <Badge variant={enrollmentStatusBadgeVariant[enrollment.accessStatus]}>
                            {enrollment.accessStatus}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <CourseProgress value={enrollment.progress} />
                        </div>

                        {latestPayment?.adminNote && (
                          <p className="mt-2 break-words text-xs text-muted-foreground">
                            Admin note: {latestPayment.adminNote}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {course && hasAccess ? (
                            <Button size="sm" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.learn(course.slug)}>
                                {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
                              </Link>
                            </Button>
                          ) : null}
                          {course && !hasAccess && !course.isFree ? (
                            <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.payment(course.slug)}>Open Payment</Link>
                            </Button>
                          ) : null}
                          {course ? (
                            <Button size="sm" variant="ghost" asChild className="w-full sm:w-auto">
                              <Link to={routes.public.course(course.slug)}>Course Details</Link>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Hub</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to={routes.student.progress}
              className="block rounded-lg border border-border bg-background p-3 hover:border-primary/50"
            >
              <p className="font-medium">Learning Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed.
              </p>
            </Link>

            <Link
              to={routes.student.payments}
              className="block rounded-lg border border-border bg-background p-3 hover:border-primary/50"
            >
              <p className="font-medium">Payments</p>
              <p className="text-xs text-muted-foreground">
                {pendingPayments} payment requests pending review.
              </p>
            </Link>

            <Link
              to={routes.student.support}
              className="block rounded-lg border border-border bg-background p-3 hover:border-primary/50"
            >
              <p className="flex items-center gap-2 font-medium">
                <LifeBuoy className="h-4 w-4 text-primary" />
                Support Center
              </p>
              <p className="text-xs text-muted-foreground">
                Get help with courses, billing, or technical access.
              </p>
            </Link>

            <Link
              to={routes.student.notifications}
              className="block rounded-lg border border-border bg-background p-3 hover:border-primary/50"
            >
              <p className="flex items-center gap-2 font-medium">
                <Bell className="h-4 w-4 text-primary" />
                Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                {unreadNotificationsCount} unread updates from support and payments.
              </p>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentOverviewPage;
