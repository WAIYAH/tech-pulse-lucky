import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Bell, CalendarDays, ClipboardList, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  computeOverallMasterclassProgress,
  computeWeekOverallPercent,
  readMasterclassAnnouncements,
  readMasterclassLessonProgress,
  readMasterclassLessons,
  readMasterclassQuizAttempts,
  readMasterclassQuizForWeek,
  type WeekProgressInput,
} from "@/lib/masterclass";
import { routes } from "@/routes/routeConfig";
import type { MasterclassAnnouncement } from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";

const StudentMasterclassOverviewPage = () => {
  const { user } = useAuth();
  const { isLoading, program, cohort, weeks, enrollment, hasAccess } = useMasterclassStudent();

  const [weekProgress, setWeekProgress] = useState<Record<number, WeekProgressInput>>({});
  const [announcements, setAnnouncements] = useState<MasterclassAnnouncement[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user || !cohort || !hasAccess || weeks.length === 0) {
        setIsLoadingProgress(false);
        return;
      }

      setIsLoadingProgress(true);
      const [lessonProgressRows, announcementRows] = await Promise.all([
        readMasterclassLessonProgress(user.id, cohort.id),
        readMasterclassAnnouncements(cohort.id),
      ]);
      if (!isMounted) return;
      setAnnouncements(announcementRows);

      const entries = await Promise.all(
        weeks.map(async (week) => {
          const [lessons, quiz] = await Promise.all([
            readMasterclassLessons(week.id),
            readMasterclassQuizForWeek(week.id),
          ]);

          const learningLessons = lessons.filter((lesson) => lesson.lessonType !== "practical");
          const practicalLesson = lessons.find((lesson) => lesson.lessonType === "practical");
          const completedLearning = learningLessons.filter((lesson) =>
            lessonProgressRows.some((row) => row.lessonId === lesson.id && row.completed),
          ).length;
          const practicalCompleted = practicalLesson
            ? lessonProgressRows.some((row) => row.lessonId === practicalLesson.id && row.completed)
            : false;

          let quizScorePercent: number | null = null;
          if (quiz) {
            const attempts = await readMasterclassQuizAttempts(quiz.id, user.id);
            if (attempts.length > 0) {
              quizScorePercent = Math.max(...attempts.map((attempt) => attempt.score));
            }
          }

          const input: WeekProgressInput = {
            weekNumber: week.weekNumber,
            completedLearningLessons: completedLearning,
            totalLearningLessons: learningLessons.length,
            practicalCompleted,
            hasPractical: Boolean(practicalLesson),
            quizScorePercent,
          };
          return [week.weekNumber, input] as const;
        }),
      );

      if (!isMounted) return;
      setWeekProgress(Object.fromEntries(entries));
      setIsLoadingProgress(false);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [user?.id, cohort?.id, hasAccess, weeks]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading masterclass details...
      </div>
    );
  }

  if (!program || !cohort) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        The Web Development Masterclass is not configured yet. Check back soon.
      </div>
    );
  }

  const overallProgress =
    hasAccess && Object.keys(weekProgress).length > 0
      ? computeOverallMasterclassProgress({ weeks: Object.values(weekProgress), finalProjectStages: null })
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h1 className="text-2xl font-bold md:text-3xl">{program.title}</h1>
          <Badge variant="secondary">{cohort.cohortLabel}</Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{program.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            {new Date(cohort.startDate).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}
            {" - "}
            {new Date(cohort.endDate).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {hasAccess && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Course Completion</span>
              <span className="font-semibold">{isLoadingProgress ? "..." : `${overallProgress}%`}</span>
            </div>
            <Progress value={overallProgress} className="mt-2 h-2" />
          </div>
        )}
      </section>

      {!hasAccess && (
        <section className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
          <p className="text-sm font-medium">
            {enrollment?.accessStatus === "pending_payment"
              ? "Your payment is pending review. We will unlock the full curriculum once it is approved."
              : enrollment?.accessStatus === "rejected"
                ? "Your last payment submission was rejected. Please resubmit to unlock the curriculum."
                : "Enroll in this cohort to unlock the full 8-week curriculum, weekly quizzes, and terminology."}
          </p>
          <Button asChild className="mt-3">
            <Link to={routes.public.course(program.slug)}>View Program &amp; Enroll</Link>
          </Button>
        </section>
      )}

      {hasAccess && (
        <section>
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Final Capstone Project</p>
                  <p className="text-xs text-muted-foreground">Track your Week 8 project from proposal to deployment.</p>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link to={routes.student.masterclassFinalProject}>Open Tracker</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">8-Week Curriculum</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {weeks.map((week) => {
            const progress = weekProgress[week.weekNumber];
            const percent = progress ? computeWeekOverallPercent(progress) : null;
            return (
              <Card key={week.id} className={!hasAccess ? "opacity-70" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Week {week.weekNumber}</span>
                    {hasAccess ? (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold">{week.title}</p>
                  <p className="text-xs text-muted-foreground">{week.theme}</p>
                  {hasAccess && percent !== null && (
                    <div className="flex items-center gap-2">
                      <Progress value={percent} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium">{percent}%</span>
                    </div>
                  )}
                  {hasAccess ? (
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <Link to={routes.student.masterclassWeek(week.weekNumber)}>Open Week</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {hasAccess && announcements.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <Bell className="h-5 w-5 text-primary" /> Announcements
          </h2>
          <div className="space-y-3">
            {announcements.slice(0, 5).map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{announcement.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.publishedAt).toLocaleDateString("en-KE")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{announcement.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentMasterclassOverviewPage;
