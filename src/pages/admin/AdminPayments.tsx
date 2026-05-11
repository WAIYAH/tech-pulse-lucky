import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { getCourseById } from "@/data/courses";
import type { LmsPayment, PaymentStatus } from "@/types/lms";

type StatusFilter = "all" | PaymentStatus;

const formatAmount = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString("en-KE")}`;
};

const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [noteByPaymentId, setNoteByPaymentId] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      const rows = await lmsProvider.getAllPayments();
      setPayments(rows);
      setNoteByPaymentId(
        rows.reduce<Record<string, string>>((acc, payment) => {
          acc[payment.id] = payment.adminNote ?? "";
          return acc;
        }, {}),
      );
      setIsLoading(false);
    };

    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (statusFilter === "all") return payments;
    return payments.filter((payment) => payment.status === statusFilter);
  }, [payments, statusFilter]);

  const handleUpdateStatus = async (payment: LmsPayment, status: PaymentStatus) => {
    setUpdatingId(payment.id);
    const adminNote = noteByPaymentId[payment.id]?.trim() || undefined;

    if (status === "rejected" && !adminNote) {
      toast({
        title: "Admin Note Required",
        description: "Please add a reason before rejecting this payment.",
        variant: "destructive",
      });
      setUpdatingId(null);
      return;
    }

    try {
      const updated = await lmsProvider.updatePaymentStatus({
        paymentId: payment.id,
        status,
        adminNote,
      });

      if (!updated) {
        toast({
          title: "Update Failed",
          description: "Payment record was not found.",
          variant: "destructive",
        });
        return;
      }

      setPayments((prev) =>
        prev.map((row) => (row.id === payment.id ? updated : row)),
      );

      toast({
        title: `Payment ${status}`,
        description:
          status === "approved"
            ? "Learner access has been unlocked for this paid course."
            : status === "rejected"
              ? "Learner will see rejection status and admin note."
              : "Payment has been marked as pending.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Unable to update payment status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Payment Approval Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Review learner submissions and approve or reject paid course access.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin">Back to Admin</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Submitted Payments</h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading payment records...</p>
              ) : filteredPayments.length === 0 ? (
                <p className="text-muted-foreground">
                  No payment records found for this filter.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => {
                    const course = getCourseById(payment.courseId);
                    const isUpdating = updatingId === payment.id;

                    return (
                      <div key={payment.id} className="border border-border rounded-2xl p-4 space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-lg">{payment.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.email} • {payment.phone}
                            </p>
                            <p className="text-sm">
                              Course: <span className="font-medium">{course?.title ?? "Unknown course"}</span>
                            </p>
                            <p className="text-sm">
                              Amount:{" "}
                              <span className="font-medium">
                                {formatAmount(payment.amount, payment.currency)}
                              </span>
                            </p>
                            <p className="text-sm">
                              Transaction:{" "}
                              <span className="font-medium">{payment.transactionCode}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Paid on {new Date(payment.paymentDate).toLocaleDateString("en-KE")} •
                              Submitted {new Date(payment.createdAt).toLocaleString("en-KE")}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{payment.status}</Badge>
                            {payment.status === "approved" && (
                              <CheckCircle2 className="text-green-600" size={20} />
                            )}
                            {payment.status === "pending" && (
                              <Clock3 className="text-amber-600" size={20} />
                            )}
                            {payment.status === "rejected" && (
                              <XCircle className="text-red-600" size={20} />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Admin Note</label>
                          <Textarea
                            value={noteByPaymentId[payment.id] ?? ""}
                            onChange={(event) =>
                              setNoteByPaymentId((prev) => ({
                                ...prev,
                                [payment.id]: event.target.value,
                              }))
                            }
                            placeholder="Optional note for learner (required if rejecting is recommended)."
                            rows={3}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handleUpdateStatus(payment, "approved")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Approve Payment"}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleUpdateStatus(payment, "rejected")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Reject Payment"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleUpdateStatus(payment, "pending")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Mark as Pending"}
                          </Button>
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

export default AdminPayments;
