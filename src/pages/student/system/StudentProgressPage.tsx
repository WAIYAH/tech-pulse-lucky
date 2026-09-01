import { Link } from "react-router-dom";
import { Award, BookOpenCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseProgress from "@/components/lms/CourseProgress";
import { routes } from "@/routes/routeConfig";
import { enrollmentStatusBadgeVariant } from "@/lib/student/enrollmentStatusBadge";
import { useStudentPortal } from "./StudentPortalContext";

const StudentProgressPage = () => {
  const { isLoading, enrollments, courseById, progressByCourseId, averageProgress } =
    useStudentPortal();

  const completedCourses = enrollments.filter((enrollment) => enrollment.progress >= 100).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Learning Progress</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor your progress by course, lesson completion, and mastery milestones.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Progress</p>
                <p className="text-3xl font-semibold">{averageProgress}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Courses</p>
                <p className="text-3xl font-semibold">{completedCourses}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tracks</p>
                <p className="text-3xl font-semibold">{enrollments.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <BookOpenCheck className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Per-Course Breakdown</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading progress data...</p>
            ) : enrollments.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No enrolled courses yet. Once enrolled, your learning milestones appear
                  here.
                </p>
                <Button variant="accent" asChild>
                  <Link to={routes.student.browseCourses}>Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments
                  .slice()
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                  .map((enrollment) => {
                    const course = courseById[enrollment.courseId];
                    const progressRows = progressByCourseId[enrollment.courseId] ?? [];
                    const completedLessons = progressRows.filter((row) => row.completed).length;
                    const totalLessons = course?.lessonsCount ?? 0;
                    const hasAccess =
                      enrollment.accessStatus === "free" ||
                      enrollment.accessStatus === "approved";
                    const nextLesson = course?.lessons
                      .slice()
                      .sort((a, b) => a.lessonOrder - b.lessonOrder)
                      .find((lesson) => !progressRows.some((row) => row.lessonId === lesson.id && row.completed));

                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{course?.title ?? "Course"}</p>
                            <p className="text-xs text-muted-foreground">
                              {completedLessons}/{totalLessons} lessons complete
                            </p>
                          </div>
                          <Badge variant={enrollmentStatusBadgeVariant[enrollment.accessStatus]}>
                            {enrollment.accessStatus}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <CourseProgress value={enrollment.progress} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {nextLesson ? (
                            <span>
                              Next lesson:{" "}
                              <span className="font-medium text-foreground">
                                {nextLesson.title}
                              </span>
                            </span>
                          ) : (
                            <span>All lessons completed for this course.</span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {course && hasAccess ? (
                            <Button size="sm" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.learn(course.slug)}>
                                {enrollment.progress > 0 ? "Continue Course" : "Start Course"}
                              </Link>
                            </Button>
                          ) : null}
                          {course && !hasAccess && !course.isFree ? (
                            <Button size="sm" variant="destructive" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.payment(course.slug)}>
                                Resolve Payment Access
                              </Link>
                            </Button>
                          ) : null}
                          {course && !hasAccess && course.isFree ? (
                            <Button size="sm" variant="success" asChild className="w-full sm:w-auto">
                              <Link to={routes.public.course(course.slug)}>
                                Enroll to Start
                              </Link>
                            </Button>
                          ) : null}
                          {course ? (
                            <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                              <Link to={routes.public.course(course.slug)}>View Details</Link>
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
      </section>
    </div>
  );
};

export default StudentProgressPage;
