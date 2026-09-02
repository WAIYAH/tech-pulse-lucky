import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  PROGRAM_SLUG,
  readMasterclassCohorts,
  readMasterclassProgram,
  readMasterclassWeeks,
  resolvePrimaryCohort,
} from "@/lib/masterclass";
import type { MasterclassCohort, MasterclassProgram, MasterclassWeek } from "@/types/masterclass";

interface AdminMasterclassContextValue {
  isLoading: boolean;
  program: MasterclassProgram | null;
  weeks: MasterclassWeek[];
  cohorts: MasterclassCohort[];
  selectedCohortId: string | null;
  selectedCohort: MasterclassCohort | null;
  setSelectedCohortId: (cohortId: string) => void;
  refresh: () => Promise<void>;
}

const AdminMasterclassContext = createContext<AdminMasterclassContextValue | undefined>(undefined);

export const AdminMasterclassProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [program, setProgram] = useState<MasterclassProgram | null>(null);
  const [weeks, setWeeks] = useState<MasterclassWeek[]>([]);
  const [cohorts, setCohorts] = useState<MasterclassCohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const programRow = await readMasterclassProgram(PROGRAM_SLUG);
      if (!programRow) {
        setProgram(null);
        setWeeks([]);
        setCohorts([]);
        return;
      }

      const [weekRows, cohortRows] = await Promise.all([
        readMasterclassWeeks(programRow.id),
        readMasterclassCohorts(programRow.id),
      ]);

      setProgram(programRow);
      setWeeks(weekRows);
      setCohorts(cohortRows);
      setSelectedCohortId((prev) => {
        if (prev && cohortRows.some((cohort) => cohort.id === prev)) return prev;
        return resolvePrimaryCohort(cohortRows)?.id ?? cohortRows[0]?.id ?? null;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectedCohort = cohorts.find((cohort) => cohort.id === selectedCohortId) ?? null;

  const value = useMemo<AdminMasterclassContextValue>(
    () => ({
      isLoading,
      program,
      weeks,
      cohorts,
      selectedCohortId,
      selectedCohort,
      setSelectedCohortId,
      refresh,
    }),
    [isLoading, program, weeks, cohorts, selectedCohortId, selectedCohort, refresh],
  );

  return <AdminMasterclassContext.Provider value={value}>{children}</AdminMasterclassContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally co-located with its provider
export const useAdminMasterclass = (): AdminMasterclassContextValue => {
  const context = useContext(AdminMasterclassContext);
  if (!context) {
    throw new Error("useAdminMasterclass must be used within an AdminMasterclassProvider");
  }
  return context;
};
