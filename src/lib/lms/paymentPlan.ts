import type { LmsPayment, PaymentOption } from "@/types/lms";

/**
 * How much of a course fee a student pays, and when.
 *
 * A student either clears the fee in one go or puts down half and settles the
 * rest later. An approved deposit grants the same access as paying in full -
 * the balance is chased, never used to gate teaching - so the only thing the
 * split changes is what the student still owes.
 *
 * Every part of the system derives that from the same two facts: the course
 * price, and the payments already approved against it. Nothing stores a
 * "balance" that could drift out of step with the payments that produced it.
 *
 * This module is shared by the payment page, both providers and the admin
 * views, so a rule stated here cannot be contradicted somewhere else.
 */

export type { PaymentOption };

/** A deposit is half the fee. */
export const DEPOSIT_SHARE = 0.5;

/** Money arrives as `numeric(10,2)`, so keep arithmetic to two places. */
const toMoney = (value: number): number => Math.round(value * 100) / 100;

/**
 * Round a deposit UP to the whole currency unit. On an odd fee that makes the
 * deposit the larger half, so two half payments can never total less than the
 * fee and leave a one-shilling balance nobody will ever pay off.
 */
export const depositAmountFor = (price: number): number => Math.ceil(price * DEPOSIT_SHARE);

/** What has actually been approved against this course for this student. */
export const approvedTotalFor = (payments: LmsPayment[], courseId: string): number =>
  toMoney(
    payments
      .filter((payment) => payment.courseId === courseId && payment.status === "approved")
      .reduce((total, payment) => total + payment.amount, 0),
  );

export const outstandingBalanceFor = (price: number, approvedTotal: number): number =>
  Math.max(0, toMoney(price - approvedTotal));

/**
 * The exact amount a given choice must be paid at.
 *
 * Once anything has been approved, the only remaining choice is the balance -
 * there is no second deposit. That keeps the amount a student is asked for
 * unambiguous, which matters when they have to type it into M-Pesa and an admin
 * has to match it against a transaction code by eye.
 */
export const expectedAmountFor = (
  option: PaymentOption,
  price: number,
  approvedTotal = 0,
): number => {
  if (approvedTotal > 0) return outstandingBalanceFor(price, approvedTotal);
  return option === "deposit" ? depositAmountFor(price) : toMoney(price);
};

export interface PaymentChoice {
  option: PaymentOption;
  amount: number;
  label: string;
  hint: string;
}

export interface PaymentPlan {
  price: number;
  approvedTotal: number;
  outstanding: number;
  /** Nothing left to pay. */
  isSettled: boolean;
  /** Part paid: access is granted, a balance remains. */
  hasBalance: boolean;
  /** What the student may pay right now - empty once the fee is settled. */
  choices: PaymentChoice[];
}

const formatAmount = (currency: string, amount: number): string =>
  `${currency} ${amount.toLocaleString("en-KE")}`;

/**
 * Work out where a student stands on one course, and what they may pay next.
 */
export const paymentPlanFor = (
  course: { id: string; price: number; currency: string },
  payments: LmsPayment[],
): PaymentPlan => {
  const price = toMoney(course.price);
  const approvedTotal = approvedTotalFor(payments, course.id);
  const outstanding = outstandingBalanceFor(price, approvedTotal);

  if (outstanding <= 0) {
    return { price, approvedTotal, outstanding: 0, isSettled: true, hasBalance: false, choices: [] };
  }

  // Part paid: the balance is the only thing left to pay, so it is not a choice
  // so much as the one remaining step.
  if (approvedTotal > 0) {
    return {
      price,
      approvedTotal,
      outstanding,
      isSettled: false,
      hasBalance: true,
      choices: [
        {
          option: "balance",
          amount: outstanding,
          label: "Pay the balance",
          hint: `Clears what is left of your ${formatAmount(course.currency, price)} fee.`,
        },
      ],
    };
  }

  const deposit = depositAmountFor(price);

  return {
    price,
    approvedTotal: 0,
    outstanding,
    isSettled: false,
    hasBalance: false,
    choices: [
      {
        option: "full",
        amount: price,
        label: "Pay in full",
        hint: "Settles the whole fee now. Nothing further to pay.",
      },
      {
        option: "deposit",
        amount: deposit,
        label: "Pay 50% deposit",
        hint: `Starts you on the course today. ${formatAmount(course.currency, toMoney(price - deposit))} remains payable.`,
      },
    ],
  };
};

/**
 * Validate a submitted amount against the plan. Returns an error message, or
 * null when the payment is one the student is actually allowed to make.
 *
 * Both providers call this, so a student cannot bypass the rule by reaching the
 * provider through anything other than the payment page.
 */
export const validatePaymentAmount = (
  option: PaymentOption,
  amount: number,
  course: { id: string; price: number; currency: string },
  existingPayments: LmsPayment[],
): string | null => {
  const plan = paymentPlanFor(course, existingPayments);

  if (plan.isSettled) {
    return "This course fee is already fully paid for your account.";
  }

  const allowed = plan.choices.find((choice) => choice.option === option);
  if (!allowed) {
    return plan.hasBalance
      ? "You have already paid a deposit for this course - the only payment left is the balance."
      : `"${option}" is not a payment option for this course.`;
  }

  if (toMoney(amount) !== allowed.amount) {
    return `${allowed.label} for this course is ${formatAmount(course.currency, allowed.amount)}.`;
  }

  return null;
};

/** How a payment option reads on screen, for students and admins alike. */
export const PAYMENT_OPTION_LABELS: Record<PaymentOption, string> = {
  full: "Paid in full",
  deposit: "50% deposit",
  balance: "Balance",
};
