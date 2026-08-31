import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type { MasterclassAttendanceRecord } from "@/types/masterclass";

interface AttendanceRow extends Record<string, unknown> {
  id: string;
  cohort_id: string;
  week_id?: string | null;
  user_id: string;
  session_date: string;
  session_label: string;
  status: MasterclassAttendanceRecord["status"];
  notes?: string | null;
}

const mapRow = (row: AttendanceRow): MasterclassAttendanceRecord => ({
  id: row.id,
  cohortId: row.cohort_id,
  weekId: row.week_id ?? undefined,
  userId: row.user_id,
  sessionDate: row.session_date,
  sessionLabel: row.session_label,
  status: row.status,
  notes: row.notes ?? undefined,
});

export const readMasterclassAttendanceForStudent = (
  userId: string,
  cohortId: string,
): Promise<MasterclassAttendanceRecord[]> => {
  return withMasterclassFallback(
    "readMasterclassAttendanceForStudent",
    async () => {
      const { data, error } = await supabase
        .from<AttendanceRow>("masterclass_attendance")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId)
        .order("session_date", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load attendance.");
      return (data ?? []).map(mapRow);
    },
    () => [],
  );
};

export const readAllMasterclassAttendance = (cohortId: string): Promise<MasterclassAttendanceRecord[]> => {
  return withMasterclassFallback(
    "readAllMasterclassAttendance",
    async () => {
      const { data, error } = await supabase
        .from<AttendanceRow>("masterclass_attendance")
        .select("*")
        .eq("cohort_id", cohortId)
        .order("session_date", { ascending: true });
      if (error) throw new Error(error.message ?? "Unable to load attendance.");
      return (data ?? []).map(mapRow);
    },
    () => [],
  );
};

export interface RecordAttendanceInput {
  cohortId: string;
  weekId?: string;
  userId: string;
  sessionDate: string;
  sessionLabel: string;
  status: MasterclassAttendanceRecord["status"];
  notes?: string;
  markedBy: string;
}

/** Admin-only (enforced by RLS). Upserts on the (cohort_id, user_id, session_date) unique key. */
export const recordMasterclassAttendance = async (
  input: RecordAttendanceInput,
): Promise<MasterclassAttendanceRecord> => {
  const existing = await supabase
    .from<AttendanceRow>("masterclass_attendance")
    .select("*")
    .eq("cohort_id", input.cohortId)
    .eq("user_id", input.userId)
    .eq("session_date", input.sessionDate)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message ?? "Unable to record attendance.");

  const payload = {
    week_id: input.weekId ?? null,
    session_label: input.sessionLabel,
    status: input.status,
    notes: input.notes ?? null,
    marked_by: input.markedBy,
  };

  if (existing.data) {
    const { data, error } = await supabase
      .from<AttendanceRow>("masterclass_attendance")
      .update(payload)
      .eq("id", existing.data.id)
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Unable to update attendance.");
    emitMasterclassExperienceEvent();
    return mapRow(data);
  }

  const { data, error } = await supabase
    .from<AttendanceRow>("masterclass_attendance")
    .insert({
      cohort_id: input.cohortId,
      user_id: input.userId,
      session_date: input.sessionDate,
      ...payload,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to record attendance.");
  emitMasterclassExperienceEvent();
  return mapRow(data);
};
