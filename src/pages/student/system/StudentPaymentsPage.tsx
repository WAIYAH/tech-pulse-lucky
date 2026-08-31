import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/routes/routeConfig";
import { useStudentPortal } from "./StudentPortalContext";

const formatMoney = (amount: number, currency = "KES") => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const StudentPaymentsPage = () => {
  const { isLoading, payments, enrollments, courseById } = useStudentPortal();

  const pendingCount = payments.filter((payment) => payment.status === "pending").length;
  const approvedCount = payments.filter((payment) => payment.status === "approved").length;
  const rejectedCount = payments.filter((payment) => payment.status === "rejected").length;

  const requiresAction = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const course = courseById[enrollment.courseId];
      if (!course || course.isFree) return false;
      return enrollment.accessStatus !== "approved";
    });
  }, [courseById, enrollments]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Payments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track all payment submissions and your paid course approval outcomes.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-3xl font-semibold">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-3xl font-semibold">{rejectedCount}</p>
          </CardContent>
        </Card>
      </section>

      {requiresAction.length > 0 && (
        <section>
          <Card className="border-amber-300/50 bg-amber-100/30">
            <CardHeader>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-amber-900">
                <AlertCircle className="h-5 w-5" />
                Action Required
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {requiresAction.map((enrollment) => {
                const course = courseById[enrollment.courseId];
                if (!course) return null;
                return (
                  <div
                    key={enrollment.id}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-amber-300/50 bg-white/70 p-3"
                  >
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-amber-900/80">
                        Access status: {enrollment.accessStatus}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                      <Link to={routes.student.payment(course.slug)}>Open Payment Page</Link>
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Payment History</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading payments...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have not submitted any payment requests yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Admin Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .slice()
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {courseById[payment.courseId]?.title ?? "Course"}
                          </TableCell>
                          <TableCell>{formatMoney(payment.amount, payment.currency)}</TableCell>
                          <TableCell className="break-all">{payment.transactionCode}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{payment.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.paymentDate).toLocaleDateString("en-KE")}
                          </TableCell>
                          <TableCell className="max-w-[260px] break-words text-xs text-muted-foreground">
                            {payment.adminNote ?? "No note"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentPaymentsPage;
