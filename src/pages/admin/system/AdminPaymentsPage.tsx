import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleDollarSign, Clock3, Search, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/student/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { readAdminSettings } from "@/lib/admin/adminState";
import { lmsProvider } from "@/lib/lms";
import { createStudentNotification } from "@/lib/student/studentPortalState";
import { paymentStatusBadgeVariant } from "@/lib/statusBadges";
import { routes } from "@/routes/routeConfig";
import type { LmsCourse, LmsPayment, PaymentStatus } from "@/types/lms";
import noPaymentsImage from "@/assets/empty-states/no-payments.svg";

type StatusFilter = "all" | PaymentStatus;

const formatMoney = (amount: number, currency = "KES") => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusIcon = (status: PaymentStatus) => {
  if (status === "approved") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "rejected") return <XCircle className="h-4 w-4 text-red-600" />;
  return <Clock3 className="h-4 w-4 text-amber-600" />;
};

const AdminPaymentsPage = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const [paymentRows, courseRows] = await Promise.all([
        lmsProvider.getAllPayments(),
        lmsProvider.listCourses(),
      ]);

      setPayments(paymentRows);
      setCourses(courseRows);
      setNotesById(
        paymentRows.reduce<Record<string, string>>((acc, row) => {
          acc[row.id] = row.adminNote ?? "";
          return acc;
        }, {}),
      );
      setIsLoading(false);
    };

    load();
  }, []);

  const courseTitleById = useMemo(() => {
    return courses.reduce<Record<string, string>>((acc, row) => {
      acc[row.id] = row.title;
      return acc;
    }, {});
  }, [courses]);

  const filteredPayments = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesSearch =
        normalized.length === 0 ||
        payment.fullName.toLowerCase().includes(normalized) ||
        payment.email.toLowerCase().includes(normalized) ||
        payment.transactionCode.toLowerCase().includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [payments, search, statusFilter]);

  const summary = useMemo(() => {
    const totalValue = payments.reduce((sum, row) => sum + row.amount, 0);
    const pendingCount = payments.filter((row) => row.status === "pending").length;
    const approvedCount = payments.filter((row) => row.status === "approved").length;
    const rejectedCount = payments.filter((row) => row.status === "rejected").length;
    return {
      totalValue,
      pendingCount,
      approvedCount,
      rejectedCount,
    };
  }, [payments]);

  const handleStatusUpdate = async (payment: LmsPayment, nextStatus: PaymentStatus) => {
    const note = notesById[payment.id]?.trim() || undefined;
    const settings = readAdminSettings();
    if (nextStatus === "rejected" && settings.requireRejectionNote && !note) {
      toast({
        title: "Admin note required",
        description: "Provide a rejection reason before rejecting a payment.",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPaymentId(payment.id);
    try {
      const updated = await lmsProvider.updatePaymentStatus({
        paymentId: payment.id,
        status: nextStatus,
        adminNote: note,
      });

      if (!updated) {
        toast({
          title: "Update failed",
          description: "Unable to locate this payment record.",
          variant: "destructive",
        });
        return;
      }

      const courseTitle = courseTitleById[payment.courseId] ?? "your course";
      const notificationMessage =
        nextStatus === "approved"
          ? `Your payment for "${courseTitle}" was approved. You can continue learning now.`
          : nextStatus === "rejected"
            ? `Your payment for "${courseTitle}" was rejected. Please review admin feedback.`
            : `Your payment for "${courseTitle}" was moved back to pending review.`;

      await createStudentNotification({
        userId: updated.userId,
        title: "Payment status updated",
        message: notificationMessage,
        type: "payment",
        actionPath: routes.student.payments,
      });

      setPayments((prev) => prev.map((row) => (row.id === payment.id ? updated : row)));
      toast({
        title: `Payment ${nextStatus}`,
        description:
          nextStatus === "approved"
            ? "Learner access was updated for this paid course."
            : nextStatus === "rejected"
              ? "Learner will see the rejection reason."
              : "Payment status was moved back to pending.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unable to update payment.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Payment Approvals</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Approve, reject, and audit paid course submissions in real time.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submission Value</p>
                <p className="text-2xl font-semibold">{formatMoney(summary.totalValue)}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">{summary.pendingCount}</p>
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
                <p className="text-2xl font-semibold">{summary.approvedCount}</p>
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
                <p className="text-2xl font-semibold">{summary.rejectedCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Submission Queue</h2>
                <p className="text-sm text-muted-foreground">
                  Filter by status and review transaction details before changing access.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="relative w-full sm:w-[280px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by learner, email, code"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? "default" : "outline"}
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading payment submissions...</p>
            ) : filteredPayments.length === 0 ? (
              <EmptyState image={noPaymentsImage} title="No submissions match this filter" />
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => {
                  const isUpdating = updatingPaymentId === payment.id;
                  return (
                    <div
                      key={payment.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{payment.fullName}</p>
                          <p className="break-all text-sm text-muted-foreground">
                            {payment.email} • {payment.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Course: {courseTitleById[payment.courseId] ?? "Unknown course"}
                          </p>
                          <p className="text-sm">
                            Transaction{" "}
                            <span className="break-all font-medium">{payment.transactionCode}</span> •{" "}
                            {formatMoney(payment.amount, payment.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paid on{" "}
                            {new Date(payment.paymentDate).toLocaleDateString("en-KE")} • Submitted{" "}
                            {new Date(payment.createdAt).toLocaleString("en-KE")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={paymentStatusBadgeVariant[payment.status]} className="capitalize">
                            {payment.status}
                          </Badge>
                          {statusIcon(payment.status)}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Admin Note</p>
                        <Textarea
                          rows={2}
                          value={notesById[payment.id] ?? ""}
                          onChange={(event) =>
                            setNotesById((prev) => ({
                              ...prev,
                              [payment.id]: event.target.value,
                            }))
                          }
                          placeholder="Reason, context, or internal action note."
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          disabled={isUpdating}
                          onClick={() => handleStatusUpdate(payment, "approved")}
                          className="w-full sm:w-auto"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isUpdating}
                          onClick={() => handleStatusUpdate(payment, "rejected")}
                          className="w-full sm:w-auto"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() => handleStatusUpdate(payment, "pending")}
                          className="w-full sm:w-auto"
                        >
                          Mark Pending
                        </Button>
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

export default AdminPaymentsPage;
