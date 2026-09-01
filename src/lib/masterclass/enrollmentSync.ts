import { supabase } from "./client";
import { readMasterclassLessons } from "./curriculum";
import { readMasterclassFinalProject } from "./finalProjects";
import {
  computeOverallMasterclassProgress,
  readMasterclassLessonProgress,
  type WeekProgressInput,
} from "./progress";
import { readMasterclassQuizAttempts, readMasterclassQuizForWeek } from "./quizzes";
import type { MasterclassLessonProgress, MasterclassWeek } from "@/types/masterclass";

/** Shared by the Overview page (display) and syncMasterclassEnrollmentProgress (persistence). */
export const buildMasterclassWeekProgressInputs = async (
  weeks: MasterclassWeek[],
  userId: string,
  lessonProgressRows: MasterclassLessonProgress[],
): Promise<WeekProgressInput[]> => {
  return Promise.all(
    weeks.map(async (week) => {
      const [lessons, quiz] = await Promise.all([
        readMasterclassLessons(week.id),
        readMasterclassQuizForWeek(week.id),
      ]);

      const learningLessons = lessons.filter((lesson) => lesson.lessonType !== "practical");
      const practicalLesson = lessons.find((lesson) => lesson.lessonType === "practical");
      const completedLearning = learningLessons.filter((lesson) =>
        lessonProgressRows.some((row) => row.lessonId === lesson.id && row.completed),
      ).length;
      const practicalCompleted = practicalLesson
        ? lessonProgressRows.some((row) => row.lessonId === practicalLesson.id && row.completed)
        : false;

      let quizScorePercent: number | null = null;
      if (quiz) {
        const attempts = await readMasterclassQuizAttempts(quiz.id, userId);
        if (attempts.length > 0) {
          quizScorePercent = Math.max(...attempts.map((attempt) => attempt.score));
        }
      }

      return {
        weekNumber: week.weekNumber,
        completedLearningLessons: completedLearning,
        totalLearningLessons: learningLessons.length,
        practicalCompleted,
        hasPractical: Boolean(practicalLesson),
        quizScorePercent,
      };
    }),
  );
};

/**
 * Recomputes the official course-completion percentage (60% weekly learning + 20% quizzes +
 * 10% practicals + 10% capstone) and writes it to enrollments.progress, so Overview/Progress/My
 * Courses — which just read enrollment.progress — match what the masterclass pages compute live.
 * Mirrors the same enrollments.progress write markLessonComplete already does for regular courses
 * (src/lib/lms/supabaseProvider.ts). Best-effort: swallows its own errors so a sync failure never
 * surfaces as a failure of the primary action (marking a lesson complete, submitting a quiz,
 * saving the project) that triggered it.
 */
export const syncMasterclassEnrollmentProgress = async (input: {
  userId: string;
  courseId: string;
  cohortId: string;
  weeks: MasterclassWeek[];
}): Promise<void> => {
  try {
    const { userId, courseId, cohortId, weeks } = input;
    if (weeks.length === 0) return;

    const lessonProgressRows = await readMasterclassLessonProgress(userId, cohortId);
    const weekInputs = await buildMasterclassWeekProgressInputs(weeks, userId, lessonProgressRows);
    const finalProjectRow = await readMasterclassFinalProject(userId, cohortId);
    const progress = computeOverallMasterclassProgress({
      weeks: weekInputs,
      finalProjectStages: finalProjectRow?.stages ?? null,
    });

    const { error } = await supabase
      .from("enrollments")
      .update({ progress, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("course_id", courseId);
    if (error) throw new Error(error.message ?? "Unable to sync masterclass progress.");
  } catch (error) {
    console.info("[Masterclass Sync] syncMasterclassEnrollmentProgress failed:", error);
  }
};
