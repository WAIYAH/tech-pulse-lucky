import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock3, CreditCard, User2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lmsProvider } from "@/lib/lms";
import { getCourseById } from "@/data/courses";
import type { LmsEnrollment, LmsPayment } from "@/types/lms";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState<LmsEnrollment[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
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

    loadDashboard();
  }, [user]);

  const pendingPayments = useMemo(
    () => payments.filter((payment) => payment.status === "pending").length,
    [payments],
  );

  const averageProgress = useMemo(() => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
    return Math.round(total / enrollments.length);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, <span className="text-primary">{user.fullName}</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your enrolled courses and payment approvals from one place.
              </p>
            </div>

            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link to="/my-courses">Open My Courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{enrollments.length}</p>
                </div>
                <BookOpen className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Progress</p>
                  <p className="text-3xl font-bold">{averageProgress}%</p>
                </div>
                <Clock3 className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payments Submitted</p>
                  <p className="text-3xl font-bold">{payments.length}</p>
                </div>
                <CreditCard className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold">{pendingPayments}</p>
                </div>
                <User2 className="text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">My Course Access</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading your dashboard...</p>
            ) : enrollments.length === 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You are not enrolled in any course yet. Start with available free learning
                  options.
                </p>
                <Button variant="hero" asChild>
                  <Link to="/webinars">Explore Trainings</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => {
                  const course = getCourseById(enrollment.courseId);
                  const latestPayment = latestPaymentByCourseId[enrollment.courseId];
                  const canAccess =
                    enrollment.accessStatus === "free" ||
                    enrollment.accessStatus === "approved";
                  return (
                    <div
                      key={enrollment.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-border rounded-xl"
                    >
                      <div>
                        <p className="font-semibold">{course?.title ?? "Course"}</p>
                        <p className="text-sm text-muted-foreground">
                          Progress: {enrollment.progress}%
                        </p>
                        {latestPayment && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Payment: {latestPayment.status}
                            {latestPayment.adminNote
                              ? ` • Admin note: ${latestPayment.adminNote}`
                              : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge variant="secondary">{enrollment.accessStatus}</Badge>
                        <div className="flex gap-2">
                          {course && canAccess && (
                            <Button size="sm" asChild>
                              <Link to={`/learn/${course.slug}`}>
                                {enrollment.progress > 0
                                  ? "Continue Learning"
                                  : "Start Learning"}
                              </Link>
                            </Button>
                          )}
                          {course && !course.isFree && enrollment.accessStatus !== "approved" && (
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/payment/${course.slug}`}>View Payment</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
