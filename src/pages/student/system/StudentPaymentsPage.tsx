import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, Copy, Smartphone, XCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { lmsConfig } from "@/data/lmsConfig";
import { routes } from "@/routes/routeConfig";
import { paymentStatusBadgeVariant } from "@/lib/statusBadges";
import { useStudentPortal } from "./StudentPortalContext";
import EmptyState from "@/components/student/EmptyState";
import ListSkeleton from "@/components/student/ListSkeleton";
import noPaymentsImage from "@/assets/empty-states/no-payments.svg";

const formatMoney = (amount: number, currency = "KES") => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const StudentPaymentsPage = () => {
  const { isLoading, payments, enrollments, courseById } = useStudentPortal();
  const { toast } = useToast();

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, description: value });
    } catch {
      toast({
        title: "Couldn't copy",
        description: `${label}: ${value}`,
        variant: "destructive",
      });
    }
  };

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
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Payments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track all payment submissions and your paid course approval outcomes.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-semibold">{pendingCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-semibold">{approvedCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-semibold">{rejectedCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-hero text-primary-foreground">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Smartphone className="h-5 w-5" />
              How to Pay
            </h2>
            <p className="text-sm text-primary-foreground/85">
              {lmsConfig.payment.methodName} — use these details for any paid course.
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Paybill Number
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="font-mono text-2xl font-bold text-primary">
                    {lmsConfig.payment.paybillNumber}
                  </p>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Copy paybill number"
                    onClick={() => copyValue("Paybill number", lmsConfig.payment.paybillNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Account Number
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="font-mono text-2xl font-bold text-primary">
                    {lmsConfig.payment.accountNumber}
                  </p>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Copy account number"
                    onClick={() => copyValue("Account number", lmsConfig.payment.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Account Name
                </p>
                <p className="mt-1 font-semibold">{lmsConfig.payment.accountName}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Steps
              </p>
              <ol className="space-y-1.5 text-sm">
                {lmsConfig.payment.instructionSteps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-semibold text-primary">{index + 1}.</span>
                    <span className="text-foreground">
                      {step.replace("[COURSE_PRICE]", "your course's price")}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                To submit your M-Pesa transaction code, open the payment page from the
                specific course in{" "}
                <Link to={routes.student.myCourses} className="font-medium text-primary hover:underline">
                  My Courses
                </Link>
                .
              </p>
            </div>
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
                    <Button size="sm" variant="destructive" asChild className="w-full sm:w-auto">
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
              <ListSkeleton rows={4} />
            ) : payments.length === 0 ? (
              <EmptyState image={noPaymentsImage} title="You have not submitted any payment requests yet" />
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
                            <Badge variant={paymentStatusBadgeVariant[payment.status]}>
                              {payment.status}
                            </Badge>
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
