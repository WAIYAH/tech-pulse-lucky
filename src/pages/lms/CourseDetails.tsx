import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock3, Layers3, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import { getCourseBySlug } from "@/data/courses";
import { lmsConfig, formatKesAmount } from "@/data/lmsConfig";
import type { EnrollmentAccessStatus, LmsPayment } from "@/types/lms";

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [accessStatus, setAccessStatus] = useState<EnrollmentAccessStatus | null>(null);
  const [latestPayment, setLatestPayment] = useState<LmsPayment | null>(null);
  const [isAccessLoading, setIsAccessLoading] = useState(false);

  const course = useMemo(() => (slug ? getCourseBySlug(slug) : undefined), [slug]);
  const sortedCurriculum = useMemo(
    () => [...(course?.lessons ?? [])].sort((a, b) => a.lessonOrder - b.lessonOrder),
    [course?.lessons],
  );

  useEffect(() => {
    const loadAccessState = async () => {
      if (!user || !course) {
        setAccessStatus(null);
        setLatestPayment(null);
        return;
      }

      setIsAccessLoading(true);
      const [enrollments, payments] = await Promise.all([
        lmsProvider.getEnrollments(user.id),
        lmsProvider.getPaymentsForUser(user.id),
      ]);

      const enrollment = enrollments.find((row) => row.courseId === course.id);
      setAccessStatus(enrollment?.accessStatus ?? null);

      const latestCoursePayment =
        payments
          .filter((row) => row.courseId === course.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
      setLatestPayment(latestCoursePayment);
      setIsAccessLoading(false);
    };

    loadAccessState();
  }, [course, user]);

  if (!course) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested course could not be found.
          </p>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleEnrollFree = async () => {
    if (!isAuthenticated || !user) {
      navigate("/register", { state: { from: `/courses/${course.slug}` } });
      return;
    }

    setIsEnrolling(true);
    try {
      await lmsProvider.enrollInFreeCourse(user.id, course.slug);
      toast({
        title: "Enrollment successful",
        description: "You can now access this free course from your dashboard.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description:
          error instanceof Error ? error.message : "Unable to enroll in this course.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaidCTA = () => {
    if (!isAuthenticated) {
      navigate("/register", { state: { from: `/courses/${course.slug}` } });
      return;
    }

    navigate(`/payment/${course.slug}`);
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/20 h-64">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant={course.isFree ? "secondary" : "default"}>
                    {course.isFree ? "FREE COURSE" : "PAID MASTERCLASS"}
                  </Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground text-lg">{course.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Learning Outcomes</h2>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.learningOutcomes.map((outcome) => (
                    <p key={outcome} className="text-muted-foreground">
                      • {outcome}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Course Curriculum</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sortedCurriculum.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border border-border rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <p className="font-medium">
                          {lesson.lessonOrder}. {lesson.title}
                        </p>
                        <Badge variant="outline">{lesson.lessonType}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Requirements</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {course.requirements.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground">
                        • {item}
                      </p>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Target Audience</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {course.targetAudience.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground">
                        • {item}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <h2 className="text-2xl font-bold">
                    {course.isFree ? "Enroll Free" : formatKesAmount(course.price)}
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User2 size={16} className="text-primary" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers3 size={16} className="text-primary" />
                      <span>{course.lessonsCount} lessons</span>
                    </div>
                  </div>

                  {course.isFree ? (
                    accessStatus === "free" ? (
                      <div className="space-y-2">
                        <Button variant="hero" className="w-full" disabled>
                          Already Enrolled
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/dashboard">Open Dashboard</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="hero"
                        className="w-full"
                        disabled={isEnrolling}
                        onClick={handleEnrollFree}
                      >
                        {isEnrolling ? "Enrolling..." : "Enroll for Free"}
                      </Button>
                    )
                  ) : isAccessLoading ? (
                    <Button className="w-full" disabled>
                      Checking access...
                    </Button>
                  ) : accessStatus === "approved" ? (
                    <div className="space-y-2">
                      <Button variant="hero" className="w-full" asChild>
                        <Link to="/dashboard">Access Approved • Open Dashboard</Link>
                      </Button>
                    </div>
                  ) : accessStatus === "pending_payment" ? (
                    <div className="space-y-2">
                      <Button className="w-full" disabled>
                        Payment Pending Approval
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/payment/${course.slug}`}>View Submission</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={handlePaidCTA}>
                      {accessStatus === "rejected"
                        ? "Resubmit Payment Request"
                        : "Pay & Request Access"}
                    </Button>
                  )}

                  {latestPayment?.adminNote && (
                    <p className="text-xs text-muted-foreground border-t pt-3">
                      Admin note: {latestPayment.adminNote}
                    </p>
                  )}
                </CardContent>
              </Card>

              {!course.isFree && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">Payment Instructions</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">
                      Method: <span className="font-semibold">{lmsConfig.payment.methodName}</span>
                    </p>
                    <p className="text-sm">
                      Paybill:{" "}
                      <span className="font-semibold">{lmsConfig.payment.paybillNumber}</span>
                    </p>
                    <p className="text-sm">
                      Account:{" "}
                      <span className="font-semibold">{lmsConfig.payment.accountNumber}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      After payment, submit your M-Pesa transaction code for admin approval.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold">Course FAQ</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.faqs.map((faq) => (
                    <div key={faq.question}>
                      <p className="font-semibold text-sm">{faq.question}</p>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetails;
