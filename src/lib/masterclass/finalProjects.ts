import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type { MasterclassFinalProject, MasterclassFinalProjectStages } from "@/types/masterclass";

interface FinalProjectRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  cohort_id: string;
  project_type: string;
  problem_statement: string;
  target_users: string;
  requirements: string;
  github_url?: string | null;
  deployment_url?: string | null;
  stage_proposal: number;
  stage_requirements: number;
  stage_ui: number;
  stage_database: number;
  stage_development: number;
  stage_testing: number;
  stage_deployment: number;
  status: MasterclassFinalProject["status"];
  admin_feedback?: string | null;
  submitted_at?: string | null;
  created_at: string;
  updated_at: string;
}

const mapRow = (row: FinalProjectRow): MasterclassFinalProject => ({
  id: row.id,
  userId: row.user_id,
  cohortId: row.cohort_id,
  projectType: row.project_type,
  problemStatement: row.problem_statement,
  targetUsers: row.target_users,
  requirements: row.requirements,
  githubUrl: row.github_url ?? undefined,
  deploymentUrl: row.deployment_url ?? undefined,
  stages: {
    proposal: row.stage_proposal,
    requirements: row.stage_requirements,
    ui: row.stage_ui,
    database: row.stage_database,
    development: row.stage_development,
    testing: row.stage_testing,
    deployment: row.stage_deployment,
  },
  status: row.status,
  adminFeedback: row.admin_feedback ?? undefined,
  submittedAt: row.submitted_at ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const stagesToColumns = (stages: MasterclassFinalProjectStages) => ({
  stage_proposal: stages.proposal,
  stage_requirements: stages.requirements,
  stage_ui: stages.ui,
  stage_database: stages.database,
  stage_development: stages.development,
  stage_testing: stages.testing,
  stage_deployment: stages.deployment,
});

export const readMasterclassFinalProject = (
  userId: string,
  cohortId: string,
): Promise<MasterclassFinalProject | null> => {
  return withMasterclassFallback(
    "readMasterclassFinalProject",
    async () => {
      const { data, error } = await supabase
        .from<FinalProjectRow>("masterclass_final_projects")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load your final project.");
      return data ? mapRow(data) : null;
    },
    () => null,
  );
};

export const readAllMasterclassFinalProjects = (cohortId: string): Promise<MasterclassFinalProject[]> => {
  return withMasterclassFallback(
    "readAllMasterclassFinalProjects",
    async () => {
      const { data, error } = await supabase
        .from<FinalProjectRow>("masterclass_final_projects")
        .select("*")
        .eq("cohort_id", cohortId)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message ?? "Unable to load final projects.");
      return (data ?? []).map(mapRow);
    },
    () => [],
  );
};

export interface FinalProjectStudentInput {
  userId: string;
  cohortId: string;
  projectType: string;
  problemStatement: string;
  targetUsers: string;
  requirements: string;
  githubUrl?: string;
  deploymentUrl?: string;
  stages: MasterclassFinalProjectStages;
  status: Extract<MasterclassFinalProject["status"], "not_started" | "in_progress" | "submitted">;
}

/** Student-facing upsert. Never writes admin_feedback or an "approved" status (guarded server-side too). */
export const saveMasterclassFinalProject = async (
  input: FinalProjectStudentInput,
): Promise<MasterclassFinalProject> => {
  const existing = await supabase
    .from<FinalProjectRow>("masterclass_final_projects")
    .select("*")
    .eq("user_id", input.userId)
    .eq("cohort_id", input.cohortId)
    .maybeSingle();

  if (existing.error) {
    throw new Error(existing.error.message ?? "Unable to save your final project.");
  }

  const payload = {
    project_type: input.projectType,
    problem_statement: input.problemStatement,
    target_users: input.targetUsers,
    requirements: input.requirements,
    github_url: input.githubUrl ?? null,
    deployment_url: input.deploymentUrl ?? null,
    ...stagesToColumns(input.stages),
    status: input.status,
    submitted_at: input.status === "submitted" ? new Date().toISOString() : null,
  };

  if (existing.data) {
    const { data, error } = await supabase
      .from<FinalProjectRow>("masterclass_final_projects")
      .update(payload)
      .eq("id", existing.data.id)
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Unable to save your final project.");
    emitMasterclassExperienceEvent();
    return mapRow(data);
  }

  const { data, error } = await supabase
    .from<FinalProjectRow>("masterclass_final_projects")
    .insert({ user_id: input.userId, cohort_id: input.cohortId, ...payload })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create your final project.");
  emitMasterclassExperienceEvent();
  return mapRow(data);
};

/** Admin-only fields: feedback and approval. */
export const reviewMasterclassFinalProject = async (
  projectId: string,
  updates: { adminFeedback?: string; status?: MasterclassFinalProject["status"] },
): Promise<MasterclassFinalProject | null> => {
  const payload: Record<string, unknown> = {};
  if (typeof updates.adminFeedback === "string") payload.admin_feedback = updates.adminFeedback;
  if (updates.status) payload.status = updates.status;

  const { data, error } = await supabase
    .from<FinalProjectRow>("masterclass_final_projects")
    .update(payload)
    .eq("id", projectId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message ?? "Unable to update this final project.");
  emitMasterclassExperienceEvent();
  return data ? mapRow(data) : null;
};
