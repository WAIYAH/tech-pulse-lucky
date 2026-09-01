import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { markMasterclassLessonComplete, syncMasterclassEnrollmentProgress } from "@/lib/masterclass";
import { lessonTypeBadgeVariant } from "@/lib/statusBadges";
import { useMasterclassStudent } from "./MasterclassStudentProvider";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";
import { useStudentPortal } from "../StudentPortalContext";

const StudentMasterclassLessonsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cohort, weeks } = useMasterclassStudent();
  const { lessons, lessonProgress, isLoading, refreshWeekData } = useStudentMasterclassWeek();
  const { refresh: refreshStudentPortal } = useStudentPortal();

  const toggleLesson = async (lessonId: string, completed: boolean) => {
    if (!user || !cohort) return;
    try {
      await markMasterclassLessonComplete(user.id, lessonId, cohort.id, completed);
      await syncMasterclassEnrollmentProgress({
        userId: user.id,
        courseId: cohort.courseId,
        cohortId: cohort.id,
        weeks,
      });
      await refreshWeekData();
      await refreshStudentPortal();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons published for this week yet.</p>
        ) : (
          lessons.map((lesson) => {
            const isComplete = lessonProgress.some((row) => row.lessonId === lesson.id && row.completed);
            return (
              <div key={lesson.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lessonTypeBadgeVariant[lesson.lessonType]} className="capitalize">
                        {lesson.lessonType}
                      </Badge>
                      <p className="font-semibold">{lesson.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{lesson.content}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isComplete ? "success" : "outline"}
                    onClick={() => void toggleLesson(lesson.id, !isComplete)}
                  >
                    {isComplete ? (
                      <>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle className="mr-1 h-4 w-4" /> Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default StudentMasterclassLessonsPage;
