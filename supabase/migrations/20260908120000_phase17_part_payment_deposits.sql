-- Phase 17: let a student settle a course fee in one payment or two.
--
-- A student may now pay a course fee in full, or put down a 50% deposit and
-- clear the balance later. An approved deposit grants exactly the same access as
-- paying in full: the balance is chased, never used to gate teaching.
--
-- What a student still owes is DERIVED - course price minus the payments already
-- approved against it - and is deliberately not stored. A stored balance is a
-- second source of truth that drifts the first time a payment is corrected,
-- refunded or deleted, and the payments rows are the record that actually
-- matters. This migration therefore adds no balance column and no totals table.
--
-- The one thing that cannot be derived is which of the two plans the student
-- chose, because "1000 against a 2000 fee" reads the same whether it was meant
-- as a deposit or as an underpayment. Recording the intent lets the admin
-- reviewing an M-Pesa code see what the figure is supposed to be.
--
-- Safe to run more than once.

-- =========================================================================
-- 1) What the payment was meant to be
-- =========================================================================

alter table public.payments
  add column if not exists payment_option text not null default 'full';

do $$
declare
  v_table constant regclass := 'public.payments'::regclass;
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = v_table and conname = 'payments_option_check'
  ) then
    alter table public.payments
      add constraint payments_option_check
      check (payment_option in ('full', 'deposit', 'balance'));
  end if;
end $$;

comment on column public.payments.payment_option is
  'What this payment was submitted as: the whole fee (full), the first half (deposit), or what was left after a deposit (balance). Intent only - the amount column is the money.';

-- Every payment taken before this migration was for the whole fee, which is what
-- the default records. No backfill needed.

-- =========================================================================
-- 2) A student may hold more than one payment per course
-- =========================================================================

-- No unique constraint on (user_id, course_id) ever existed, so a deposit and a
-- balance can already coexist. This index makes the "what has this student paid
-- against this course" lookup - now run on every payment submission rather than
-- only on the admin screen - an index scan rather than a filter over the table.
create index if not exists idx_payments_user_course_status
  on public.payments (user_id, course_id, status);

-- =========================================================================
-- 3) Access is unchanged by the split, and stays admin-gated
-- =========================================================================

-- Deliberately no change to enrollments or to the RLS policies. Students insert
-- their own payment rows and only admins can update them
-- (payments_update_admin), so a student can claim any amount they like and it
-- still buys nothing until an admin has matched it against the M-Pesa
-- transaction and approved it. Approving a deposit sets access_status the same
-- way approving a full payment always has.
