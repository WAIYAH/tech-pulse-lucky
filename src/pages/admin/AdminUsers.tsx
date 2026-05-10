import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { lmsProvider } from "@/lib/lms";
import { getCourseById } from "@/data/courses";
import type { AdminUserOverview } from "@/types/lms";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserOverview[]>([]);

  useEffect(() => {
    const load = async () => {
      const rows = await lmsProvider.listUsers();
      setUsers(rows);
      setLoading(false);
    };

    load();
  }, []);

  const totals = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.totalUsers += 1;
        acc.totalEnrollments += user.enrolledCourseIds.length;
        acc.pending += user.pendingEnrollments;
        acc.approved += user.approvedEnrollments;
        acc.rejected += user.rejectedEnrollments;
        return acc;
      },
      {
        totalUsers: 0,
        totalEnrollments: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    );
  }, [users]);

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between gap-3 flex-wrap mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">
                View learners, enrollments, and payment access status.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin">Back to Admin</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totals.totalUsers}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Enrollments</p>
                <p className="text-2xl font-bold">{totals.totalEnrollments}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{totals.approved}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{totals.pending}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{totals.rejected}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Learner List</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-muted-foreground">
                  No users yet. Accounts will appear here after registration.
                </p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="border border-border rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email} • {user.phone || "No phone"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(user.dateJoined).toLocaleDateString("en-KE")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          {user.latestPaymentStatus && (
                            <Badge variant="secondary">{user.latestPaymentStatus}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-4 gap-3 text-sm">
                        <div className="rounded-lg border border-border p-2">
                          Enrolled: <span className="font-semibold">{user.enrolledCourseIds.length}</span>
                        </div>
                        <div className="rounded-lg border border-border p-2">
                          Approved: <span className="font-semibold">{user.approvedEnrollments}</span>
                        </div>
                        <div className="rounded-lg border border-border p-2">
                          Pending: <span className="font-semibold">{user.pendingEnrollments}</span>
                        </div>
                        <div className="rounded-lg border border-border p-2">
                          Rejected: <span className="font-semibold">{user.rejectedEnrollments}</span>
                        </div>
                      </div>

                      {user.enrolledCourseIds.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">
                            Enrolled Courses
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.enrolledCourseIds.map((courseId) => {
                              const course = getCourseById(courseId);
                              return (
                                <Badge key={`${user.id}-${courseId}`} variant="secondary">
                                  {course?.title ?? courseId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsers;

