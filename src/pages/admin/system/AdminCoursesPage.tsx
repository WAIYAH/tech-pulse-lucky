import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import type {
  AdminCourseLessonInput,
  AdminCourseUpsertInput,
  CourseLevel,
  LmsCourse,
  LessonType,
} from "@/types/lms";

interface CourseFormState {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  price: number;
  isFree: boolean;
  imageUrl: string;
  instructor: string;
  learningOutcomesText: string;
  requirementsText: string;
  targetAudienceText: string;
  lessons: AdminCourseLessonInput[];
}

interface LessonDraft {
  title: string;
  lessonType: LessonType;
  content: string;
  videoUrl: string;
}

const createEmptyForm = (): CourseFormState => ({
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "",
  level: "Beginner",
  duration: "",
  price: 0,
  isFree: true,
  imageUrl: "/placeholder.svg",
  instructor: "Lucky Nakola",
  learningOutcomesText: "",
  requirementsText: "",
  targetAudienceText: "",
  lessons: [],
});

const createEmptyLessonDraft = (): LessonDraft => ({
  title: "",
  lessonType: "text",
  content: "",
  videoUrl: "",
});

const toLines = (items: string[]) => items.join("\n");
const fromLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const AdminCoursesPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>(createEmptyForm());
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(createEmptyLessonDraft());

  const loadCourses = async () => {
    setIsLoading(true);
    const rows = await lmsProvider.listCourses({ sortBy: "title" });
    setCourses(rows);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  const filteredCourses = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(normalized) ||
        course.category.toLowerCase().includes(normalized) ||
        course.slug.toLowerCase().includes(normalized),
    );
  }, [courses, search]);

  const startCreateMode = () => {
    setSelectedCourseId(null);
    setForm(createEmptyForm());
    setLessonDraft(createEmptyLessonDraft());
  };

  const startEditMode = (course: LmsCourse) => {
    setSelectedCourseId(course.id);
    setForm({
      id: course.id,
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      price: course.price,
      isFree: course.isFree,
      imageUrl: course.imageUrl,
      instructor: course.instructor,
      learningOutcomesText: toLines(course.learningOutcomes),
      requirementsText: toLines(course.requirements),
      targetAudienceText: toLines(course.targetAudience),
      lessons: course.lessons.map((lesson) => ({
        title: lesson.title,
        lessonType: lesson.lessonType,
        content: lesson.content,
        videoUrl: lesson.videoUrl ?? "",
      })),
    });
    setLessonDraft(createEmptyLessonDraft());
  };

  const addLesson = () => {
    if (!lessonDraft.title.trim() || !lessonDraft.content.trim()) {
      toast({
        title: "Lesson fields missing",
        description: "Add a lesson title and content before adding.",
        variant: "destructive",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: lessonDraft.title.trim(),
          lessonType: lessonDraft.lessonType,
          content: lessonDraft.content.trim(),
          videoUrl: lessonDraft.videoUrl.trim() || undefined,
        },
      ],
    }));
    setLessonDraft(createEmptyLessonDraft());
  };

  const removeLesson = (index: number) => {
    setForm((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, lessonIndex) => lessonIndex !== index),
    }));
  };

  const toUpsertInput = (): AdminCourseUpsertInput => {
    return {
      id: form.id,
      title: form.title.trim(),
      slug: form.slug.trim() || toSlug(form.title),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      level: form.level,
      duration: form.duration.trim(),
      price: form.isFree ? 0 : Number(form.price),
      isFree: form.isFree,
      imageUrl: form.imageUrl.trim() || "/placeholder.svg",
      instructor: form.instructor.trim() || "Lucky Nakola",
      learningOutcomes: fromLines(form.learningOutcomesText),
      requirements: fromLines(form.requirementsText),
      targetAudience: fromLines(form.targetAudienceText),
      lessons: form.lessons,
    };
  };

  const saveCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.shortDescription.trim() || !form.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Title, short description, and full description are required.",
        variant: "destructive",
      });
      return;
    }

    if (!form.category.trim() || !form.duration.trim()) {
      toast({
        title: "Required fields missing",
        description: "Category and duration are required.",
        variant: "destructive",
      });
      return;
    }

    if (form.lessons.length === 0) {
      toast({
        title: "Add lessons",
        description: "Courses must contain at least one lesson.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const input = toUpsertInput();
      if (selectedCourseId) {
        const updated = await lmsProvider.updateCourse(input);
        if (!updated) {
          throw new Error("Unable to update this course.");
        }
        toast({
          title: "Course updated",
          description: "Changes were saved successfully.",
        });
      } else {
        await lmsProvider.createCourse(input);
        toast({
          title: "Course created",
          description: "New course has been added to the catalog.",
        });
      }

      await loadCourses();
      startCreateMode();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save the course.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCourse = async (course: LmsCourse) => {
    const shouldDelete = window.confirm(
      `Delete "${course.title}"? This also removes linked enrollments and payments.`,
    );
    if (!shouldDelete) return;

    const removed = await lmsProvider.deleteCourse(course.id);
    if (!removed) {
      toast({
        title: "Delete failed",
        description: "Course could not be removed.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Course deleted",
      description: "The course has been removed from catalog.",
    });

    if (selectedCourseId === course.id) {
      startCreateMode();
    }
    await loadCourses();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Course Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Full CRUD controls for course catalog metadata, audience details, and lesson
          structures.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Course Catalog</h2>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search courses"
                  className="pl-9"
                />
              </div>
              <Button onClick={startCreateMode}>Create New Course</Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading courses...</p>
            ) : filteredCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No courses matched your search.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{course.title}</p>
                      <Badge variant={course.isFree ? "secondary" : "default"}>
                        {course.isFree ? "Free" : "Paid"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {course.category} • {course.level} • {course.lessonsCount} lessons
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditMode(course)} className="w-full sm:w-auto">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCourse(course)} className="w-full sm:w-auto">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {selectedCourse ? `Editing: ${selectedCourse.title}` : "Create New Course"}
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={saveCourse}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={form.slug}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, slug: event.target.value }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setForm((prev) => ({ ...prev, slug: toSlug(prev.title) }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input
                  value={form.shortDescription}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      shortDescription: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={form.level}
                    onValueChange={(value: CourseFormState["level"]) =>
                      setForm((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={form.duration}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, duration: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input
                    value={form.instructor}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, instructor: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Price (KES)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, price: Number(event.target.value) }))
                    }
                    disabled={form.isFree}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select
                    value={form.isFree ? "free" : "paid"}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        isFree: value === "free",
                        price: value === "free" ? 0 : prev.price || 100,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Learning Outcomes (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={form.learningOutcomesText}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        learningOutcomesText: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={form.requirementsText}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, requirementsText: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={form.targetAudienceText}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        targetAudienceText: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                <h3 className="text-sm font-semibold">Lessons</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Lesson Title</Label>
                    <Input
                      value={lessonDraft.title}
                      onChange={(event) =>
                        setLessonDraft((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lesson Type</Label>
                    <Select
                      value={lessonDraft.lessonType}
                      onValueChange={(value: LessonType) =>
                        setLessonDraft((prev) => ({ ...prev, lessonType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lesson Content</Label>
                  <Textarea
                    rows={3}
                    value={lessonDraft.content}
                    onChange={(event) =>
                      setLessonDraft((prev) => ({ ...prev, content: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video URL (optional)</Label>
                  <Input
                    value={lessonDraft.videoUrl}
                    onChange={(event) =>
                      setLessonDraft((prev) => ({ ...prev, videoUrl: event.target.value }))
                    }
                  />
                </div>
                <Button type="button" variant="outline" onClick={addLesson} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>

                {form.lessons.length > 0 && (
                  <div className="space-y-2">
                    {form.lessons.map((lesson, index) => (
                      <div
                        key={`${lesson.title}-${index}`}
                        className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{lesson.lessonType}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving
                    ? "Saving..."
                    : selectedCourse
                      ? "Update Course"
                      : "Create Course"}
                </Button>
                <Button type="button" variant="outline" onClick={startCreateMode} className="w-full sm:w-auto">
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminCoursesPage;
