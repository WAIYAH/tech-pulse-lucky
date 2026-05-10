import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const toLines = (values: string[]) => values.join("\n");
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

const AdminCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>(createEmptyForm());
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>({
    title: "",
    lessonType: "text",
    content: "",
    videoUrl: "",
  });

  const loadCourses = async () => {
    setLoading(true);
    const rows = await lmsProvider.listCourses({ sortBy: "title" });
    setCourses(rows);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  const startCreateMode = () => {
    setSelectedCourseId(null);
    setForm(createEmptyForm());
    setLessonDraft({
      title: "",
      lessonType: "text",
      content: "",
      videoUrl: "",
    });
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
  };

  const handleAddLesson = () => {
    if (!lessonDraft.title.trim() || !lessonDraft.content.trim()) {
      toast({
        title: "Missing Lesson Data",
        description: "Add lesson title and content before adding.",
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

    setLessonDraft({
      title: "",
      lessonType: "text",
      content: "",
      videoUrl: "",
    });
  };

  const handleRemoveLesson = (index: number) => {
    setForm((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, lessonIndex) => lessonIndex !== index),
    }));
  };

  const toUpsertInput = (): AdminCourseUpsertInput => ({
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
  });

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.shortDescription.trim() || !form.description.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Title, short description, and full description are required.",
        variant: "destructive",
      });
      return;
    }

    if (form.lessons.length === 0) {
      toast({
        title: "Add Lessons",
        description: "Please add at least one lesson to this course.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const input = toUpsertInput();
      if (selectedCourseId) {
        const updated = await lmsProvider.updateCourse(input);
        if (!updated) {
          throw new Error("Course update failed.");
        }
        toast({
          title: "Course Updated",
          description: "Course changes have been saved.",
        });
      } else {
        await lmsProvider.createCourse(input);
        toast({
          title: "Course Created",
          description: "New course has been added successfully.",
        });
      }

      await loadCourses();
      startCreateMode();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save course.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course: LmsCourse) => {
    const shouldDelete = window.confirm(
      `Delete "${course.title}"? This will remove associated enrollment/payment progress data for this course.`,
    );
    if (!shouldDelete) return;

    const removed = await lmsProvider.deleteCourse(course.id);
    if (!removed) {
      toast({
        title: "Delete Failed",
        description: "Course could not be deleted.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Course Deleted",
      description: "Course has been removed.",
    });

    if (selectedCourseId === course.id) {
      startCreateMode();
    }
    await loadCourses();
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between gap-3 flex-wrap mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Course Management</h1>
              <p className="text-muted-foreground mt-2">
                Create, edit, delete courses and define lesson structures.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin">Back to Admin</Link>
              </Button>
              <Button onClick={startCreateMode}>Create New Course</Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <h2 className="text-xl font-bold">Existing Courses</h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading courses...</p>
                ) : courses.length === 0 ? (
                  <p className="text-muted-foreground">No courses available.</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-border rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm">{course.title}</p>
                          <Badge variant={course.isFree ? "secondary" : "default"}>
                            {course.isFree ? "free" : "paid"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {course.category} • {course.level} • {course.lessonsCount} lessons
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditMode(course)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(course)}
                          >
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
                <h2 className="text-xl font-bold">
                  {selectedCourse ? "Edit Course" : "Create Course"}
                </h2>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSave}>
                  <div className="grid md:grid-cols-2 gap-4">
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
                      <div className="flex gap-2">
                        <Input
                          value={form.slug}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, slug: event.target.value }))
                          }
                          placeholder="auto-generated-if-empty"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, slug: toSlug(prev.title) }))
                          }
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

                  <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price (KES)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            price: Number(event.target.value),
                          }))
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

                  <div className="grid md:grid-cols-3 gap-4">
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
                          setForm((prev) => ({
                            ...prev,
                            requirementsText: event.target.value,
                          }))
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

                  <div className="space-y-3 border border-border rounded-xl p-4">
                    <h3 className="font-semibold">Lessons</h3>
                    <div className="grid md:grid-cols-2 gap-3">
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
                      <Label>Video URL (Optional)</Label>
                      <Input
                        value={lessonDraft.videoUrl}
                        onChange={(event) =>
                          setLessonDraft((prev) => ({ ...prev, videoUrl: event.target.value }))
                        }
                      />
                    </div>

                    <Button type="button" variant="outline" onClick={handleAddLesson}>
                      <Plus size={16} className="mr-2" />
                      Add Lesson
                    </Button>

                    {form.lessons.length > 0 && (
                      <div className="space-y-2">
                        {form.lessons.map((lesson, index) => (
                          <div
                            key={`${lesson.title}-${index}`}
                            className="border border-border rounded-lg p-3 flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.lessonType}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLesson(index)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : selectedCourse ? "Update Course" : "Create Course"}
                    </Button>
                    <Button type="button" variant="outline" onClick={startCreateMode}>
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCourses;

