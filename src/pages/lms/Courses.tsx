import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SEO from "@/components/common/SEO";
import CourseCard from "@/components/lms/CourseCard";
import { lmsProvider } from "@/lib/lms";
import {
  enrollmentReopenLabel,
  isCourseLocked,
  isEnrollmentFocusActive,
} from "@/lib/lms/enrollmentFocus";
import { getCourseLevels } from "@/data/courses";
import { routes } from "@/routes/routeConfig";
import type { CourseLevel, LmsCourse, LmsCourseFilters } from "@/types/lms";

type PricingFilter = "all" | "free" | "paid";
type CategoryFilter = "all" | string;
type LevelFilter = "all" | CourseLevel;

const Courses = () => {
  const [allRows, setAllRows] = useState<LmsCourse[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const rows = await lmsProvider.listCourses();
      setAllRows(rows);
      setLoading(false);
    };

    load();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(allRows.map((course) => course.category))).sort(),
    [allRows],
  );

  const filtered = useMemo(() => {
    const filters: LmsCourseFilters = {
      query,
      category: category === "all" ? undefined : category,
      pricing: pricing === "all" ? undefined : pricing,
      level: level === "all" ? undefined : level,
      sortBy: "title",
    };

    const normalizedQuery = (filters.query ?? "").trim().toLowerCase();

    const matches = allRows.filter((course) => {
      if (filters.category && course.category !== filters.category) return false;
      if (filters.pricing === "free" && !course.isFree) return false;
      if (filters.pricing === "paid" && course.isFree) return false;
      if (filters.level && course.level !== filters.level) return false;

      if (!normalizedQuery) return true;

      return (
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.shortDescription.toLowerCase().includes(normalizedQuery) ||
        course.category.toLowerCase().includes(normalizedQuery)
      );
    });

    // While enrollment is focused on the masterclass, the courses that are still
    // open lead and the locked ones settle at the bottom of the grid.
    return matches.sort(
      (a, b) => Number(isCourseLocked(a.slug)) - Number(isCourseLocked(b.slug)),
    );
  }, [allRows, category, level, pricing, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setLevel("all");
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
      <SEO
        title="Courses | Tech Pulse Insider LMS"
        description="Explore beginner to advanced online tech courses in Kenya, including free digital literacy classes and paid practical masterclasses."
        canonicalPath={routes.public.courses}
        keywords="online tech courses in Kenya, LMS for beginner tech learners, learn web development, digital skills training"
      />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse <span className="text-primary">LMS Courses</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover free and paid practical courses in digital literacy, web development,
            cybersecurity, AI, and more.
          </p>
        </motion.div>

        {isEnrollmentFocusActive() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold">
                  We are running one cohort at a time
                </p>
                <p className="text-sm text-muted-foreground">
                  The Web Development Masterclass is the only course open for
                  enrollment right now. Everything else reopens on{" "}
                  {enrollmentReopenLabel()}.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link to={routes.public.masterclass}>View the Masterclass</Link>
            </Button>
          </motion.div>
        )}

        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses"
                className="pl-9"
              />
            </div>

            <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
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

            <div className="lg:col-span-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading courses...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">
              No courses matched your filters.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                locked={isCourseLocked(course.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
