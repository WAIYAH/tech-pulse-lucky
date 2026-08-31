import { Link } from "react-router-dom";
import { Award, BadgeCheck, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/routes/routeConfig";
import { useStudentPortal } from "./StudentPortalContext";

const StudentCertificatesPage = () => {
  const { isLoading, config, enrollments, courseById } = useStudentPortal();

  const eligible = enrollments.filter((enrollment) => {
    const hasAccess =
      enrollment.accessStatus === "approved" || enrollment.accessStatus === "free";
    return hasAccess && enrollment.progress >= 100;
  });

  const inProgress = enrollments.filter((enrollment) => {
    const hasAccess =
      enrollment.accessStatus === "approved" || enrollment.accessStatus === "free";
    return hasAccess && enrollment.progress < 100;
  });

  const lockedCourses = enrollments.filter((enrollment) => {
    return enrollment.accessStatus !== "approved" && enrollment.accessStatus !== "free";
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Certificates</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View certificate readiness and completion achievements for finished courses.
        </p>
      </section>

      {!config.featureFlags.enableCertificates && (
        <section>
          <Card className="border-amber-300/50 bg-amber-100/30">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900">
                Certificate issuance is currently disabled in LMS settings. Your completion
                progress is still tracked and readiness is shown below.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Eligible Certificates</p>
            <p className="text-3xl font-semibold">{eligible.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Courses In Progress</p>
            <p className="text-3xl font-semibold">{inProgress.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Feature Status</p>
            <p className="text-lg font-semibold">
              {config.featureFlags.enableCertificates ? "Enabled" : "Disabled"}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Eligible Now</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading certificates...</p>
            ) : eligible.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No completed courses yet. Finish a course to unlock certificate readiness.
              </p>
            ) : (
              <div className="space-y-3">
                {eligible.map((enrollment) => {
                  const course = courseById[enrollment.courseId];
                  return (
                    <div
                      key={enrollment.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{course?.title ?? "Course"}</p>
                        <Badge variant="secondary">100%</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Completion achieved on this learning path.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                          <BadgeCheck className="mr-1 h-4 w-4" />
                          Download Certificate (Coming Soon)
                        </Button>
                        {course ? (
                          <Button size="sm" variant="ghost" asChild className="w-full sm:w-auto">
                            <Link to={routes.student.learn(course.slug)}>Review Course</Link>
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
            <h2 className="text-xl font-semibold">Next Certificates</h2>
          </CardHeader>
          <CardContent>
            {inProgress.length === 0 ? (
              lockedCourses.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Unlock your pending paid courses to continue toward certificate eligibility.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You are caught up. All enrolled courses are complete.
                </p>
              )
            ) : (
              <div className="space-y-3">
                {inProgress
                  .slice()
                  .sort((a, b) => b.progress - a.progress)
                  .map((enrollment) => {
                    const course = courseById[enrollment.courseId];
                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{course?.title ?? "Course"}</p>
                          <Badge variant="outline">{enrollment.progress}%</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Complete this course to unlock certificate eligibility.
                        </p>
                        <div className="mt-3">
                          {course ? (
                            <Button size="sm" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.learn(course.slug)}>
                                <Award className="mr-1 h-4 w-4" />
                                Continue Learning
                              </Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                              <LockKeyhole className="mr-1 h-4 w-4" />
                              Course unavailable
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentCertificatesPage;
