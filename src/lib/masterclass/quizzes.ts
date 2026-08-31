import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type {
  MasterclassQuiz,
  MasterclassQuizAttempt,
  MasterclassQuizOption,
  MasterclassQuizQuestionAdmin,
  MasterclassQuizQuestionPublic,
  MasterclassQuizSubmissionResult,
} from "@/types/masterclass";

interface QuizRow extends Record<string, unknown> {
  id: string;
  week_id: string;
  title: string;
  instructions: string;
  passing_score: number;
  time_limit_minutes?: number | null;
  max_attempts: number;
  randomize_questions: boolean;
}

interface QuizQuestionPublicRow extends Record<string, unknown> {
  id: string;
  quiz_id: string;
  question_order: number;
  question_type: MasterclassQuizQuestionPublic["questionType"];
  question_text: string;
  options: MasterclassQuizOption[];
  points: number;
}

/** Admin-only shape: includes correct_answer/explanation, unlike the public view row above. */
interface QuizQuestionAdminRow extends QuizQuestionPublicRow {
  correct_answer: string;
  explanation: string;
}

interface QuizAttemptRow extends Record<string, unknown> {
  id: string;
  quiz_id: string;
  user_id: string;
  cohort_id: string;
  attempt_number: number;
  answers: Record<string, string>;
  score: number;
  max_score: number;
  passed: boolean;
  started_at: string;
  submitted_at: string;
}

interface SubmitAttemptRpcResult extends Record<string, unknown> {
  attemptId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  attemptsRemaining: number;
  correctAnswers: Record<string, string>;
  explanations: Record<string, string>;
}

const mapQuizRow = (row: QuizRow): MasterclassQuiz => ({
  id: row.id,
  weekId: row.week_id,
  title: row.title,
  instructions: row.instructions,
  passingScore: row.passing_score,
  timeLimitMinutes: row.time_limit_minutes ?? undefined,
  maxAttempts: row.max_attempts,
  randomizeQuestions: row.randomize_questions,
});

const mapQuestionRow = (row: QuizQuestionPublicRow): MasterclassQuizQuestionPublic => ({
  id: row.id,
  quizId: row.quiz_id,
  questionOrder: row.question_order,
  questionType: row.question_type,
  questionText: row.question_text,
  options: row.options ?? [],
  points: row.points,
});

const mapQuestionAdminRow = (row: QuizQuestionAdminRow): MasterclassQuizQuestionAdmin => ({
  ...mapQuestionRow(row),
  correctAnswer: row.correct_answer,
  explanation: row.explanation,
});

const mapAttemptRow = (row: QuizAttemptRow): MasterclassQuizAttempt => ({
  id: row.id,
  quizId: row.quiz_id,
  userId: row.user_id,
  cohortId: row.cohort_id,
  attemptNumber: row.attempt_number,
  answers: row.answers ?? {},
  score: Number(row.score),
  maxScore: Number(row.max_score),
  passed: row.passed,
  startedAt: row.started_at,
  submittedAt: row.submitted_at,
});

export const readMasterclassQuizForWeek = (weekId: string): Promise<MasterclassQuiz | null> => {
  return withMasterclassFallback(
    "readMasterclassQuizForWeek",
    async () => {
      const { data, error } = await supabase
        .from<QuizRow>("masterclass_quizzes")
        .select("*")
        .eq("week_id", weekId)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load this week quiz.");
      return data ? mapQuizRow(data) : null;
    },
    () => null,
  );
};

/**
 * Reads questions through masterclass_quiz_questions_public, which never exposes
 * correct_answer/explanation. The base table has no student SELECT policy at all.
 */
export const readMasterclassQuizQuestions = (quizId: string): Promise<MasterclassQuizQuestionPublic[]> => {
  return withMasterclassFallback(
    "readMasterclassQuizQuestions",
    async () => {
      const { data, error } = await supabase
        .from<QuizQuestionPublicRow>("masterclass_quiz_questions_public")
        .select("*")
        .eq("quiz_id", quizId)
        .order("question_order", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load quiz questions.");
      return (data ?? []).map(mapQuestionRow);
    },
    () => [],
  );
};

export const readMasterclassQuizAttempts = (
  quizId: string,
  userId: string,
): Promise<MasterclassQuizAttempt[]> => {
  return withMasterclassFallback(
    "readMasterclassQuizAttempts",
    async () => {
      const { data, error } = await supabase
        .from<QuizAttemptRow>("masterclass_quiz_attempts")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("user_id", userId)
        .order("attempt_number", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load quiz attempts.");
      return (data ?? []).map(mapAttemptRow);
    },
    () => [],
  );
};

/**
 * Grading happens entirely server-side via a SECURITY DEFINER RPC that independently
 * re-verifies enrollment, enforces max attempts, and only then reveals correct answers
 * and explanations in its response. This function has no fallback: quiz submission
 * requires a live Supabase connection by design (grading cannot happen client-side
 * without shipping answers to the browser).
 */
export const submitMasterclassQuizAttempt = async (
  quizId: string,
  answers: Record<string, string>,
): Promise<MasterclassQuizSubmissionResult> => {
  const { data, error } = await supabase.rpc<SubmitAttemptRpcResult>("submit_masterclass_quiz_attempt", {
    p_quiz_id: quizId,
    p_answers: answers,
  });

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to submit this quiz attempt.");
  }

  return {
    attemptId: data.attemptId,
    score: Number(data.score),
    passed: data.passed,
    attemptNumber: data.attemptNumber,
    attemptsRemaining: data.attemptsRemaining,
    correctAnswers: data.correctAnswers ?? {},
    explanations: data.explanations ?? {},
  };
};

// ---------------------------------------------------------------------------
// Admin-only reads/writes (enforced by RLS). No fallback: curriculum authoring
// requires a live Supabase connection. Reads the base table directly (never
// the public view), which is safe only because RLS restricts that table to
// admins in the first place.
// ---------------------------------------------------------------------------

export const readMasterclassQuizQuestionsAdmin = (quizId: string): Promise<MasterclassQuizQuestionAdmin[]> => {
  return withMasterclassFallback(
    "readMasterclassQuizQuestionsAdmin",
    async () => {
      const { data, error } = await supabase
        .from<QuizQuestionAdminRow>("masterclass_quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("question_order", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load quiz questions.");
      return (data ?? []).map(mapQuestionAdminRow);
    },
    () => [],
  );
};

export interface QuizQuestionInput {
  quizId: string;
  questionOrder: number;
  questionType: MasterclassQuizQuestionAdmin["questionType"];
  questionText: string;
  options: MasterclassQuizOption[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export const createMasterclassQuizQuestion = async (
  input: QuizQuestionInput,
): Promise<MasterclassQuizQuestionAdmin> => {
  const { data, error } = await supabase
    .from<QuizQuestionAdminRow>("masterclass_quiz_questions")
    .insert({
      quiz_id: input.quizId,
      question_order: input.questionOrder,
      question_type: input.questionType,
      question_text: input.questionText,
      options: input.options,
      correct_answer: input.correctAnswer,
      explanation: input.explanation,
      points: input.points,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this question.");
  emitMasterclassExperienceEvent();
  return mapQuestionAdminRow(data);
};

export const updateMasterclassQuizQuestion = async (
  questionId: string,
  input: Partial<Omit<QuizQuestionInput, "quizId">>,
): Promise<MasterclassQuizQuestionAdmin> => {
  const payload: Record<string, unknown> = {};
  if (input.questionOrder !== undefined) payload.question_order = input.questionOrder;
  if (input.questionType !== undefined) payload.question_type = input.questionType;
  if (input.questionText !== undefined) payload.question_text = input.questionText;
  if (input.options !== undefined) payload.options = input.options;
  if (input.correctAnswer !== undefined) payload.correct_answer = input.correctAnswer;
  if (input.explanation !== undefined) payload.explanation = input.explanation;
  if (input.points !== undefined) payload.points = input.points;

  const { data, error } = await supabase
    .from<QuizQuestionAdminRow>("masterclass_quiz_questions")
    .update(payload)
    .eq("id", questionId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this question.");
  emitMasterclassExperienceEvent();
  return mapQuestionAdminRow(data);
};

export const deleteMasterclassQuizQuestion = async (questionId: string): Promise<void> => {
  const { error } = await supabase.from("masterclass_quiz_questions").delete().eq("id", questionId);
  if (error) throw new Error(error.message ?? "Unable to delete this question.");
  emitMasterclassExperienceEvent();
};

export interface QuizMetaInput {
  title: string;
  instructions: string;
  passingScore: number;
  timeLimitMinutes: number | null;
  maxAttempts: number;
  randomizeQuestions: boolean;
}

export const createMasterclassQuiz = async (weekId: string, input: QuizMetaInput): Promise<MasterclassQuiz> => {
  const { data, error } = await supabase
    .from<QuizRow>("masterclass_quizzes")
    .insert({
      week_id: weekId,
      title: input.title,
      instructions: input.instructions,
      passing_score: input.passingScore,
      time_limit_minutes: input.timeLimitMinutes,
      max_attempts: input.maxAttempts,
      randomize_questions: input.randomizeQuestions,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this quiz.");
  emitMasterclassExperienceEvent();
  return mapQuizRow(data);
};

export const updateMasterclassQuiz = async (quizId: string, input: QuizMetaInput): Promise<MasterclassQuiz> => {
  const { data, error } = await supabase
    .from<QuizRow>("masterclass_quizzes")
    .update({
      title: input.title,
      instructions: input.instructions,
      passing_score: input.passingScore,
      time_limit_minutes: input.timeLimitMinutes,
      max_attempts: input.maxAttempts,
      randomize_questions: input.randomizeQuestions,
    })
    .eq("id", quizId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this quiz.");
  emitMasterclassExperienceEvent();
  return mapQuizRow(data);
};
