import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type { MasterclassAssignment, MasterclassAssignmentSubmission } from "@/types/masterclass";

interface AssignmentRow extends Record<string, unknown> {
  id: string;
  week_id: string;
  title: string;
  brief: string;
  requirements: string;
  submission_instructions: string;
  created_at: string;
  updated_at: string;
}

interface SubmissionRow extends Record<string, unknown> {
  id: string;
  assignment_id: string;
  user_id: string;
  cohort_id: string;
  github_url?: string | null;
  notes?: string | null;
  status: MasterclassAssignmentSubmission["status"];
  admin_feedback?: string | null;
  submitted_at?: string | null;
  created_at: string;
  updated_at: string;
}

const mapAssignmentRow = (row: AssignmentRow): MasterclassAssignment => ({
  id: row.id,
  weekId: row.week_id,
  title: row.title,
  brief: row.brief,
  requirements: row.requirements,
  submissionInstructions: row.submission_instructions,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSubmissionRow = (row: SubmissionRow): MasterclassAssignmentSubmission => ({
  id: row.id,
  assignmentId: row.assignment_id,
  userId: row.user_id,
  cohortId: row.cohort_id,
  githubUrl: row.github_url ?? undefined,
  notes: row.notes ?? undefined,
  status: row.status,
  adminFeedback: row.admin_feedback ?? undefined,
  submittedAt: row.submitted_at ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const readMasterclassAssignmentForWeek = (weekId: string): Promise<MasterclassAssignment | null> => {
  return withMasterclassFallback(
    "readMasterclassAssignmentForWeek",
    async () => {
      const { data, error } = await supabase
        .from<AssignmentRow>("masterclass_assignments")
        .select("*")
        .eq("week_id", weekId)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load this week's assignment.");
      return data ? mapAssignmentRow(data) : null;
    },
    () => null,
  );
};

export interface AssignmentMetaInput {
  title: string;
  brief: string;
  requirements: string;
  submissionInstructions: string;
}

export const createMasterclassAssignment = async (
  weekId: string,
  input: AssignmentMetaInput,
): Promise<MasterclassAssignment> => {
  const { data, error } = await supabase
    .from<AssignmentRow>("masterclass_assignments")
    .insert({
      week_id: weekId,
      title: input.title,
      brief: input.brief,
      requirements: input.requirements,
      submission_instructions: input.submissionInstructions,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this assignment.");
  emitMasterclassExperienceEvent();
  return mapAssignmentRow(data);
};

export const updateMasterclassAssignment = async (
  assignmentId: string,
  input: AssignmentMetaInput,
): Promise<MasterclassAssignment> => {
  const { data, error } = await supabase
    .from<AssignmentRow>("masterclass_assignments")
    .update({
      title: input.title,
      brief: input.brief,
      requirements: input.requirements,
      submission_instructions: input.submissionInstructions,
    })
    .eq("id", assignmentId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to update this assignment.");
  emitMasterclassExperienceEvent();
  return mapAssignmentRow(data);
};

/** Bulk read for a whole cohort — used by buildMasterclassWeekProgressInputs so it isn't N+1. */
export const readMasterclassAssignmentSubmissions = (
  userId: string,
  cohortId: string,
): Promise<MasterclassAssignmentSubmission[]> => {
  return withMasterclassFallback(
    "readMasterclassAssignmentSubmissions",
    async () => {
      const { data, error } = await supabase
        .from<SubmissionRow>("masterclass_assignment_submissions")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId);
      if (error) throw new Error(error.message ?? "Unable to load your assignment submissions.");
      return (data ?? []).map(mapSubmissionRow);
    },
    () => [],
  );
};

export const readMasterclassAssignmentSubmission = (
  userId: string,
  cohortId: string,
  assignmentId: string,
): Promise<MasterclassAssignmentSubmission | null> => {
  return withMasterclassFallback(
    "readMasterclassAssignmentSubmission",
    async () => {
      const { data, error } = await supabase
        .from<SubmissionRow>("masterclass_assignment_submissions")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId)
        .eq("assignment_id", assignmentId)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load your submission.");
      return data ? mapSubmissionRow(data) : null;
    },
    () => null,
  );
};

export interface AssignmentSubmissionInput {
  userId: string;
  cohortId: string;
  assignmentId: string;
  githubUrl?: string;
  notes?: string;
  submit: boolean;
}

/** Student-facing upsert. Submitting a GitHub link is completion — no admin review gate. */
export const saveMasterclassAssignmentSubmission = async (
  input: AssignmentSubmissionInput,
): Promise<MasterclassAssignmentSubmission> => {
  const existing = await supabase
    .from<SubmissionRow>("masterclass_assignment_submissions")
    .select("*")
    .eq("user_id", input.userId)
    .eq("cohort_id", input.cohortId)
    .eq("assignment_id", input.assignmentId)
    .maybeSingle();

  if (existing.error) {
    throw new Error(existing.error.message ?? "Unable to save your submission.");
  }

  const payload = {
    github_url: input.githubUrl ?? null,
    notes: input.notes ?? null,
    status: input.submit ? "submitted" : "not_started",
    submitted_at: input.submit ? new Date().toISOString() : null,
  };

  if (existing.data) {
    const { data, error } = await supabase
      .from<SubmissionRow>("masterclass_assignment_submissions")
      .update(payload)
      .eq("id", existing.data.id)
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Unable to save your submission.");
    emitMasterclassExperienceEvent();
    return mapSubmissionRow(data);
  }

  const { data, error } = await supabase
    .from<SubmissionRow>("masterclass_assignment_submissions")
    .insert({
      user_id: input.userId,
      cohort_id: input.cohortId,
      assignment_id: input.assignmentId,
      ...payload,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create your submission.");
  emitMasterclassExperienceEvent();
  return mapSubmissionRow(data);
};

export const readAllMasterclassAssignmentSubmissions = (
  cohortId: string,
  assignmentId?: string,
): Promise<MasterclassAssignmentSubmission[]> => {
  return withMasterclassFallback(
    "readAllMasterclassAssignmentSubmissions",
    async () => {
      let query = supabase
        .from<SubmissionRow>("masterclass_assignment_submissions")
        .select("*")
        .eq("cohort_id", cohortId);
      if (assignmentId) {
        query = query.eq("assignment_id", assignmentId);
      }
      const { data, error } = await query.order("updated_at", { ascending: false });
      if (error) throw new Error(error.message ?? "Unable to load submissions.");
      return (data ?? []).map(mapSubmissionRow);
    },
    () => [],
  );
};

/** Admin-only: leave feedback without gating the student's own progress. */
export const reviewMasterclassAssignmentSubmission = async (
  submissionId: string,
  adminFeedback: string,
): Promise<MasterclassAssignmentSubmission | null> => {
  const { data, error } = await supabase
    .from<SubmissionRow>("masterclass_assignment_submissions")
    .update({ admin_feedback: adminFeedback })
    .eq("id", submissionId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message ?? "Unable to update this submission.");
  emitMasterclassExperienceEvent();
  return data ? mapSubmissionRow(data) : null;
};
