import { emitMasterclassExperienceEvent, randomId, supabase, withMasterclassFallback } from "./client";
import type { MasterclassCertificate } from "@/types/masterclass";

interface CertificateRow extends Record<string, unknown> {
  id: string;
  user_id: string;
  cohort_id: string;
  certificate_code: string;
  status: MasterclassCertificate["status"];
  certificate_url?: string | null;
  issued_at?: string | null;
}

const mapRow = (row: CertificateRow): MasterclassCertificate => ({
  id: row.id,
  userId: row.user_id,
  cohortId: row.cohort_id,
  certificateCode: row.certificate_code,
  status: row.status,
  certificateUrl: row.certificate_url ?? undefined,
  issuedAt: row.issued_at ?? undefined,
});

export const readMasterclassCertificate = (
  userId: string,
  cohortId: string,
): Promise<MasterclassCertificate | null> => {
  return withMasterclassFallback(
    "readMasterclassCertificate",
    async () => {
      const { data, error } = await supabase
        .from<CertificateRow>("masterclass_certificates")
        .select("*")
        .eq("user_id", userId)
        .eq("cohort_id", cohortId)
        .maybeSingle();
      if (error) throw new Error(error.message ?? "Unable to load your certificate.");
      return data ? mapRow(data) : null;
    },
    () => null,
  );
};

export const readAllMasterclassCertificates = (cohortId: string): Promise<MasterclassCertificate[]> => {
  return withMasterclassFallback(
    "readAllMasterclassCertificates",
    async () => {
      const { data, error } = await supabase
        .from<CertificateRow>("masterclass_certificates")
        .select("*")
        .eq("cohort_id", cohortId);
      if (error) throw new Error(error.message ?? "Unable to load certificates.");
      return (data ?? []).map(mapRow);
    },
    () => [],
  );
};

/** Admin-only: marks a student eligible or issues/revokes their certificate. */
export const setMasterclassCertificateStatus = async (
  userId: string,
  cohortId: string,
  status: MasterclassCertificate["status"],
  certificateUrl?: string,
): Promise<MasterclassCertificate> => {
  const existing = await supabase
    .from<CertificateRow>("masterclass_certificates")
    .select("*")
    .eq("user_id", userId)
    .eq("cohort_id", cohortId)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message ?? "Unable to update this certificate.");

  const payload = {
    status,
    certificate_url: certificateUrl ?? existing.data?.certificate_url ?? null,
    issued_at: status === "issued" ? new Date().toISOString() : existing.data?.issued_at ?? null,
  };

  if (existing.data) {
    const { data, error } = await supabase
      .from<CertificateRow>("masterclass_certificates")
      .update(payload)
      .eq("id", existing.data.id)
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Unable to update this certificate.");
    emitMasterclassExperienceEvent();
    return mapRow(data);
  }

  const { data, error } = await supabase
    .from<CertificateRow>("masterclass_certificates")
    .insert({
      user_id: userId,
      cohort_id: cohortId,
      certificate_code: `TPI-WDM-${randomId().slice(0, 8).toUpperCase()}`,
      ...payload,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create this certificate.");
  emitMasterclassExperienceEvent();
  return mapRow(data);
};
