import { Link } from "react-router-dom";
import {
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
  } = useStudentPortal();

  const pendingPayments = payments.filter((payment) => payment.status === "pending").length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {user?.fullName ?? "Learner"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your student portal tracks progress, access status, payments, and study support
          in one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                <p className="text-3xl font-semibold">{enrollments.length}</p>
              </div>
              <BookOpenCheck className="h-5 w-5 text-primary" />
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
              <GraduationCap className="h-5 w-5 text-primary" />
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
              <CreditCard className="h-5 w-5 text-primary" />
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
              <Clock3 className="h-5 w-5 text-amber-600" />
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
                <Button asChild>
                  <Link to={routes.public.courses}>Explore Courses</Link>
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
                          <Badge variant="secondary">{enrollment.accessStatus}</Badge>
                        </div>

                        <div className="mt-3">
                          <CourseProgress value={enrollment.progress} />
                        </div>

                        {latestPayment?.adminNote && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Admin note: {latestPayment.adminNote}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {course && hasAccess ? (
                            <Button size="sm" asChild>
                              <Link to={routes.student.learn(course.slug)}>
                                {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
                              </Link>
                            </Button>
                          ) : null}
                          {course && !hasAccess && !course.isFree ? (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={routes.student.payment(course.slug)}>Open Payment</Link>
                            </Button>
                          ) : null}
                          {course ? (
                            <Button size="sm" variant="ghost" asChild>
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
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentOverviewPage;
