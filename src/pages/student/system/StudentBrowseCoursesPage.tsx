import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatKesAmount } from "@/data/lmsConfig";
import { getCourseLevels } from "@/data/courses";
import { lmsProvider } from "@/lib/lms";
import { routes } from "@/routes/routeConfig";
import type { CourseLevel } from "@/types/lms";
import { useStudentPortal } from "./StudentPortalContext";
import CourseCardGridSkeleton from "@/components/student/CourseCardGridSkeleton";
import EmptyState from "@/components/student/EmptyState";
import noResultsImage from "@/assets/empty-states/no-results.svg";

type PricingFilter = "all" | "free" | "paid";
type LevelFilter = "all" | CourseLevel;

const StudentBrowseCoursesPage = () => {
  const { user, courses, enrollmentByCourseId, isLoading, refresh } = useStudentPortal();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(courses.map((course) => course.category))).sort(),
    [courses],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return courses.filter((course) => {
      if (category !== "all" && course.category !== category) return false;
      if (pricing === "free" && !course.isFree) return false;
      if (pricing === "paid" && course.isFree) return false;
      if (level !== "all" && course.level !== level) return false;
      if (!normalized) return true;

      return (
        course.title.toLowerCase().includes(normalized) ||
        course.shortDescription.toLowerCase().includes(normalized) ||
        course.category.toLowerCase().includes(normalized)
      );
    });
  }, [courses, category, level, pricing, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setLevel("all");
  };

  const handleEnrollFree = async (courseId: string, slug: string) => {
    if (!user) return;
    setEnrollingId(courseId);
    try {
      await lmsProvider.enrollInFreeCourse(user.id, slug);
      await refresh();
      toast({ title: "Enrolled", description: "This course is now in My Courses." });
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl bg-gradient-hero p-5 text-primary-foreground shadow-glow">
        <h1 className="text-2xl font-bold md:text-3xl">Browse Courses</h1>
        <p className="mt-2 text-sm text-primary-foreground/85">
          Explore the full catalog and enroll without leaving your dashboard.
        </p>
      </section>

      <Card>
        <CardHeader className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses"
                className="pl-9"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={pricing} onValueChange={(value: PricingFilter) => setPricing(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={(value: LevelFilter) => setLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {getCourseLevels().map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={resetFilters} className="w-fit">
            Reset Filters
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <CourseCardGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              image={noResultsImage}
              title="No courses matched your filters"
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((course) => {
                const isEnrolled = Boolean(enrollmentByCourseId[course.id]);

                return (
                  <Card
                    key={course.id}
                    className="flex flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg"
                  >
                    <div className="flex h-40 items-center justify-center bg-gradient-to-r from-primary/10 to-accent/20">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={course.isFree ? "success" : "default"}>
                          {course.isFree ? "FREE" : "PAID"}
                        </Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <h3 className="font-bold leading-tight">{course.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {course.shortDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.category} • {course.lessonsCount} lessons
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-primary">
                        {course.isFree ? "Free" : formatKesAmount(course.price)}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={routes.public.course(course.slug)}>Details</Link>
                        </Button>
                        {isEnrolled ? (
                          <Button size="sm" variant="secondary" asChild>
                            <Link to={routes.student.myCourses}>Enrolled</Link>
                          </Button>
                        ) : course.isFree ? (
                          <Button
                            size="sm"
                            variant="success"
                            disabled={enrollingId === course.id}
                            onClick={() => handleEnrollFree(course.id, course.slug)}
                          >
                            {enrollingId === course.id ? "Enrolling..." : "Enroll"}
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link to={routes.student.payment(course.slug)}>Enroll</Link>
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBrowseCoursesPage;
