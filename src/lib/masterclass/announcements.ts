import { emitMasterclassExperienceEvent, supabase, withMasterclassFallback } from "./client";
import type { MasterclassAnnouncement } from "@/types/masterclass";

interface AnnouncementRow extends Record<string, unknown> {
  id: string;
  cohort_id: string;
  week_id?: string | null;
  target_user_id?: string | null;
  title: string;
  message: string;
  is_pinned: boolean;
  published_at: string;
  created_by?: string | null;
}

const mapRow = (row: AnnouncementRow): MasterclassAnnouncement => ({
  id: row.id,
  cohortId: row.cohort_id,
  weekId: row.week_id ?? undefined,
  targetUserId: row.target_user_id ?? undefined,
  title: row.title,
  message: row.message,
  isPinned: row.is_pinned,
  publishedAt: row.published_at,
  createdBy: row.created_by ?? undefined,
});

/** RLS already scopes rows to cohort-wide, week-specific, or targeted-at-me, or all rows for an admin. */
export const readMasterclassAnnouncements = (cohortId: string): Promise<MasterclassAnnouncement[]> => {
  return withMasterclassFallback(
    "readMasterclassAnnouncements",
    async () => {
      const { data, error } = await supabase
        .from<AnnouncementRow>("masterclass_announcements")
        .select("*")
        .eq("cohort_id", cohortId)
        .order("published_at", { ascending: false });
      if (error) throw new Error(error.message ?? "Unable to load announcements.");
      return (data ?? []).map(mapRow);
    },
    () => [],
  );
};

export interface CreateAnnouncementInput {
  cohortId: string;
  weekId?: string;
  targetUserId?: string;
  title: string;
  message: string;
  isPinned?: boolean;
  createdBy: string;
}

/** Admin-only (enforced by RLS). Leave weekId/targetUserId unset for a cohort-wide announcement. */
export const createMasterclassAnnouncement = async (
  input: CreateAnnouncementInput,
): Promise<MasterclassAnnouncement> => {
  const { data, error } = await supabase
    .from<AnnouncementRow>("masterclass_announcements")
    .insert({
      cohort_id: input.cohortId,
      week_id: input.weekId ?? null,
      target_user_id: input.targetUserId ?? null,
      title: input.title.trim(),
      message: input.message.trim(),
      is_pinned: input.isPinned ?? false,
      published_at: new Date().toISOString(),
      created_by: input.createdBy,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this announcement.");
  emitMasterclassExperienceEvent();
  return mapRow(data);
};

export const deleteMasterclassAnnouncement = async (announcementId: string): Promise<void> => {
  const { error } = await supabase.from("masterclass_announcements").delete().eq("id", announcementId);
  if (error) throw new Error(error.message ?? "Unable to delete this announcement.");
  emitMasterclassExperienceEvent();
};
