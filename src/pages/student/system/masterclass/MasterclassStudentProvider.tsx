import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import {
  PROGRAM_SLUG,
  readMasterclassCohorts,
  readMasterclassProgram,
  readMasterclassWeeks,
  resolveCohortForCourseId,
  resolvePrimaryCohort,
} from "@/lib/masterclass";
import type { LmsEnrollment } from "@/types/lms";
import type { MasterclassCohort, MasterclassProgram, MasterclassWeek } from "@/types/masterclass";

interface MasterclassStudentContextValue {
  isLoading: boolean;
  program: MasterclassProgram | null;
  cohort: MasterclassCohort | null;
  weeks: MasterclassWeek[];
  enrollment: LmsEnrollment | null;
  hasAccess: boolean;
  refresh: () => Promise<void>;
}

const MasterclassStudentContext = createContext<MasterclassStudentContextValue | undefined>(undefined);

export const MasterclassStudentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [program, setProgram] = useState<MasterclassProgram | null>(null);
  const [cohort, setCohort] = useState<MasterclassCohort | null>(null);
  const [weeks, setWeeks] = useState<MasterclassWeek[]>([]);
  const [enrollment, setEnrollment] = useState<LmsEnrollment | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const programRow = await readMasterclassProgram(PROGRAM_SLUG);
      if (!programRow) {
        setProgram(null);
        setCohort(null);
        setWeeks([]);
        setEnrollment(null);
        return;
      }

      const [cohorts, weekRows, enrollments] = await Promise.all([
        readMasterclassCohorts(programRow.id),
        readMasterclassWeeks(programRow.id),
        user ? lmsProvider.getEnrollments(user.id) : Promise.resolve([] as LmsEnrollment[]),
      ]);

      const activeCohort = resolvePrimaryCohort(cohorts);
      const matchedEnrollment = activeCohort
        ? enrollments.find((row) => row.courseId === activeCohort.courseId) ?? null
        : null;
      const enrolledCohort = matchedEnrollment
        ? resolveCohortForCourseId(cohorts, matchedEnrollment.courseId) ?? activeCohort
        : activeCohort;

      setProgram(programRow);
      setCohort(enrolledCohort);
      setWeeks(weekRows);
      setEnrollment(matchedEnrollment);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const hasAccess = enrollment?.accessStatus === "approved" || enrollment?.accessStatus === "free";

  const value = useMemo<MasterclassStudentContextValue>(
    () => ({ isLoading, program, cohort, weeks, enrollment, hasAccess, refresh }),
    [isLoading, program, cohort, weeks, enrollment, hasAccess, refresh],
  );

  return <MasterclassStudentContext.Provider value={value}>{children}</MasterclassStudentContext.Provider>;
};

export const useMasterclassStudent = (): MasterclassStudentContextValue => {
  const context = useContext(MasterclassStudentContext);
  if (!context) {
    throw new Error("useMasterclassStudent must be used within a MasterclassStudentProvider");
  }
  return context;
};
