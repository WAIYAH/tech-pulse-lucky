export type MasterclassCohortStatus = "upcoming" | "active" | "completed" | "archived";
export type MasterclassLessonType = "intro" | "concept" | "practical";
export type MasterclassQuestionType = "mcq" | "true_false" | "scenario";
export type MasterclassResourceType =
  | "pdf"
  | "doc"
  | "ppt"
  | "sheet"
  | "image"
  | "zip"
  | "code"
  | "audio"
  | "link"
  | "github"
  | "video";
export type MasterclassResourceVisibility = "public" | "enrolled";

/**
 * Where a resource sits in the weekly learning journey. Mirrors the folder
 * layout under resources/week-NN/<category>/ so a file on disk and its database
 * row can always be traced to each other.
 */
export type MasterclassResourceCategory =
  | "notes"
  | "presentation"
  | "practical"
  | "assignment"
  | "quiz"
  | "reference"
  | "project"
  | "template"
  | "recording"
  | "link";
export type MasterclassFinalProjectStatus = "not_started" | "in_progress" | "submitted" | "approved";
export type MasterclassCertificateStatus = "not_eligible" | "eligible" | "issued" | "revoked";
export type MasterclassAttendanceStatus = "present" | "absent";
export type MasterclassAssignmentSubmissionStatus = "not_started" | "submitted";
export type MasterclassWeekLockReason = "date" | "previous-week" | null;

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
  category: MasterclassResourceCategory;
  /** External URL. Empty for stored files, which are served via a signed URL instead. */
  url: string;
  /** Object key inside the private `course-resources` bucket. Absent for link resources. */
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  visibility: MasterclassResourceVisibility;
  resourceOrder: number;
  isLiveLink: boolean;
  isRequired: boolean;
  isPublished: boolean;
  learningObjective: string;
  version: number;
  /** The earlier resource this one replaces, when content has been re-issued. */
  supersedesId?: string;
}

/** A stored file plus the metadata needed to validate and name it. */
export interface MasterclassResourceUpload {
  file: File;
  weekNumber?: number;
  category: MasterclassResourceCategory;
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

export interface MasterclassAssignment {
  id: string;
  weekId: string;
  title: string;
  brief: string;
  requirements: string;
  submissionInstructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterclassAssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  cohortId: string;
  githubUrl?: string;
  notes?: string;
  status: MasterclassAssignmentSubmissionStatus;
  adminFeedback?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Gating result for a single week — whether it's currently open to the student. */
export interface MasterclassWeekAccess {
  weekNumber: number;
  isComplete: boolean;
  unlockDate: string;
  isDateReached: boolean;
  isPreviousWeekComplete: boolean;
  isUnlocked: boolean;
  lockReason: MasterclassWeekLockReason;
}
