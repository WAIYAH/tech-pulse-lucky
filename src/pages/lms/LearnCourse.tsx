import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseProgress from "@/components/lms/CourseProgress";
import LessonSidebar from "@/components/lms/LessonSidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import { isCourseLocked, lockedCourseNotice } from "@/lib/lms/enrollmentFocus";
import { getCourseBySlug } from "@/data/courses";
import { formatKesAmount, lmsConfig } from "@/data/lmsConfig";
import type {
  EnrollmentAccessStatus,
  LmsCourse,
  LmsEnrollment,
  LmsLesson,
  LmsLessonProgress,
  LmsPayment,
} from "@/types/lms";

const toEmbedUrl = (url: string): string => {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("watch?v=")[1]?.split("&")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

const LearnCourse = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<LmsCourse | null>(() =>
    courseSlug ? getCourseBySlug(courseSlug) ?? null : null,
  );
  const [isCourseLoading, setIsCourseLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [enrollment, setEnrollment] = useState<LmsEnrollment | null>(null);
  const [lessonProgressRows, setLessonProgressRows] = useState<LmsLessonProgress[]>([]);
  const [latestPayment, setLatestPayment] = useState<LmsPayment | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  const sortedLessons = useMemo(() => {
    return [...(course?.lessons ?? [])].sort((a, b) => a.lessonOrder - b.lessonOrder);
  }, [course]);

  const selectedLesson = useMemo(() => {
    return sortedLessons.find((lesson) => lesson.id === selectedLessonId) ?? null;
  }, [selectedLessonId, sortedLessons]);

  const completedLessonIds = useMemo(() => {
    return new Set(
      lessonProgressRows
        .filter((row) => row.completed)
        .map((row) => row.lessonId),
    );
  }, [lessonProgressRows]);

  const accessStatus: EnrollmentAccessStatus | null = enrollment?.accessStatus ?? null;

  const canAccessLessons = useMemo(() => {
    if (!course || !user) return false;
    if (user.role === "admin") return true;

    if (course.isFree) {
      return accessStatus === "free" || accessStatus === "approved";
    }

    return accessStatus === "approved";
  }, [accessStatus, course, user]);

  const loadLearnState = async () => {
    if (!user || !course) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const [enrollments, progressRows, payments] = await Promise.all([
      lmsProvider.getEnrollments(user.id),
      lmsProvider.getLessonProgress(user.id, course.slug),
      lmsProvider.getPaymentsForUser(user.id),
    ]);

    const enrollmentForCourse =
      enrollments.find((row) => row.courseId === course.id) ?? null;
    setEnrollment(enrollmentForCourse);
    setLessonProgressRows(progressRows);

    const latestCoursePayment =
      payments
        .filter((row) => row.courseId === course.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
    setLatestPayment(latestCoursePayment);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const localCourse = courseSlug ? getCourseBySlug(courseSlug) ?? null : null;
    setCourse(localCourse);

    if (!courseSlug) {
      setIsCourseLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsCourseLoading(true);
    lmsProvider
      .getCourseBySlug(courseSlug)
      .then((remoteCourse) => {
        if (!isMounted) return;
        setCourse(remoteCourse ?? localCourse);
      })
      .catch(() => {
        if (!isMounted) return;
        setCourse(localCourse);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsCourseLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseSlug]);

  useEffect(() => {
    loadLearnState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id, user?.id]);

  useEffect(() => {
    if (!sortedLessons.length) return;
    if (selectedLessonId && sortedLessons.some((row) => row.id === selectedLessonId)) return;

    const firstIncomplete =
      sortedLessons.find((lesson) => !completedLessonIds.has(lesson.id)) ??
      sortedLessons[0];
    setSelectedLessonId(firstIncomplete.id);
  }, [completedLessonIds, selectedLessonId, sortedLessons]);

  const markLesson = async (lesson: LmsLesson, completed: boolean) => {
    if (!course || !user) return;

    setIsSaving(true);
    try {
      await lmsProvider.markLessonComplete(user.id, course.slug, lesson.id, completed);
      await loadLearnState();
      toast({
        title: completed ? "Lesson marked complete" : "Lesson marked incomplete",
        description: "Your progress has been updated.",
      });
    } catch (error) {
      toast({
        title: "Progress Update Failed",
        description:
          error instanceof Error ? error.message : "Unable to update lesson progress.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnrollFree = async () => {
    if (!course || !user) return;

    if (isCourseLocked(course.slug)) {
      toast({ title: "Enrollment paused", description: lockedCourseNotice() });
      return;
    }

    try {
      await lmsProvider.enrollInFreeCourse(user.id, course.slug);
      await loadLearnState();
      toast({
        title: "Enrollment successful",
        description: "You can now start learning this free course.",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description:
          error instanceof Error ? error.message : "Unable to enroll in this course.",
        variant: "destructive",
      });
    }
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Course not found</h1>
          <p className="text-muted-foreground">This learning path does not exist.</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!canAccessLessons) {
    const isFreeNotEnrolled = course.isFree && !enrollment;
    const isPaidWithoutApproval = !course.isFree && accessStatus !== "approved";

    return (
      <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="text-primary" />
                <h1 className="text-3xl font-bold">Course Access Locked</h1>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <span className="font-semibold">{course.title}</span> is not accessible yet for
                your account.
              </p>

              {isFreeNotEnrolled && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This is a free course. Enroll first to begin learning.
                  </p>
                  <Button onClick={handleEnrollFree}>Enroll for Free</Button>
                </div>
              )}

              {isPaidWithoutApproval && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    This course requires payment approval.
                  </p>
                  <p className="text-sm">
                    Price: <span className="font-semibold">{formatKesAmount(course.price)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <Badge variant="secondary">{accessStatus ?? "not_started"}</Badge>
                  </p>
                  {accessStatus === "pending_payment" && (
                    <p className="text-sm text-muted-foreground">
                      Your payment is pending review.
                    </p>
                  )}
                  {accessStatus === "approved" && (
                    <p className="text-sm text-muted-foreground">
                      Access approved. Continue learning.
                    </p>
                  )}
                  {latestPayment?.adminNote && (
                    <p className="text-sm text-muted-foreground">
                      Admin note: {latestPayment.adminNote}
                    </p>
                  )}
                  <div className="rounded-xl border border-border p-3 text-sm space-y-2">
                    <p className="font-medium">{lmsConfig.payment.methodName} Instructions</p>
                    <p>Paybill: {lmsConfig.payment.paybillNumber}</p>
                    <p>Account Number: {lmsConfig.payment.accountNumber}</p>
                    <p>Account Name: {lmsConfig.payment.accountName}</p>
                  </div>
                  <Button asChild>
                    <Link to={`/payment/${course.slug}`}>
                      {accessStatus === "pending_payment"
                        ? "View Payment Submission"
                        : "Pay & Request Access"}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedLessonIndex = sortedLessons.findIndex(
    (lesson) => lesson.id === selectedLessonId,
  );
  const previousLesson = selectedLessonIndex > 0 ? sortedLessons[selectedLessonIndex - 1] : null;
  const nextLesson =
    selectedLessonIndex >= 0 && selectedLessonIndex < sortedLessons.length - 1
      ? sortedLessons[selectedLessonIndex + 1]
      : null;

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.shortDescription}</p>
          <CourseProgress value={enrollment?.progress ?? 0} />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3">
            <LessonSidebar
              lessons={sortedLessons}
              selectedLessonId={selectedLessonId}
              completedLessonIds={completedLessonIds}
              onSelectLesson={setSelectedLessonId}
            />
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {!selectedLesson ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Select a lesson to begin.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold">
                      Lesson {selectedLesson.lessonOrder}: {selectedLesson.title}
                    </h2>
                    <Badge variant="outline">{selectedLesson.lessonType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedLesson.lessonType === "video" && selectedLesson.videoUrl && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-xl overflow-hidden border border-border">
                        <iframe
                          src={toEmbedUrl(selectedLesson.videoUrl)}
                          title={selectedLesson.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <a
                        href={selectedLesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <PlayCircle size={16} />
                        Open video in new tab
                      </a>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-semibold">Lesson Content</h3>
                    <p className="text-muted-foreground">{selectedLesson.content}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Resources</h3>
                    {selectedLesson.resourceDownloads.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No downloadable resources for this lesson yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedLesson.resourceDownloads.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-primary hover:underline"
                          >
                            {resource.title} ({resource.type.toUpperCase()})
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedLesson.quiz && (
                    <div className="rounded-xl border border-border p-4 space-y-2">
                      <h3 className="font-semibold">Quiz</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.quiz.title} • {selectedLesson.quiz.totalQuestions} questions
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.quiz.instructions}
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        Quiz Submission Coming Soon
                      </Button>
                    </div>
                  )}

                  {selectedLesson.assignment && (
                    <div className="rounded-xl border border-border p-4 space-y-2">
                      <h3 className="font-semibold">Assignment</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.assignment.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.assignment.instructions}
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        Assignment Submission Coming Soon
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Button
                      variant={completedLessonIds.has(selectedLesson.id) ? "outline" : "hero"}
                      onClick={() =>
                        markLesson(
                          selectedLesson,
                          !completedLessonIds.has(selectedLesson.id),
                        )
                      }
                      disabled={isSaving}
                    >
                      {isSaving
                        ? "Saving..."
                        : completedLessonIds.has(selectedLesson.id)
                          ? "Mark as Incomplete"
                          : "Mark Lesson as Complete"}
                    </Button>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        variant="outline"
                        onClick={() => previousLesson && setSelectedLessonId(previousLesson.id)}
                        disabled={!previousLesson}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => nextLesson && setSelectedLessonId(nextLesson.id)}
                        disabled={!nextLesson}
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;
