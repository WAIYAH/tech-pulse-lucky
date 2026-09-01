import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import {
  PROGRAM_SLUG,
  buildMasterclassWeekAccessMap,
  buildMasterclassWeekProgressInputs,
  readMasterclassCohorts,
  readMasterclassLessonProgress,
  readMasterclassProgram,
  readMasterclassWeeks,
  resolveCohortForCourseId,
  resolvePrimaryCohort,
  type WeekProgressInput,
} from "@/lib/masterclass";
import type { LmsEnrollment } from "@/types/lms";
import type {
  MasterclassCohort,
  MasterclassProgram,
  MasterclassWeek,
  MasterclassWeekAccess,
} from "@/types/masterclass";

interface MasterclassStudentContextValue {
  isLoading: boolean;
  program: MasterclassProgram | null;
  cohort: MasterclassCohort | null;
  weeks: MasterclassWeek[];
  enrollment: LmsEnrollment | null;
  hasAccess: boolean;
  weekProgress: Record<number, WeekProgressInput>;
  weekAccess: Record<number, MasterclassWeekAccess>;
  isLoadingProgress: boolean;
  refresh: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const MasterclassStudentContext = createContext<MasterclassStudentContextValue | undefined>(undefined);

export const MasterclassStudentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [program, setProgram] = useState<MasterclassProgram | null>(null);
  const [cohort, setCohort] = useState<MasterclassCohort | null>(null);
  const [weeks, setWeeks] = useState<MasterclassWeek[]>([]);
  const [enrollment, setEnrollment] = useState<LmsEnrollment | null>(null);
  const [weekProgress, setWeekProgress] = useState<Record<number, WeekProgressInput>>({});
  const [weekAccess, setWeekAccess] = useState<Record<number, MasterclassWeekAccess>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

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

  const refreshProgress = useCallback(async () => {
    if (!user || !cohort || !hasAccess || weeks.length === 0) {
      setWeekProgress({});
      setWeekAccess({});
      setIsLoadingProgress(false);
      return;
    }

    setIsLoadingProgress(true);
    try {
      const lessonProgressRows = await readMasterclassLessonProgress(user.id, cohort.id);
      const weekInputs = await buildMasterclassWeekProgressInputs(weeks, user.id, cohort.id, lessonProgressRows);
      const progressByNumber = Object.fromEntries(weekInputs.map((input) => [input.weekNumber, input]));
      setWeekProgress(progressByNumber);
      setWeekAccess(buildMasterclassWeekAccessMap(weeks, progressByNumber, cohort.startDate));
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user, cohort, hasAccess, weeks]);

  useEffect(() => {
    void refreshProgress();
  }, [refreshProgress]);

  const value = useMemo<MasterclassStudentContextValue>(
    () => ({
      isLoading,
      program,
      cohort,
      weeks,
      enrollment,
      hasAccess,
      weekProgress,
      weekAccess,
      isLoadingProgress,
      refresh,
      refreshProgress,
    }),
    [
      isLoading,
      program,
      cohort,
      weeks,
      enrollment,
      hasAccess,
      weekProgress,
      weekAccess,
      isLoadingProgress,
      refresh,
      refreshProgress,
    ],
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

export const useMasterclassWeekAccess = (weekNumber: number): MasterclassWeekAccess | null => {
  const { weekAccess } = useMasterclassStudent();
  return weekAccess[weekNumber] ?? null;
};
