import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, BadgeCheck, ListChecks, LockKeyhole, Sparkles, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/student/EmptyState";
import ListSkeleton from "@/components/student/ListSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  PROGRAM_SLUG,
  readMasterclassCohorts,
  readMasterclassCertificate,
  readMasterclassProgram,
  resolveCohortForCourseId,
} from "@/lib/masterclass";
import { routes } from "@/routes/routeConfig";
import type { MasterclassCertificate } from "@/types/masterclass";
import { useStudentPortal } from "./StudentPortalContext";
import noCertificatesImage from "@/assets/empty-states/no-certificates.svg";
import allCaughtUpImage from "@/assets/empty-states/all-caught-up.svg";

/**
 * Additive-only: surfaces the real masterclass certificate (if any) alongside the
 * existing generic per-course certificate readiness below, without touching that logic.
 */
const MasterclassCertificateCard = () => {
  const { user } = useAuth();
  const { enrollments, courseById } = useStudentPortal();
  const [certificate, setCertificate] = useState<MasterclassCertificate | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const masterclassEnrollment = enrollments.find((enrollment) => {
    const course = courseById[enrollment.courseId];
    return (
      course?.category === "Masterclass Cohort" &&
      (enrollment.accessStatus === "approved" || enrollment.accessStatus === "free")
    );
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user || !masterclassEnrollment) {
        setIsChecking(false);
        return;
      }
      const program = await readMasterclassProgram(PROGRAM_SLUG);
      if (!program || !isMounted) {
        setIsChecking(false);
        return;
      }
      const cohorts = await readMasterclassCohorts(program.id);
      const cohort = resolveCohortForCourseId(cohorts, masterclassEnrollment.courseId);
      if (!cohort || !isMounted) {
        setIsChecking(false);
        return;
      }
      const row = await readMasterclassCertificate(user.id, cohort.id);
      if (!isMounted) return;
      setCertificate(row);
      setIsChecking(false);
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [user, masterclassEnrollment]);

  if (!masterclassEnrollment || isChecking) return null;

  return (
    <Card className="border-primary/40">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">Web Development Masterclass Certificate</p>
            <p className="text-xs text-muted-foreground capitalize">
              Status: {(certificate?.status ?? "not_eligible").replace("_", " ")}
            </p>
          </div>
        </div>
        {certificate?.status === "issued" && certificate.certificateUrl ? (
          <Button size="sm" variant="success" asChild>
            <a href={certificate.certificateUrl} target="_blank" rel="noreferrer">
              <BadgeCheck className="mr-1 h-4 w-4" /> View Certificate
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            {certificate?.status === "eligible" ? "Awaiting Issuance" : "Not Yet Eligible"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const StudentCertificatesPage = () => {
  const { isLoading, config, enrollments, courseById } = useStudentPortal();

  const eligible = enrollments.filter((enrollment) => {
    const hasAccess =
      enrollment.accessStatus === "approved" || enrollment.accessStatus === "free";
    return hasAccess && enrollment.progress >= 100;
  });

  const inProgress = enrollments.filter((enrollment) => {
    const hasAccess =
      enrollment.accessStatus === "approved" || enrollment.accessStatus === "free";
    return hasAccess && enrollment.progress < 100;
  });

  const lockedCourses = enrollments.filter((enrollment) => {
    return enrollment.accessStatus !== "approved" && enrollment.accessStatus !== "free";
  });

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Certificates</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View certificate readiness and completion achievements for finished courses.
        </p>
      </section>

      <MasterclassCertificateCard />

      {!config.featureFlags.enableCertificates && (
        <section>
          <Card className="border-amber-300/50 bg-amber-100/30">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900">
                Certificate issuance is currently disabled in LMS settings. Your completion
                progress is still tracked and readiness is shown below.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eligible Certificates</p>
                <p className="text-3xl font-semibold">{eligible.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses In Progress</p>
                <p className="text-3xl font-semibold">{inProgress.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <TimerReset className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feature Status</p>
                <p className="text-lg font-semibold">
                  {config.featureFlags.enableCertificates ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Eligible Now</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton rows={3} />
            ) : eligible.length === 0 ? (
              <EmptyState
                image={noCertificatesImage}
                title="No completed courses yet"
                description="Finish a course to unlock certificate readiness."
              />
            ) : (
              <div className="space-y-3">
                {eligible.map((enrollment) => {
                  const course = courseById[enrollment.courseId];
                  return (
                    <div
                      key={enrollment.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{course?.title ?? "Course"}</p>
                        <Badge variant="success">100%</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Completion achieved on this learning path.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                          <BadgeCheck className="mr-1 h-4 w-4" />
                          Download Certificate (Coming Soon)
                        </Button>
                        {course ? (
                          <Button size="sm" variant="ghost" asChild className="w-full sm:w-auto">
                            <Link to={routes.student.learn(course.slug)}>Review Course</Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Next Certificates</h2>
          </CardHeader>
          <CardContent>
            {inProgress.length === 0 ? (
              lockedCourses.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Unlock your pending paid courses to continue toward certificate eligibility.
                </p>
              ) : (
                <EmptyState image={allCaughtUpImage} title="You are caught up" description="All enrolled courses are complete." />
              )
            ) : (
              <div className="space-y-3">
                {inProgress
                  .slice()
                  .sort((a, b) => b.progress - a.progress)
                  .map((enrollment) => {
                    const course = courseById[enrollment.courseId];
                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{course?.title ?? "Course"}</p>
                          <Badge variant="accent">{enrollment.progress}%</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Complete this course to unlock certificate eligibility.
                        </p>
                        <div className="mt-3">
                          {course ? (
                            <Button size="sm" asChild className="w-full sm:w-auto">
                              <Link to={routes.student.learn(course.slug)}>
                                <Award className="mr-1 h-4 w-4" />
                                Continue Learning
                              </Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="w-full sm:w-auto">
                              <LockKeyhole className="mr-1 h-4 w-4" />
                              Course unavailable
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentCertificatesPage;
