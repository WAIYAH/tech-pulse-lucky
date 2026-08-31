export type MasterclassCohortStatus = "upcoming" | "active" | "completed" | "archived";
export type MasterclassLessonType = "intro" | "concept" | "practical";
export type MasterclassQuestionType = "mcq" | "true_false" | "scenario";
export type MasterclassResourceType =
  | "pdf"
  | "doc"
  | "ppt"
  | "image"
  | "zip"
  | "code"
  | "link"
  | "github"
  | "video";
export type MasterclassResourceVisibility = "public" | "enrolled";
export type MasterclassFinalProjectStatus = "not_started" | "in_progress" | "submitted" | "approved";
export type MasterclassCertificateStatus = "not_eligible" | "eligible" | "issued" | "revoked";
export type MasterclassAttendanceStatus = "present" | "absent";

export interface MasterclassProgram {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  philosophy: string;
  technologies: string[];
  totalWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassCohort {
  id: string;
  programId: string;
  courseId: string;
  courseSlug?: string;
  cohortLabel: string;
  startDate: string;
  endDate: string;
  status: MasterclassCohortStatus;
  maxSeats?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassWeek {
  id: string;
  programId: string;
  weekNumber: number;
  title: string;
  theme: string;
  learningObjectives: string[];
  topics: string[];
  estimatedStudyTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassLesson {
  id: string;
  weekId: string;
  title: string;
  lessonOrder: number;
  lessonType: MasterclassLessonType;
  content: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassTerm {
  id: string;
  weekId: string;
  term: string;
  definition: string;
  simpleExplanation: string;
  example: string;
  relatedConcept: string;
  termOrder: number;
}

export interface MasterclassQuiz {
  id: string;
  weekId: string;
  title: string;
  instructions: string;
  passingScore: number;
  timeLimitMinutes?: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
}

export interface MasterclassQuizOption {
  id: string;
  text: string;
}

export interface MasterclassQuizQuestionPublic {
  id: string;
  quizId: string;
  questionOrder: number;
  questionType: MasterclassQuestionType;
  questionText: string;
  options: MasterclassQuizOption[];
  points: number;
}

/** Admin-only view: includes the answer key, never sent to students pre-submission. */
export interface MasterclassQuizQuestionAdmin extends MasterclassQuizQuestionPublic {
  correctAnswer: string;
  explanation: string;
}

export interface MasterclassQuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  cohortId: string;
  attemptNumber: number;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
}

export interface MasterclassQuizSubmissionResult {
  attemptId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  attemptsRemaining: number;
  correctAnswers: Record<string, string>;
  explanations: Record<string, string>;
}

export interface MasterclassResource {
  id: string;
  programId: string;
  weekId?: string;
  title: string;
  description: string;
  resourceType: MasterclassResourceType;
  url: string;
  visibility: MasterclassResourceVisibility;
  resourceOrder: number;
}

export interface MasterclassLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  cohortId: string;
  completed: boolean;
  completedAt?: string;
}

export interface MasterclassFinalProjectStages {
  proposal: number;
  requirements: number;
  ui: number;
  database: number;
  development: number;
  testing: number;
  deployment: number;
}

export interface MasterclassFinalProject {
  id: string;
  userId: string;
  cohortId: string;
  projectType: string;
  problemStatement: string;
  targetUsers: string;
  requirements: string;
  githubUrl?: string;
  deploymentUrl?: string;
  stages: MasterclassFinalProjectStages;
  status: MasterclassFinalProjectStatus;
  adminFeedback?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassCertificate {
  id: string;
  userId: string;
  cohortId: string;
  certificateCode: string;
  status: MasterclassCertificateStatus;
  certificateUrl?: string;
  issuedAt?: string;
}

export interface MasterclassAnnouncement {
  id: string;
  cohortId: string;
  weekId?: string;
  targetUserId?: string;
  title: string;
  message: string;
  isPinned: boolean;
  publishedAt: string;
  createdBy?: string;
}

export interface MasterclassAttendanceRecord {
  id: string;
  cohortId: string;
  weekId?: string;
  userId: string;
  sessionDate: string;
  sessionLabel: string;
  status: MasterclassAttendanceStatus;
  notes?: string;
}

export interface MasterclassWeekCompletion {
  weekNumber: number;
  lessonCompletionPercent: number;
  quizScorePercent: number;
  practicalCompletePercent: number;
  capstonePercent: number;
  weekPercent: number;
}
