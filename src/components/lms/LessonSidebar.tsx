import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LmsLesson } from "@/types/lms";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  lessons: LmsLesson[];
  selectedLessonId: string;
  completedLessonIds: Set<string>;
  onSelectLesson: (lessonId: string) => void;
}

const LessonSidebar = ({
  lessons,
  selectedLessonId,
  completedLessonIds,
  onSelectLesson,
}: LessonSidebarProps) => {
  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-bold">Course Lessons</h3>
      </div>
      <ScrollArea className="h-[420px]">
        <div className="p-3 space-y-2">
          {lessons.map((lesson) => {
            const isActive = lesson.id === selectedLessonId;
            const isComplete = completedLessonIds.has(lesson.id);

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium text-sm leading-snug">
                      {lesson.lessonOrder}. {lesson.title}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {lesson.lessonType}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LessonSidebar;

