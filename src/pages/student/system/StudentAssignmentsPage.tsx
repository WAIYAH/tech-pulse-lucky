import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ClipboardCheck, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/routes/routeConfig";
import { useStudentPortal } from "./StudentPortalContext";

interface AssignmentItem {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  instructions?: string;
  dueDateLabel: string;
  completed: boolean;
}

const StudentAssignmentsPage = () => {
  const { isLoading, enrollments, courseById, progressByCourseId } = useStudentPortal();

  const assignments = useMemo<AssignmentItem[]>(() => {
    const rows: AssignmentItem[] = [];

    enrollments.forEach((enrollment) => {
      const hasAccess =
        enrollment.accessStatus === "free" ||
        enrollment.accessStatus === "approved";
      if (!hasAccess) return;

      const course = courseById[enrollment.courseId];
      if (!course) return;

      const progressRows = progressByCourseId[enrollment.courseId] ?? [];
      const completedLessonIds = new Set(
        progressRows.filter((row) => row.completed).map((row) => row.lessonId),
      );

      course.lessons.forEach((lesson) => {
        if (lesson.lessonType !== "assignment" && !lesson.assignment) return;

        const dueInDays = lesson.assignment?.dueInDays ?? 7;
        const dueDate = new Date(enrollment.createdAt);
        dueDate.setDate(dueDate.getDate() + dueInDays);

        rows.push({
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          instructions: lesson.assignment?.instructions ?? lesson.content,
          dueDateLabel: dueDate.toLocaleDateString("en-KE"),
          completed: completedLessonIds.has(lesson.id),
        });
      });
    });

    return rows;
  }, [courseById, enrollments, progressByCourseId]);

  const pendingAssignments = assignments.filter((item) => !item.completed).length;
  const completedAssignments = assignments.filter((item) => item.completed).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Assignments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review practical tasks in your courses and track completion status.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Assignments</p>
            <p className="text-3xl font-semibold">{assignments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-semibold">{pendingAssignments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-semibold">{completedAssignments}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Assignment Tracker</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignment-type lessons found in your current enrollments.
              </p>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={`${assignment.courseId}-${assignment.lessonId}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{assignment.lessonTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.courseTitle}
                        </p>
                      </div>
                      <Badge variant={assignment.completed ? "secondary" : "outline"}>
                        {assignment.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {assignment.instructions}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Due: {assignment.dueDateLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                        {assignment.completed ? (
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        ) : (
                          <NotebookPen className="h-3.5 w-3.5" />
                        )}
                        {assignment.completed ? "Marked complete" : "Requires completion"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <Button size="sm" asChild className="w-full sm:w-auto">
                        <Link to={routes.student.learn(assignment.courseSlug)}>
                          Open Lesson
                        </Link>
                      </Button>
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

export default StudentAssignmentsPage;
