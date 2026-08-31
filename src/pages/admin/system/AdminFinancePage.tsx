import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lmsProvider } from "@/lib/lms";
import type { LmsPayment } from "@/types/lms";

const formatMoney = (amount: number, currency = "KES") => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const monthLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    year: "numeric",
  }).format(date);
};

interface MonthlySummary {
  month: string;
  approvedAmount: number;
  pendingAmount: number;
  rejectedAmount: number;
  approvedCount: number;
  totalCount: number;
}

const AdminFinancePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<LmsPayment[]>([]);

  useEffect(() => {
    const load = async () => {
      const paymentRows = await lmsProvider.getAllPayments();
      setPayments(paymentRows);
      setIsLoading(false);
    };

    load();
  }, []);

  const totals = useMemo(() => {
    const submitted = payments.reduce((sum, row) => sum + row.amount, 0);
    const approved = payments
      .filter((row) => row.status === "approved")
      .reduce((sum, row) => sum + row.amount, 0);
    const pending = payments
      .filter((row) => row.status === "pending")
      .reduce((sum, row) => sum + row.amount, 0);
    const rejected = payments
      .filter((row) => row.status === "rejected")
      .reduce((sum, row) => sum + row.amount, 0);
    const conversionRate =
      payments.length === 0
        ? 0
        : (payments.filter((row) => row.status === "approved").length / payments.length) *
          100;

    return { submitted, approved, pending, rejected, conversionRate };
  }, [payments]);

  const monthly = useMemo(() => {
    const byMonth: Record<string, MonthlySummary> = {};

    payments.forEach((payment) => {
      const key = monthLabel(payment.createdAt);
      if (!byMonth[key]) {
        byMonth[key] = {
          month: key,
          approvedAmount: 0,
          pendingAmount: 0,
          rejectedAmount: 0,
          approvedCount: 0,
          totalCount: 0,
        };
      }

      byMonth[key].totalCount += 1;

      if (payment.status === "approved") {
        byMonth[key].approvedAmount += payment.amount;
        byMonth[key].approvedCount += 1;
      } else if (payment.status === "pending") {
        byMonth[key].pendingAmount += payment.amount;
      } else {
        byMonth[key].rejectedAmount += payment.amount;
      }
    });

    return Object.values(byMonth).sort((a, b) => {
      const [monthA, yearA] = a.month.split(" ");
      const [monthB, yearB] = b.month.split(" ");
      const dateA = new Date(`${monthA} 01 ${yearA}`);
      const dateB = new Date(`${monthB} 01 ${yearB}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [payments]);

  const recentApprovals = useMemo(() => {
    return payments
      .filter((row) => row.status === "approved")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8);
  }, [payments]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Finance Operations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue insights for payment submissions, approvals, and monthly performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gross Submitted</p>
                <p className="text-2xl font-semibold">{formatMoney(totals.submitted)}</p>
              </div>
              <Landmark className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Revenue</p>
                <p className="text-2xl font-semibold">{formatMoney(totals.approved)}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Value</p>
                <p className="text-2xl font-semibold">{formatMoney(totals.pending)}</p>
              </div>
              <CalendarDays className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-semibold">
                  {totals.conversionRate.toFixed(1)}%
                </p>
              </div>
              <ArrowDownRight className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Monthly Performance</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading finance analytics...</p>
            ) : monthly.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payment records yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Rejected</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthly.map((row) => {
                      const conversion =
                        row.totalCount === 0
                          ? 0
                          : (row.approvedCount / row.totalCount) * 100;
                      return (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell>{formatMoney(row.approvedAmount)}</TableCell>
                          <TableCell>{formatMoney(row.pendingAmount)}</TableCell>
                          <TableCell>{formatMoney(row.rejectedAmount)}</TableCell>
                          <TableCell>{conversion.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Latest Approvals</h2>
          </CardHeader>
          <CardContent>
            {recentApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No approved payments yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentApprovals.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-lg border border-border bg-background p-3"
                  >
                    <p className="font-medium">{payment.fullName}</p>
                    <p className="break-all text-xs text-muted-foreground">{payment.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="secondary">{payment.status}</Badge>
                      <p className="text-sm font-medium">
                        {formatMoney(payment.amount, payment.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminFinancePage;
