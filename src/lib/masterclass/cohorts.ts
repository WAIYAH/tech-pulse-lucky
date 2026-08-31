import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import { masterclassCohort2026, masterclassProgram } from "@/data/masterclassContent";
import type { MasterclassCohort } from "@/types/masterclass";

interface CohortRow extends Record<string, unknown> {
  id: string;
  program_id: string;
  course_id: string;
  cohort_label: string;
  start_date: string;
  end_date: string;
  status: MasterclassCohort["status"];
  max_seats?: number | null;
  created_at: string;
  updated_at: string;
}

const mapCohortRow = (row: CohortRow): MasterclassCohort => ({
  id: row.id,
  programId: row.program_id,
  courseId: row.course_id,
  cohortLabel: row.cohort_label,
  startDate: row.start_date,
  endDate: row.end_date,
  status: row.status,
  maxSeats: row.max_seats ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const readMasterclassCohorts = (programId: string): Promise<MasterclassCohort[]> => {
  return withMasterclassFallback(
    "readMasterclassCohorts",
    async () => {
      const { data, error } = await supabase
        .from<CohortRow>("masterclass_cohorts")
        .select("*")
        .eq("program_id", programId)
        .order("start_date", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load masterclass cohorts.");
      return (data ?? []).map(mapCohortRow);
    },
    () => (programId === masterclassProgram.id ? [masterclassCohort2026] : []),
  );
};

/** Picks the most relevant cohort to feature publicly: active first, then the soonest upcoming, then the most recent. */
export const resolvePrimaryCohort = (cohorts: MasterclassCohort[]): MasterclassCohort | null => {
  if (cohorts.length === 0) return null;

  const active = cohorts.find((cohort) => cohort.status === "active");
  if (active) return active;

  const upcoming = cohorts
    .filter((cohort) => cohort.status === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (upcoming.length > 0) return upcoming[0];

  return [...cohorts].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
};

/** Finds the cohort a student's enrollment (keyed by course id) belongs to. */
export const resolveCohortForCourseId = (
  cohorts: MasterclassCohort[],
  courseId: string,
): MasterclassCohort | null => cohorts.find((cohort) => cohort.courseId === courseId) ?? null;

export interface UpdateCohortInput {
  startDate: string;
  endDate: string;
  status: MasterclassCohort["status"];
  maxSeats: number | null;
}

/** Admin-only (enforced by RLS). */
export const updateMasterclassCohort = async (
  cohortId: string,
  input: UpdateCohortInput,
): Promise<MasterclassCohort> => {
  const { data, error } = await supabase
    .from<CohortRow>("masterclass_cohorts")
    .update({
      start_date: input.startDate,
      end_date: input.endDate,
      status: input.status,
      max_seats: input.maxSeats,
    })
    .eq("id", cohortId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update this cohort.");
  }

  emitMasterclassExperienceEvent();
  return mapCohortRow(data);
};
