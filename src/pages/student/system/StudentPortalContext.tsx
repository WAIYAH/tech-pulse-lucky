import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import {
  readStudentNotifications,
  readStudentSupportTickets,
  subscribeStudentExperience,
  type StudentNotification,
  type SupportTicket,
} from "@/lib/student/studentPortalState";
import type {
  LmsConfig,
  LmsCourse,
  LmsEnrollment,
  LmsLessonProgress,
  LmsPayment,
  LmsProfile,
} from "@/types/lms";

interface StudentPortalContextValue {
  user: LmsProfile | null;
  isLoading: boolean;
  config: LmsConfig;
  courses: LmsCourse[];
  enrollments: LmsEnrollment[];
  payments: LmsPayment[];
  progressByCourseId: Record<string, LmsLessonProgress[]>;
  latestPaymentByCourseId: Record<string, LmsPayment>;
  courseById: Record<string, LmsCourse>;
  enrollmentByCourseId: Record<string, LmsEnrollment>;
  averageProgress: number;
  totalLessons: number;
  completedLessons: number;
  supportTickets: SupportTicket[];
  notifications: StudentNotification[];
  unreadNotificationsCount: number;
  refresh: () => Promise<void>;
}

const StudentPortalContext = createContext<StudentPortalContextValue | undefined>(
  undefined,
);

const emptyConfig = lmsProvider.getConfig();

export const StudentPortalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [enrollments, setEnrollments] = useState<LmsEnrollment[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [progressByCourseId, setProgressByCourseId] = useState<
    Record<string, LmsLessonProgress[]>
  >({});
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  const syncExperience = useCallback(async () => {
    if (!user) {
      setSupportTickets([]);
      setNotifications([]);
      return;
    }

    const [ticketRows, notificationRows] = await Promise.all([
      readStudentSupportTickets(user.id),
      readStudentNotifications(user.id),
    ]);
    setSupportTickets(ticketRows);
    setNotifications(notificationRows);
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) {
      setCourses([]);
      setEnrollments([]);
      setPayments([]);
      setProgressByCourseId({});
      setSupportTickets([]);
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const [courseRows, enrollmentRows, paymentRows] = await Promise.all([
      lmsProvider.listCourses({ sortBy: "title" }),
      lmsProvider.getEnrollments(user.id),
      lmsProvider.getPaymentsForUser(user.id),
    ]);

    const courseByIdMap = courseRows.reduce<Record<string, LmsCourse>>((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});

    const progressEntries = await Promise.all(
      enrollmentRows.map(async (enrollment) => {
        const course = courseByIdMap[enrollment.courseId];
        if (!course) return [enrollment.courseId, [] as LmsLessonProgress[]] as const;

        const progressRows = await lmsProvider.getLessonProgress(user.id, course.slug);
        return [enrollment.courseId, progressRows] as const;
      }),
    );

    setCourses(courseRows);
    setEnrollments(enrollmentRows);
    setPayments(paymentRows);
    setProgressByCourseId(
      progressEntries.reduce<Record<string, LmsLessonProgress[]>>((acc, [courseId, rows]) => {
        acc[courseId] = rows;
        return acc;
      }, {}),
    );
    await syncExperience();
    setIsLoading(false);
  }, [syncExperience, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void syncExperience();
    return subscribeStudentExperience(() => {
      void syncExperience();
    });
  }, [syncExperience]);

  const courseById = useMemo(() => {
    return courses.reduce<Record<string, LmsCourse>>((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
  }, [courses]);

  const enrollmentByCourseId = useMemo(() => {
    return enrollments.reduce<Record<string, LmsEnrollment>>((acc, enrollment) => {
      acc[enrollment.courseId] = enrollment;
      return acc;
    }, {});
  }, [enrollments]);

  const latestPaymentByCourseId = useMemo(() => {
    return payments.reduce<Record<string, LmsPayment>>((acc, payment) => {
      const existing = acc[payment.courseId];
      if (!existing || existing.createdAt < payment.createdAt) {
        acc[payment.courseId] = payment;
      }
      return acc;
    }, {});
  }, [payments]);

  const averageProgress = useMemo(() => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((sum, row) => sum + row.progress, 0);
    return Math.round(total / enrollments.length);
  }, [enrollments]);

  const { totalLessons, completedLessons } = useMemo(() => {
    const lessonCount = enrollments.reduce((sum, enrollment) => {
      return sum + (courseById[enrollment.courseId]?.lessonsCount ?? 0);
    }, 0);

    const completed = Object.values(progressByCourseId).reduce((sum, rows) => {
      return sum + rows.filter((row) => row.completed).length;
    }, 0);

    return { totalLessons: lessonCount, completedLessons: completed };
  }, [courseById, enrollments, progressByCourseId]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const value = useMemo<StudentPortalContextValue>(
    () => ({
      user,
      isLoading,
      config: emptyConfig,
      courses,
      enrollments,
      payments,
      progressByCourseId,
      latestPaymentByCourseId,
      courseById,
      enrollmentByCourseId,
      averageProgress,
      totalLessons,
      completedLessons,
      supportTickets,
      notifications,
      unreadNotificationsCount,
      refresh,
    }),
    [
      user,
      isLoading,
      courses,
      enrollments,
      payments,
      progressByCourseId,
      latestPaymentByCourseId,
      courseById,
      enrollmentByCourseId,
      averageProgress,
      totalLessons,
      completedLessons,
      supportTickets,
      notifications,
      unreadNotificationsCount,
      refresh,
    ],
  );

  return (
    <StudentPortalContext.Provider value={value}>
      {children}
    </StudentPortalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally co-located with its provider
export const useStudentPortal = (): StudentPortalContextValue => {
  const context = useContext(StudentPortalContext);
  if (!context) {
    throw new Error("useStudentPortal must be used within StudentPortalProvider.");
  }

  return context;
};
