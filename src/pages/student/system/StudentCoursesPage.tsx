import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { routes } from "@/routes/routeConfig";
import CourseProgress from "@/components/lms/CourseProgress";
import { useStudentPortal } from "./StudentPortalContext";

type AccessFilter = "all" | "accessible" | "locked";

const StudentCoursesPage = () => {
  const { isLoading, enrollments, courseById, latestPaymentByCourseId } = useStudentPortal();
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return enrollments.filter((enrollment) => {
      const course = courseById[enrollment.courseId];
      const courseTitle = course?.title.toLowerCase() ?? "";
      const category = course?.category.toLowerCase() ?? "";
      const hasAccess =
        enrollment.accessStatus === "free" || enrollment.accessStatus === "approved";

      const matchesQuery =
        normalized.length === 0 ||
        courseTitle.includes(normalized) ||
        category.includes(normalized);
      const matchesFilter =
        accessFilter === "all" ||
        (accessFilter === "accessible" ? hasAccess : !hasAccess);

      return matchesQuery && matchesFilter;
    });
  }, [accessFilter, courseById, enrollments, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Course Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage enrolled courses, access approvals, and learning entry points.
        </p>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">My Courses</h2>
                <p className="text-sm text-muted-foreground">
                  Find any enrolled course and continue from where you left off.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="relative sm:w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search enrolled courses"
                    className="pl-9"
                  />
                </div>
                <Select
                  value={accessFilter}
                  onValueChange={(value: AccessFilter) => setAccessFilter(value)}
                >
                  <SelectTrigger className="sm:w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="accessible">Accessible</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading enrollments...</p>
            ) : filtered.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No course records match your current filters.
                </p>
                <Button asChild>
                  <Link to={routes.public.courses}>Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered
                  .slice()
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
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
                              {course?.category ?? "General"} • {course?.level ?? "Beginner"} •{" "}
                              {course?.lessonsCount ?? 0} lessons
                            </p>
                          </div>
                          <Badge variant="secondary">{enrollment.accessStatus}</Badge>
                        </div>

                        <div className="mt-3">
                          <CourseProgress value={enrollment.progress} />
                        </div>

                        {latestPayment && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Latest payment: {latestPayment.status}
                            {latestPayment.adminNote ? ` • ${latestPayment.adminNote}` : ""}
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
                              <Link to={routes.student.payment(course.slug)}>
                                Resolve Payment Access
                              </Link>
                            </Button>
                          ) : null}

                          {course ? (
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={routes.public.course(course.slug)}>View Course</Link>
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

export default StudentCoursesPage;
