import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  readMasterclassAssignmentForWeek,
  readMasterclassAssignmentSubmission,
  readMasterclassLessonProgress,
  readMasterclassLessons,
  readMasterclassQuizAttempts,
  readMasterclassQuizForWeek,
  readMasterclassQuizQuestions,
  readMasterclassResources,
  readMasterclassTerminology,
} from "@/lib/masterclass";
import type {
  MasterclassAssignment,
  MasterclassAssignmentSubmission,
  MasterclassLesson,
  MasterclassLessonProgress,
  MasterclassQuiz,
  MasterclassQuizAttempt,
  MasterclassQuizQuestionPublic,
  MasterclassResource,
  MasterclassTerm,
  MasterclassWeek,
} from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";

interface StudentMasterclassWeekContextValue {
  week: MasterclassWeek;
  lessons: MasterclassLesson[];
  lessonProgress: MasterclassLessonProgress[];
  terms: MasterclassTerm[];
  liveLinkResource: MasterclassResource | null;
  resources: MasterclassResource[];
  quiz: MasterclassQuiz | null;
  questions: MasterclassQuizQuestionPublic[];
  attempts: MasterclassQuizAttempt[];
  assignment: MasterclassAssignment | null;
  assignmentSubmission: MasterclassAssignmentSubmission | null;
  isLoading: boolean;
  refreshWeekData: () => Promise<void>;
}

const StudentMasterclassWeekContext = createContext<StudentMasterclassWeekContextValue | undefined>(undefined);

export const StudentMasterclassWeekProvider = ({
  week,
  children,
}: {
  week: MasterclassWeek;
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const { program, cohort, refreshProgress } = useMasterclassStudent();

  const [lessons, setLessons] = useState<MasterclassLesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<MasterclassLessonProgress[]>([]);
  const [terms, setTerms] = useState<MasterclassTerm[]>([]);
  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [quiz, setQuiz] = useState<MasterclassQuiz | null>(null);
  const [questions, setQuestions] = useState<MasterclassQuizQuestionPublic[]>([]);
  const [attempts, setAttempts] = useState<MasterclassQuizAttempt[]>([]);
  const [assignment, setAssignment] = useState<MasterclassAssignment | null>(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState<MasterclassAssignmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeekData = useCallback(async () => {
    if (!user || !cohort) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const [lessonRows, termRows, resourceRows, quizRow, progressRows, assignmentRow] = await Promise.all([
      readMasterclassLessons(week.id),
      readMasterclassTerminology(week.id),
      readMasterclassResources(program?.id ?? "", week.id),
      readMasterclassQuizForWeek(week.id),
      readMasterclassLessonProgress(user.id, cohort.id),
      readMasterclassAssignmentForWeek(week.id),
    ]);

    setLessons(lessonRows);
    setTerms(termRows);
    setResources(resourceRows);
    setQuiz(quizRow);
    setLessonProgress(progressRows);
    setAssignment(assignmentRow);

    if (quizRow) {
      const [questionRows, attemptRows] = await Promise.all([
        readMasterclassQuizQuestions(quizRow.id),
        readMasterclassQuizAttempts(quizRow.id, user.id),
      ]);
      setQuestions(questionRows);
      setAttempts(attemptRows);
    } else {
      setQuestions([]);
      setAttempts([]);
    }

    if (assignmentRow) {
      const submission = await readMasterclassAssignmentSubmission(user.id, cohort.id, assignmentRow.id);
      setAssignmentSubmission(submission);
    } else {
      setAssignmentSubmission(null);
    }

    setIsLoading(false);
  }, [user, cohort, program?.id, week.id]);

  useEffect(() => {
    void loadWeekData();
  }, [loadWeekData]);

  const refreshWeekData = useCallback(async () => {
    await loadWeekData();
    await refreshProgress();
  }, [loadWeekData, refreshProgress]);

  const liveLinkResource = useMemo(
    () => resources.find((resource) => resource.isLiveLink) ?? null,
    [resources],
  );
  const nonLiveResources = useMemo(() => resources.filter((resource) => !resource.isLiveLink), [resources]);

  const value = useMemo<StudentMasterclassWeekContextValue>(
    () => ({
      week,
      lessons,
      lessonProgress,
      terms,
      liveLinkResource,
      resources: nonLiveResources,
      quiz,
      questions,
      attempts,
      assignment,
      assignmentSubmission,
      isLoading,
      refreshWeekData,
    }),
    [
      week,
      lessons,
      lessonProgress,
      terms,
      liveLinkResource,
      nonLiveResources,
      quiz,
      questions,
      attempts,
      assignment,
      assignmentSubmission,
      isLoading,
      refreshWeekData,
    ],
  );

  return <StudentMasterclassWeekContext.Provider value={value}>{children}</StudentMasterclassWeekContext.Provider>;
};

export const useStudentMasterclassWeek = (): StudentMasterclassWeekContextValue => {
  const context = useContext(StudentMasterclassWeekContext);
  if (!context) {
    throw new Error("useStudentMasterclassWeek must be used within a StudentMasterclassWeekProvider");
  }
  return context;
};
