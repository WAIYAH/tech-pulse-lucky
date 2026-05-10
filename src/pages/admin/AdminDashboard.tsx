import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, BookOpen, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { lmsProvider } from "@/lib/lms";
import type { LmsPayment } from "@/types/lms";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState<LmsPayment[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      const [paymentRows, courseRows] = await Promise.all([
        lmsProvider.getAllPayments(),
        lmsProvider.listCourses(),
      ]);
      setPayments(paymentRows);
      setTotalCourses(courseRows.length);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  const pendingCount = useMemo(
    () => payments.filter((payment) => payment.status === "pending").length,
    [payments],
  );
  const approvedCount = useMemo(
    () => payments.filter((payment) => payment.status === "approved").length,
    [payments],
  );
  const rejectedCount = useMemo(
    () => payments.filter((payment) => payment.status === "rejected").length,
    [payments],
  );

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage course operations and learner payment approvals.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Signed in as: {user?.email}
              </p>
            </div>

            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/admin/payments">Open Payment Approval Queue</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/courses">Manage Courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold">{totalCourses}</p>
                </div>
                <BookOpen className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <CreditCard className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Payments</p>
                  <p className="text-3xl font-bold">{approvedCount}</p>
                </div>
                <Users className="text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected Payments</p>
                  <p className="text-3xl font-bold">{rejectedCount}</p>
                </div>
                <Activity className="text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Recent Payment Submissions</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading payment requests...</p>
            ) : payments.length === 0 ? (
              <p className="text-muted-foreground">
                No payment submissions yet. Requests will appear here once learners submit them.
              </p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 10).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold">{payment.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.email} • {payment.transactionCode}
                      </p>
                    </div>
                    <Badge variant="secondary">{payment.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
