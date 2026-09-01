import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type {
  MasterclassFinalProjectStages,
  MasterclassLessonProgress,
  MasterclassWeek,
  MasterclassWeekAccess,
} from "@/types/masterclass";

interface LessonProgressRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  lesson_id: string;
  cohort_id: string;
  completed: boolean;
  completed_at?: string | null;
}

const mapLessonProgressRow = (row: LessonProgressRow): MasterclassLessonProgress => ({
  id: row.id,
  userId: row.user_id,
  lessonId: row.lesson_id,
  cohortId: row.cohort_id,
  completed: row.completed,
  completedAt: row.completed_at ?? undefined,
});

export const readMasterclassLessonProgress = (
  userId: string,
  cohortId: string,
): Promise<MasterclassLessonProgress[]> => {
  return withMasterclassFallback(
    "readMasterclassLessonProgress",
    async () => {
      const { data, error } = await supabase
        .from<LessonProgressRow>("masterclass_lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId);
      if (error) throw new Error(error.message ?? "Unable to load lesson progress.");
      return (data ?? []).map(mapLessonProgressRow);
    },
    () => [],
  );
};

export const markMasterclassLessonComplete = async (
  userId: string,
  lessonId: string,
  cohortId: string,
  completed = true,
): Promise<void> => {
  const existing = await supabase
    .from<LessonProgressRow>("masterclass_lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("cohort_id", cohortId)
    .maybeSingle();

  if (existing.error) {
    throw new Error(existing.error.message ?? "Unable to update lesson progress.");
  }

  const completedAt = completed ? new Date().toISOString() : null;

  if (existing.data) {
    const { error } = await supabase
      .from("masterclass_lesson_progress")
      .update({ completed, completed_at: completedAt })
      .eq("id", existing.data.id);
    if (error) throw new Error(error.message ?? "Unable to update lesson progress.");
  } else {
    const { error } = await supabase.from("masterclass_lesson_progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      cohort_id: cohortId,
      completed,
      completed_at: completedAt,
    });
    if (error) throw new Error(error.message ?? "Unable to save lesson progress.");
  }

  emitMasterclassExperienceEvent();
};

/**
 * Pure, framework-free weighting used identically by student and admin views (no automated
 * test runner exists in this repo, so this is written to be trivially eyeballable and
 * manually verified rather than unit-tested).
 */
export interface WeekProgressInput {
  weekNumber: number;
  completedLearningLessons: number;
  totalLearningLessons: number;
  practicalCompleted: boolean;
  hasPractical: boolean;
  quizScorePercent: number | null;
  hasQuiz: boolean;
  quizPassed: boolean;
  hasAssignment: boolean;
  assignmentSubmitted: boolean;
}

export const computeWeekLearningPercent = (input: WeekProgressInput): number => {
  if (input.totalLearningLessons === 0) return 0;
  return Math.round((input.completedLearningLessons / input.totalLearningLessons) * 100);
};

export const computeWeekPracticalPercent = (input: WeekProgressInput): number => {
  if (!input.hasPractical) return 100;
  return input.practicalCompleted ? 100 : 0;
};

/** Simple per-week display blend for "Week N: NN%" navigation badges (not the official course formula below). */
export const computeWeekOverallPercent = (input: WeekProgressInput): number => {
  const learning = computeWeekLearningPercent(input);
  const quiz = input.quizScorePercent ?? 0;
  const practical = computeWeekPracticalPercent(input);
  return Math.round(learning * 0.5 + quiz * 0.3 + practical * 0.2);
};

export const computeFinalProjectPercent = (stages: MasterclassFinalProjectStages): number => {
  const values = Object.values(stages);
  if (values.length === 0) return 0;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round(sum / values.length);
};

/**
 * The official course-completion formula from the program spec:
 * 60% weekly learning + 20% weekly quizzes + 10% practicals + 10% final capstone.
 */
export const computeOverallMasterclassProgress = (input: {
  weeks: WeekProgressInput[];
  finalProjectStages: MasterclassFinalProjectStages | null;
}): number => {
  const weekCount = input.weeks.length || 1;
  const avgLearning =
    input.weeks.reduce((sum, week) => sum + computeWeekLearningPercent(week), 0) / weekCount;
  const avgQuiz = input.weeks.reduce((sum, week) => sum + (week.quizScorePercent ?? 0), 0) / weekCount;
  const avgPractical =
    input.weeks.reduce((sum, week) => sum + computeWeekPracticalPercent(week), 0) / weekCount;
  const capstone = input.finalProjectStages ? computeFinalProjectPercent(input.finalProjectStages) : 0;

  const overall = avgLearning * 0.6 + avgQuiz * 0.2 + avgPractical * 0.1 + capstone * 0.1;
  return Math.round(Math.min(100, Math.max(0, overall)));
};

/**
 * "Finished the current week" for gating purposes — independent from the weighted display
 * percentage above. Each signal is skipped if that week has no lessons/quiz/assignment at all,
 * so a week isn't permanently unfinishable because a section hasn't been authored yet.
 */
export const isMasterclassWeekComplete = (input: WeekProgressInput): boolean => {
  const learningDone =
    input.totalLearningLessons === 0 || input.completedLearningLessons === input.totalLearningLessons;
  const practicalDone = !input.hasPractical || input.practicalCompleted;
  const quizDone = !input.hasQuiz || input.quizPassed;
  const assignmentDone = !input.hasAssignment || input.assignmentSubmitted;
  return learningDone && practicalDone && quizDone && assignmentDone;
};

/** Week N unlocks (cohortStartDate + (N-1) weeks) — a simple weekly cadence from the cohort start. */
export const computeMasterclassWeekUnlockDate = (cohortStartDate: string, weekNumber: number): string => {
  const start = new Date(cohortStartDate);
  start.setUTCDate(start.getUTCDate() + (weekNumber - 1) * 7);
  return start.toISOString();
};

/**
 * A week is unlocked only when both its scheduled date has arrived AND the previous week is
 * complete (week 1 has no previous-week gate, but is still date-gated by the cohort's own start
 * date — the course does not open early).
 */
export const buildMasterclassWeekAccessMap = (
  weeks: MasterclassWeek[],
  weekProgress: Record<number, WeekProgressInput>,
  cohortStartDate: string,
  now: Date = new Date(),
): Record<number, MasterclassWeekAccess> => {
  const sorted = [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  const map: Record<number, MasterclassWeekAccess> = {};
  let previousComplete = true;

  for (const week of sorted) {
    const unlockDate = computeMasterclassWeekUnlockDate(cohortStartDate, week.weekNumber);
    const isDateReached = now.getTime() >= new Date(unlockDate).getTime();
    const progress = weekProgress[week.weekNumber];
    const isComplete = progress ? isMasterclassWeekComplete(progress) : false;
    const isUnlocked = isDateReached && previousComplete;

    map[week.weekNumber] = {
      weekNumber: week.weekNumber,
      isComplete,
      unlockDate,
      isDateReached,
      isPreviousWeekComplete: previousComplete,
      isUnlocked,
      lockReason: isUnlocked ? null : !isDateReached ? "date" : "previous-week",
    };

    previousComplete = isComplete;
  }

  return map;
};
