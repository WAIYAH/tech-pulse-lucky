import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMasterclassLesson,
  deleteMasterclassLesson,
  readMasterclassLessons,
  updateMasterclassLesson,
} from "@/lib/masterclass";
import type { MasterclassLesson, MasterclassLessonType, MasterclassWeek } from "@/types/masterclass";

const lessonTypes: MasterclassLessonType[] = ["intro", "concept", "practical"];

interface LessonFormState {
  id?: string;
  title: string;
  lessonOrder: number;
  lessonType: MasterclassLessonType;
  content: string;
  videoUrl: string;
}

const emptyForm = (nextOrder: number): LessonFormState => ({
  title: "",
  lessonOrder: nextOrder,
  lessonType: "concept",
  content: "",
  videoUrl: "",
});

const AdminMasterclassLessonsPanel = ({ week }: { week: MasterclassWeek }) => {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<MasterclassLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<LessonFormState>(emptyForm(1));
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const rows = await readMasterclassLessons(week.id);
    setLessons(rows);
    setForm(emptyForm(rows.length + 1));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const startEdit = (lesson: MasterclassLesson) => {
    setForm({
      id: lesson.id,
      title: lesson.title,
      lessonOrder: lesson.lessonOrder,
      lessonType: lesson.lessonType,
      content: lesson.content,
      videoUrl: lesson.videoUrl ?? "",
    });
  };

  const resetForm = () => setForm(emptyForm(lessons.length + 1));

  const saveLesson = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Missing fields", description: "Title and content are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      if (form.id) {
        await updateMasterclassLesson(form.id, {
          title: form.title.trim(),
          lessonOrder: form.lessonOrder,
          lessonType: form.lessonType,
          content: form.content.trim(),
          videoUrl: form.videoUrl.trim(),
        });
        toast({ title: "Lesson updated" });
      } else {
        await createMasterclassLesson({
          weekId: week.id,
          title: form.title.trim(),
          lessonOrder: form.lessonOrder,
          lessonType: form.lessonType,
          content: form.content.trim(),
          videoUrl: form.videoUrl.trim() || undefined,
        });
        toast({ title: "Lesson created" });
      }
      resetForm();
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeLesson = async (lesson: MasterclassLesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    try {
      await deleteMasterclassLesson(lesson.id);
      toast({ title: "Lesson deleted" });
      await load();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          Lessons &mdash; Week {week.weekNumber}: {week.title}
        </h3>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lessons yet.</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="capitalize">
                    {lesson.lessonType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">#{lesson.lessonOrder}</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{lesson.title}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(lesson)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => void removeLesson(lesson)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min={1}
                value={form.lessonOrder}
                onChange={(event) => setForm((prev) => ({ ...prev, lessonOrder: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.lessonType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, lessonType: value as MasterclassLessonType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Video URL (optional)</Label>
              <Input value={form.videoUrl} onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Textarea
              rows={5}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => void saveLesson()} disabled={isSaving}>
              {form.id ? (isSaving ? "Saving..." : "Save Changes") : isSaving ? "Creating..." : "Add Lesson"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassLessonsPanel;
