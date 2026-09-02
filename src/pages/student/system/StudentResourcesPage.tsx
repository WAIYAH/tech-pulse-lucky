import { useMemo, useState } from "react";
import { BookOpenText, Download, ExternalLink, Lightbulb, Search } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/student/EmptyState";
import { getDidYouKnowOfTheWeek, getWordOfTheDay } from "@/lib/dailyContent";
import { useStudentPortal } from "./StudentPortalContext";
import noResourcesImage from "@/assets/empty-states/no-resources.svg";

interface ResourceItem {
  id: string;
  courseTitle: string;
  lessonTitle: string;
  title: string;
  url: string;
  type: "pdf" | "zip" | "doc" | "link";
}

const resourceTypeBadgeVariant: Record<ResourceItem["type"], NonNullable<BadgeProps["variant"]>> = {
  pdf: "destructive",
  zip: "warning",
  doc: "default",
  link: "accent",
};

const StudentResourcesPage = () => {
  const { isLoading, enrollments, courseById } = useStudentPortal();
  const [query, setQuery] = useState("");
  const wordOfTheDay = useMemo(() => getWordOfTheDay(), []);
  const didYouKnow = useMemo(() => getDidYouKnowOfTheWeek(), []);

  const resources = useMemo<ResourceItem[]>(() => {
    const rows: ResourceItem[] = [];

    enrollments.forEach((enrollment) => {
      const hasAccess =
        enrollment.accessStatus === "free" ||
        enrollment.accessStatus === "approved";
      if (!hasAccess) return;

      const course = courseById[enrollment.courseId];
      if (!course) return;

      course.lessons.forEach((lesson) => {
        lesson.resourceDownloads.forEach((resource) => {
          rows.push({
            id: resource.id,
            courseTitle: course.title,
            lessonTitle: lesson.title,
            title: resource.title,
            url: resource.url,
            type: resource.type,
          });
        });
      });
    });

    return rows;
  }, [courseById, enrollments]);

  const filteredResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return resources;

    return resources.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.courseTitle.toLowerCase().includes(normalized) ||
        item.lessonTitle.toLowerCase().includes(normalized)
      );
    });
  }, [query, resources]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Learning Resources</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access downloadable files and reference links attached to your lessons.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
              <BookOpenText className="h-4 w-4" />
              Word of the Day
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{wordOfTheDay.term}</p>
            <p className="mt-2 text-sm text-muted-foreground">{wordOfTheDay.definition}</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Lightbulb className="h-4 w-4" />
              Did You Know?
            </div>
            <p className="mt-3 text-sm text-foreground">{didYouKnow}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Resource Library</h2>
              <div className="relative md:w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading resources...</p>
            ) : filteredResources.length === 0 ? (
              <EmptyState image={noResourcesImage} title="No resources found for your courses yet" />
            ) : (
              <div className="space-y-3">
                {filteredResources.map((resource) => (
                  <div
                    key={`${resource.courseTitle}-${resource.lessonTitle}-${resource.id}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{resource.title}</p>
                      <Badge variant={resourceTypeBadgeVariant[resource.type]}>
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resource.courseTitle} • Lesson: {resource.lessonTitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted sm:w-auto"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </a>
                      <a
                        href={resource.url}
                        download
                        className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted sm:w-auto"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentResourcesPage;
