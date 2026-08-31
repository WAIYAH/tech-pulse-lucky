import { useMemo, useState } from "react";
import { Download, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStudentPortal } from "./StudentPortalContext";

interface ResourceItem {
  id: string;
  courseTitle: string;
  lessonTitle: string;
  title: string;
  url: string;
  type: "pdf" | "zip" | "doc" | "link";
}

const StudentResourcesPage = () => {
  const { isLoading, enrollments, courseById } = useStudentPortal();
  const [query, setQuery] = useState("");

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
              <p className="text-sm text-muted-foreground">
                No resources found for your courses yet.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredResources.map((resource) => (
                  <div
                    key={`${resource.courseTitle}-${resource.lessonTitle}-${resource.id}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{resource.title}</p>
                      <Badge variant="secondary">{resource.type.toUpperCase()}</Badge>
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
