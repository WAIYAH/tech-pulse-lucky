import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOpen, ChevronLeft, ChevronRight, Github, ListChecks, Lock, Type, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/routes/routeConfig";
import { useMasterclassStudent, useMasterclassWeekAccess } from "./MasterclassStudentProvider";
import { StudentMasterclassWeekProvider } from "./StudentMasterclassWeekProvider";

const tabs = [
  { segment: "lessons", label: "Lessons", icon: BookOpen },
  { segment: "terminology", label: "Terminology", icon: Type },
  { segment: "live", label: "Live & Resources", icon: Video },
  { segment: "assignment", label: "Assignment", icon: Github },
  { segment: "quiz", label: "Quiz", icon: ListChecks },
] as const;

const tabPathBuilders: Record<(typeof tabs)[number]["segment"], (weekNumber: number) => string> = {
  lessons: routes.student.masterclassWeekLessons,
  terminology: routes.student.masterclassWeekTerminology,
  live: routes.student.masterclassWeekLive,
  assignment: routes.student.masterclassWeekAssignment,
  quiz: routes.student.masterclassWeekQuiz,
};

const formatUnlockDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" });
};

const StudentMasterclassWeekLayout = () => {
  const { weekNumber: weekNumberParam } = useParams<{ weekNumber: string }>();
  const weekNumber = Number(weekNumberParam);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    program,
    weeks,
    hasAccess,
    isLoading: isPortalLoading,
    isLoadingProgress,
    weekAccess,
  } = useMasterclassStudent();
  const access = useMasterclassWeekAccess(weekNumber);

  const week = weeks.find((row) => row.weekNumber === weekNumber);

  if (isPortalLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading masterclass details...
      </div>
    );
  }

  if (!week) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        This week could not be found.{" "}
        <Link to={routes.student.masterclass} className="text-primary underline">
          Back to Masterclass Overview
        </Link>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold">
          Week {week.weekNumber}: {week.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enroll and get your payment approved to unlock this week full lesson content, terminology, and quiz.
        </p>
        {program && (
          <Button asChild className="mt-4">
            <Link to={routes.public.course(program.slug)}>View Program &amp; Enroll</Link>
          </Button>
        )}
      </div>
    );
  }

  if (isLoadingProgress || !access) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Checking your progress...
      </div>
    );
  }

  const previousWeekNumber = week.weekNumber > 1 ? week.weekNumber - 1 : null;
  const nextWeekNumber = week.weekNumber < weeks.length ? week.weekNumber + 1 : null;

  if (!access.isUnlocked) {
    const lockMessage =
      access.lockReason === "date"
        ? `This week opens on ${formatUnlockDate(access.unlockDate)}.`
        : `Finish Week ${previousWeekNumber} first to unlock this week.`;

    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Week {week.weekNumber}</p>
              <h1 className="text-2xl font-bold md:text-3xl">{week.title}</h1>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" /> Locked
            </Badge>
          </div>
        </section>

        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">{lockMessage}</p>
          {access.lockReason === "previous-week" && previousWeekNumber && (
            <Button asChild variant="accent" className="mt-4">
              <Link to={routes.student.masterclassWeek(previousWeekNumber)}>Go to Week {previousWeekNumber}</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const activeSegment = tabs.find((tab) => location.pathname.endsWith(`/${tab.segment}`))?.segment ?? "lessons";
  const nextAccess = nextWeekNumber ? weekAccess[nextWeekNumber]?.isUnlocked ?? false : false;
  const isFinalWeek = week.weekNumber === weeks.length;
  const visibleTabs = tabs.filter((tab) => tab.segment !== "assignment" || !isFinalWeek);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Week {week.weekNumber}</p>
            <h1 className="text-2xl font-bold md:text-3xl">{week.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{week.theme}</p>
          </div>
          <Badge variant="outline">{week.estimatedStudyTime}</Badge>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold">Learning Objectives</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {week.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {week.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="font-normal">
              {topic}
            </Badge>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="outline" size="sm" disabled={!previousWeekNumber} asChild={Boolean(previousWeekNumber)}>
          {previousWeekNumber ? (
            <Link to={routes.student.masterclassWeek(previousWeekNumber)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Week {previousWeekNumber}
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 h-4 w-4" /> Week
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!nextWeekNumber || !nextAccess}
          asChild={Boolean(nextWeekNumber && nextAccess)}
        >
          {nextWeekNumber && nextAccess ? (
            <Link to={routes.student.masterclassWeek(nextWeekNumber)}>
              Week {nextWeekNumber} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <span>
              {nextWeekNumber ? (
                <>
                  <Lock className="mr-1 h-4 w-4" /> Week {nextWeekNumber}
                </>
              ) : (
                <>
                  Week <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </span>
          )}
        </Button>
      </div>

      <Tabs
        value={activeSegment}
        onValueChange={(segment) =>
          navigate(tabPathBuilders[segment as (typeof tabs)[number]["segment"]](week.weekNumber))
        }
      >
        <div className="overflow-x-auto">
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.segment} value={tab.segment} className="gap-1.5">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <StudentMasterclassWeekProvider week={week}>
        <Outlet />
      </StudentMasterclassWeekProvider>
    </div>
  );
};

export default StudentMasterclassWeekLayout;
