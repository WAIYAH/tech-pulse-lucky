import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseBySlug } from "@/data/courses";
import { formatKesAmount, lmsConfig } from "@/data/lmsConfig";
import { lmsProvider } from "@/lib/lms";
import { paymentPlanFor } from "@/lib/lms/paymentPlan";
import { isCourseLocked, lockedCourseNotice } from "@/lib/lms/enrollmentFocus";
import { createStudentNotification } from "@/lib/student/studentPortalState";
import { routes } from "@/routes/routeConfig";
import type {
  EnrollmentAccessStatus,
  LmsCourse,
  LmsPayment,
  PaymentOption,
} from "@/types/lms";
import {
  createSafeTextSchema,
  dateNotFutureSchema,
  emailSchema,
  honeypotSchema,
  optionalUrlSchema,
  phoneSchema,
  transactionCodeSchema,
} from "@/lib/validation";

const paymentSchema = z.object({
  fullName: createSafeTextSchema("Full name", 2, 80),
  email: emailSchema,
  phone: phoneSchema,
  transactionCode: transactionCodeSchema,
  paymentDate: dateNotFutureSchema,
  screenshotUrl: optionalUrlSchema,
  website: honeypotSchema.optional().or(z.literal("")),
});

const PaymentPage = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { toast } = useToast();
  const [course, setCourse] = useState<LmsCourse | null>(() =>
    courseSlug ? getCourseBySlug(courseSlug) ?? null : null,
  );
  const [isCourseLoading, setIsCourseLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessStatus, setAccessStatus] = useState<EnrollmentAccessStatus | null>(null);
  const [latestPayment, setLatestPayment] = useState<LmsPayment | null>(null);
  const [coursePayments, setCoursePayments] = useState<LmsPayment[]>([]);
  const [selectedOption, setSelectedOption] = useState<PaymentOption>("full");
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const maxPaymentDate = new Date().toISOString().split("T")[0];
  const courseId = course?.id ?? null;

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

  const [formData, setFormData] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    transactionCode: "",
    paymentDate: "",
    screenshotUrl: "",
    website: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: user?.fullName ?? prev.fullName,
      email: user?.email ?? prev.email,
      phone: user?.phone ?? prev.phone,
    }));
  }, [user?.email, user?.fullName, user?.phone]);

  useEffect(() => {
    const loadStatus = async () => {
      if (!userId || !courseId) {
        setIsStatusLoading(false);
        return;
      }

      const [enrollments, payments] = await Promise.all([
        lmsProvider.getEnrollments(userId),
        lmsProvider.getPaymentsForUser(userId),
      ]);

      const enrollment = enrollments.find((row) => row.courseId === courseId);
      setAccessStatus(enrollment?.accessStatus ?? null);

      // Keep every payment for this course, not just the newest: an approved
      // deposit plus a pending balance is a normal state, and the plan is
      // derived from the whole set.
      const forThisCourse = payments
        .filter((row) => row.courseId === courseId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setCoursePayments(forThisCourse);
      setLatestPayment(forThisCourse[0] ?? null);
      setIsStatusLoading(false);
    };

    loadStatus();
  }, [courseId, userId]);

  // What the student may pay is derived from the payments themselves rather
  // than stored anywhere, so it cannot drift out of step with what has actually
  // been approved.
  const plan = useMemo(
    () => (course ? paymentPlanFor(course, coursePayments) : null),
    [course, coursePayments],
  );

  // Keep the selection on something the plan actually offers: once a deposit is
  // approved the only remaining choice is the balance, so a stale "full"
  // selection must not survive the refresh.
  useEffect(() => {
    if (!plan || plan.choices.length === 0) return;
    setSelectedOption((current) =>
      plan.choices.some((choice) => choice.option === current)
        ? current
        : plan.choices[0].option,
    );
  }, [plan]);

  if (isCourseLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading course payment details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Course not found</h1>
          <p className="text-muted-foreground">
            We could not load payment instructions for this course.
          </p>
        </div>
      </div>
    );
  }

  if (course.isFree) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">This course is free</h1>
          <p className="text-muted-foreground">
            No payment is required for this course.
          </p>
        </div>
      </div>
    );
  }

  if (!user || !plan) {
    return null;
  }

  const selectedChoice =
    plan.choices.find((choice) => choice.option === selectedOption) ?? plan.choices[0] ?? null;
  const amountDue = selectedChoice?.amount ?? plan.outstanding;

  // New payments are refused while the masterclass cohort has the floor, but a
  // student whose access is already approved is never blocked out of their course.
  const isEnrollmentPaused =
    isCourseLocked(course.slug) && accessStatus !== "approved";

  // A payment awaiting review blocks another one, and a settled fee blocks
  // everything. An approved deposit does neither: the balance is still owed, so
  // approved access is no longer on its own a reason to close the form.
  const hasPaymentUnderReview =
    coursePayments.some((payment) => payment.status === "pending") ||
    accessStatus === "pending_payment";

  const isFormLocked = plan.isSettled || hasPaymentUnderReview || isEnrollmentPaused;

  // Say which of the three reasons closed the form - "Submission Locked" tells a
  // student nothing about whether to wait, pay, or come back next cohort.
  const submitLabel = isSubmitting
    ? "Submitting..."
    : plan.isSettled
      ? "Fee fully paid"
      : hasPaymentUnderReview
        ? "Awaiting review"
        : isEnrollmentPaused
          ? "Enrollment paused"
          : plan.hasBalance
            ? "Submit Balance Payment"
            : "Submit Payment Confirmation";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = paymentSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0]?.message ?? "Invalid input.",
        variant: "destructive",
      });
      return;
    }

    if (!course.price || course.price <= 0) {
      toast({
        title: "Invalid Course Price",
        description: "This course price is not configured correctly yet.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedChoice) {
      toast({
        title: "Nothing left to pay",
        description: "This course fee is already fully paid for your account.",
        variant: "destructive",
      });
      return;
    }

    if (isCourseLocked(course.slug)) {
      toast({
        title: "Enrollment paused",
        description: lockedCourseNotice(),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payment = await lmsProvider.submitPaymentRequest({
        userId: user.id,
        courseSlug: course.slug,
        fullName: validation.data.fullName,
        email: validation.data.email,
        phone: validation.data.phone,
        amount: selectedChoice.amount,
        paymentOption: selectedChoice.option,
        transactionCode: validation.data.transactionCode,
        paymentDate: validation.data.paymentDate,
        screenshotUrl: validation.data.screenshotUrl || undefined,
      });
      setLatestPayment(payment);
      setAccessStatus("pending_payment");
      await createStudentNotification({
        userId: user.id,
        title: "Payment request submitted",
        message: `Your payment for "${course.title}" is pending review.`,
        type: "payment",
        actionPath: routes.student.payments,
      });

      toast({
        title: "Payment submitted successfully",
        description:
          "Your access request is now pending review. You will be approved shortly after verification.",
      });

        setFormData((prev) => ({
          ...prev,
          transactionCode: "",
          paymentDate: "",
          screenshotUrl: "",
          website: "",
        }));
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Unable to submit payment details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h1 className="text-3xl font-bold">Pay & Request Access</h1>
                <p className="text-muted-foreground">
                  Course: <span className="font-semibold">{course.title}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Course fee: <span className="font-semibold">{formatKesAmount(plan.price)}</span>
                </p>
                {plan.hasBalance && (
                  <p className="text-muted-foreground">
                    Already paid:{" "}
                    <span className="font-semibold text-foreground">
                      {formatKesAmount(plan.approvedTotal)}
                    </span>{" "}
                    &middot; Balance:{" "}
                    <span className="font-semibold text-foreground">
                      {formatKesAmount(plan.outstanding)}
                    </span>
                  </p>
                )}
                <p>
                  Pay now:{" "}
                  <span className="font-semibold text-primary">{formatKesAmount(amountDue)}</span>
                </p>
                <p>
                  Payment Method:{" "}
                  <span className="font-semibold">{lmsConfig.payment.methodName}</span>
                </p>
                <p>
                  Paybill Number:{" "}
                  <span className="font-semibold">{lmsConfig.payment.paybillNumber}</span>
                </p>
                <p>
                  Account Number:{" "}
                  <span className="font-semibold">{lmsConfig.payment.accountNumber}</span>
                </p>
                <p>
                  Account Name:{" "}
                  <span className="font-semibold">{lmsConfig.payment.accountName}</span>
                </p>
                <div className="border-t pt-4 space-y-2">
                  {lmsConfig.payment.instructionSteps.map((step, index) => (
                    <p key={step} className="text-muted-foreground">
                      {index + 1}.{" "}
                      {step.replace("[COURSE_PRICE]", formatKesAmount(amountDue))}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Payment Confirmation Form</h2>
              </CardHeader>
              <CardContent>
                {isStatusLoading ? (
                  <p className="text-sm text-muted-foreground mb-4">Checking payment status...</p>
                ) : (
                  <div className="mb-4 p-3 rounded-xl border border-border bg-background">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">Current Access Status</p>
                      <Badge variant="secondary">{accessStatus ?? "not_started"}</Badge>
                    </div>
                    {accessStatus === "approved" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {plan.hasBalance
                          ? `Access approved. A balance of ${formatKesAmount(plan.outstanding)} is still payable.`
                          : "Access approved. Continue learning."}
                      </p>
                    )}
                    {accessStatus === "pending_payment" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Your payment is pending review.
                      </p>
                    )}
                    {accessStatus === "rejected" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        This course requires payment approval. Your previous request was rejected, so please submit updated payment details.
                      </p>
                    )}
                    {!accessStatus && (
                      <p className="text-xs text-muted-foreground mt-2">
                        This course requires payment approval.
                      </p>
                    )}
                    {latestPayment?.adminNote && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Admin note: {latestPayment.adminNote}
                      </p>
                    )}
                  </div>
                )}

                {isEnrollmentPaused && (
                  <div className="mb-4 rounded-xl border border-dashed border-border bg-muted/40 p-4">
                    <p className="text-sm font-semibold">Enrollment paused</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lockedCourseNotice()} Please do not send payment for this
                      course yet.
                    </p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={formData.website}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: event.target.value,
                      }))
                    }
                  />
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      maxLength={80}
                      autoComplete="name"
                      required
                      disabled={isFormLocked}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        maxLength={120}
                        autoComplete="email"
                        required
                        disabled={isFormLocked}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, email: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        maxLength={20}
                        autoComplete="tel"
                        required
                        disabled={isFormLocked}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, phone: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {plan.choices.length > 1 && (
                    <fieldset className="space-y-2" disabled={isFormLocked}>
                      <legend className="text-sm font-medium">How much are you paying?</legend>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {plan.choices.map((choice) => {
                          const isSelected = choice.option === selectedOption;
                          return (
                            <button
                              key={choice.option}
                              type="button"
                              onClick={() => setSelectedOption(choice.option)}
                              aria-pressed={isSelected}
                              disabled={isFormLocked}
                              className={`rounded-xl border p-3 text-left transition-colors disabled:opacity-60 ${
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <span className="block text-sm font-semibold">{choice.label}</span>
                              <span className="mt-0.5 block text-lg font-bold text-primary">
                                {formatKesAmount(choice.amount)}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {choice.hint}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A deposit gives you the same access as paying in full - the balance stays
                        payable and you can clear it from this page at any time.
                      </p>
                    </fieldset>
                  )}

                  {plan.hasBalance && (
                    <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
                      <p className="font-semibold">Clearing your balance</p>
                      <p className="mt-1 text-muted-foreground">
                        You have paid {formatKesAmount(plan.approvedTotal)} of the{" "}
                        {formatKesAmount(plan.price)} fee. Pay the remaining{" "}
                        {formatKesAmount(plan.outstanding)} using the details on the left, then
                        confirm it below.
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount Paid</Label>
                      <Input id="amount" type="number" value={amountDue} disabled />
                      <p className="text-xs text-muted-foreground">
                        Pay exactly this amount so it can be matched to your M-Pesa code.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={formData.paymentDate}
                        max={maxPaymentDate}
                        required
                        disabled={isFormLocked}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, paymentDate: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionCode">M-Pesa Transaction Code</Label>
                    <Input
                      id="transactionCode"
                      value={formData.transactionCode}
                      maxLength={16}
                      required
                      disabled={isFormLocked}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            transactionCode: event.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="e.g. QWE123ABC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshotUrl">Screenshot URL (Optional)</Label>
                    <Input
                      id="screenshotUrl"
                      value={formData.screenshotUrl}
                      disabled={isFormLocked}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          screenshotUrl: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isSubmitting || isFormLocked}
                  >
                    {submitLabel}
                  </Button>
                </form>
                <p className="mt-3 text-xs text-muted-foreground">
                  Payment verification is manual. If approved, your status will change to{" "}
                  <span className="font-semibold">Access approved. Continue learning.</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
