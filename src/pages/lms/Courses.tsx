import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/lms/CourseCard";
import { lmsProvider } from "@/lib/lms";
import { getCourseLevels } from "@/data/courses";
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

    return allRows.filter((course) => {
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
  }, [allRows, category, level, pricing, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPricing("all");
    setLevel("all");
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
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
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

