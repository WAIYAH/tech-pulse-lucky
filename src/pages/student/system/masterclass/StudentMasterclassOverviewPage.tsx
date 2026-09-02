import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Bell, CalendarDays, CheckCircle2, ClipboardList, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  computeOverallMasterclassProgress,
  computeWeekOverallPercent,
  readMasterclassAnnouncements,
  readMasterclassFinalProject,
} from "@/lib/masterclass";
import { cohortStatusBadgeVariant } from "@/lib/statusBadges";
import { routes } from "@/routes/routeConfig";
import type { MasterclassAnnouncement, MasterclassFinalProjectStages } from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";
import week1Image from "@/assets/masterclass/week-1-web-fundamentals.svg";
import week2Image from "@/assets/masterclass/week-2-css-responsive.svg";
import week3Image from "@/assets/masterclass/week-3-tailwind-frontend.svg";
import week4Image from "@/assets/masterclass/week-4-javascript-git.svg";
import week5Image from "@/assets/masterclass/week-5-php-backend.svg";
import week6Image from "@/assets/masterclass/week-6-mysql-databases.svg";
import week7Image from "@/assets/masterclass/week-7-deployment-devops.svg";
import week8Image from "@/assets/masterclass/week-8-capstone-project.svg";

const weekThemeImages: Record<number, string> = {
  1: week1Image,
  2: week2Image,
  3: week3Image,
  4: week4Image,
  5: week5Image,
  6: week6Image,
  7: week7Image,
  8: week8Image,
};

const StudentMasterclassOverviewPage = () => {
  const { user } = useAuth();
  const { isLoading, program, cohort, weeks, enrollment, hasAccess, weekProgress, weekAccess, isLoadingProgress } =
    useMasterclassStudent();

  const [announcements, setAnnouncements] = useState<MasterclassAnnouncement[]>([]);
  const [finalProjectStages, setFinalProjectStages] = useState<MasterclassFinalProjectStages | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user || !cohort || !hasAccess) return;

      const [announcementRows, finalProjectRow] = await Promise.all([
        readMasterclassAnnouncements(cohort.id),
        readMasterclassFinalProject(user.id, cohort.id),
      ]);
      if (!isMounted) return;
      setAnnouncements(announcementRows);
      setFinalProjectStages(finalProjectRow?.stages ?? null);
    };

    void load();
    return () => {
      isMounted = false;
    };
    // Depend on ids rather than the user/cohort objects: those are re-fetched
    // with new references on every provider refresh, which would refire this
    // effect even when nothing meaningful changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, cohort?.id, hasAccess]);

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
      ? computeOverallMasterclassProgress({
          weeks: Object.values(weekProgress),
          finalProjectStages,
        })
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h1 className="text-2xl font-bold md:text-3xl">{program.title}</h1>
          <Badge variant="secondary">{cohort.cohortLabel}</Badge>
          <Badge variant={cohortStatusBadgeVariant[cohort.status]} className="capitalize">
            {cohort.status}
          </Badge>
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
            const access = weekAccess[week.weekNumber];
            const isWeekLocked = hasAccess && !isLoadingProgress && access && !access.isUnlocked;
            const isWeekComplete = hasAccess && access?.isComplete;

            return (
              <Card
                key={week.id}
                className={`overflow-hidden${!hasAccess || isWeekLocked ? " opacity-70" : ""}`}
              >
                {weekThemeImages[week.weekNumber] && (
                  <div className="flex h-32 items-center justify-center bg-primary/5 p-4">
                    <img
                      src={weekThemeImages[week.weekNumber]}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Week {week.weekNumber}</span>
                    {!hasAccess || isWeekLocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : isWeekComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold">{week.title}</p>
                  <p className="text-xs text-muted-foreground">{week.theme}</p>
                  {hasAccess && !isWeekLocked && percent !== null && (
                    <div className="flex items-center gap-2">
                      <Progress value={percent} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium">{percent}%</span>
                    </div>
                  )}
                  {isWeekComplete && (
                    <Badge variant="success" className="w-fit">
                      Completed
                    </Badge>
                  )}
                  {!hasAccess ? (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      Locked
                    </Button>
                  ) : isWeekLocked ? (
                    <Button size="sm" variant="outline" disabled className="w-full">
                      {access?.lockReason === "date"
                        ? `Opens ${new Date(access.unlockDate).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}`
                        : "Finish previous week"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <Link to={routes.student.masterclassWeek(week.weekNumber)}>Open Week</Link>
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
