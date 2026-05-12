import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseProgress from "@/components/lms/CourseProgress";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import { getCourseById } from "@/data/courses";
import { routes } from "@/routes/routeConfig";
import type { LmsEnrollment, LmsPayment } from "@/types/lms";

const MyCourses = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<LmsEnrollment[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const [enrollmentRows, paymentRows] = await Promise.all([
        lmsProvider.getEnrollments(user.id),
        lmsProvider.getPaymentsForUser(user.id),
      ]);
      setEnrollments(enrollmentRows);
      setPayments(paymentRows);
      setLoading(false);
    };

    load();
  }, [user]);

  const latestPaymentByCourseId = useMemo(() => {
    return payments.reduce<Record<string, LmsPayment>>((acc, payment) => {
      const existing = acc[payment.courseId];
      if (!existing || existing.createdAt < payment.createdAt) {
        acc[payment.courseId] = payment;
      }
      return acc;
    }, {});
  }, [payments]);

  if (!user) return null;

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Courses</h1>
              <p className="text-muted-foreground mt-2">
                Continue learning, track progress, and manage your paid access status.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to={routes.public.courses}>Browse More Courses</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Enrolled Courses</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading your courses...</p>
              ) : enrollments.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You have not enrolled in any course yet.
                  </p>
                  <Button asChild>
                    <Link to={routes.public.courses}>Explore Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => {
                    const course = getCourseById(enrollment.courseId);
                    const latestPayment = latestPaymentByCourseId[enrollment.courseId];
                    const canAccess =
                      enrollment.accessStatus === "free" ||
                      enrollment.accessStatus === "approved";

                    return (
                      <div
                        key={enrollment.id}
                        className="border border-border rounded-2xl p-4 space-y-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {course?.title ?? "Course"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {course?.duration ?? "Duration not set"} •{" "}
                              {course?.lessonsCount ?? 0} lessons
                            </p>
                          </div>
                          <Badge variant="secondary">{enrollment.accessStatus}</Badge>
                        </div>

                        <CourseProgress value={enrollment.progress} />

                        {latestPayment?.adminNote && (
                          <p className="text-xs text-muted-foreground">
                            Admin note: {latestPayment.adminNote}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {canAccess && course ? (
                            <Button asChild>
                              <Link to={`/learn/${course.slug}`}>
                                {enrollment.progress > 0
                                  ? "Continue Learning"
                                  : "Start Learning"}
                              </Link>
                            </Button>
                          ) : course ? (
                            <Button variant="outline" asChild>
                              <Link to={`/payment/${course.slug}`}>
                                {enrollment.accessStatus === "pending_payment"
                                  ? "Payment Pending Review"
                                  : "Fix Payment Access"}
                              </Link>
                            </Button>
                          ) : null}

                          {course && (
                            <Button variant="ghost" asChild>
                              <Link to={`/courses/${course.slug}`}>Course Details</Link>
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
        </motion.div>
      </div>
    </div>
  );
};

export default MyCourses;
