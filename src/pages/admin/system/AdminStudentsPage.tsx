import { useEffect, useMemo, useState } from "react";
import { Clock3, GraduationCap, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lmsProvider } from "@/lib/lms";
import { paymentStatusBadgeVariant } from "@/lib/statusBadges";
import type { AdminUserOverview, LmsCourse, LmsRole } from "@/types/lms";

type RoleFilter = "all" | LmsRole;

const AdminStudentsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserOverview[]>([]);
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    const load = async () => {
      const [userRows, courseRows] = await Promise.all([
        lmsProvider.listUsers(),
        lmsProvider.listCourses(),
      ]);

      setUsers(userRows);
      setCourses(courseRows);
      setIsLoading(false);
    };

    load();
  }, []);

  const courseTitleById = useMemo(() => {
    return courses.reduce<Record<string, string>>((acc, course) => {
      acc[course.id] = course.title;
      return acc;
    }, {});
  }, [courses]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [query, roleFilter, users]);

  const totals = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1;
        if (user.role === "admin") acc.admins += 1;
        if (user.role === "student") acc.students += 1;
        if (user.enrolledCourseIds.length > 0) acc.active += 1;
        acc.pending += user.pendingEnrollments;
        return acc;
      },
      { total: 0, admins: 0, students: 0, active: 0, pending: 0 },
    );
  }, [users]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Student Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track learner growth, account health, and enrollment progress from one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-semibold">{totals.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-semibold">{totals.students}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-semibold">{totals.admins}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <ShieldCheck className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
                <p className="text-2xl font-semibold">{totals.active}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Enrollments</p>
                <p className="text-2xl font-semibold">{totals.pending}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <Clock3 className="h-5 w-5 text-amber-600" />
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
                <h2 className="text-xl font-semibold">Learner Directory</h2>
                <p className="text-sm text-muted-foreground">
                  Search users and inspect status of enrollments and payments.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name or email"
                  className="w-full sm:w-[260px]"
                />
                <Select
                  value={roleFilter}
                  onValueChange={(value: RoleFilter) => setRoleFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading students...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users matched your filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Courses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="break-all text-xs text-muted-foreground">{user.email}</p>
                          <p className="break-all text-xs text-muted-foreground">
                            {user.phone || "No phone on file"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.dateJoined).toLocaleDateString("en-KE")}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {user.enrolledCourseIds.length} total
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Approved {user.approvedEnrollments} • Pending {user.pendingEnrollments}
                          </p>
                        </TableCell>
                        <TableCell>
                          {user.latestPaymentStatus ? (
                            <Badge variant={paymentStatusBadgeVariant[user.latestPaymentStatus]}>
                              {user.latestPaymentStatus}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No payments</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.enrolledCourseIds.length === 0 ? (
                              <span className="text-xs text-muted-foreground">None</span>
                            ) : (
                              user.enrolledCourseIds.slice(0, 3).map((courseId) => (
                                <Badge
                                  key={`${user.id}-${courseId}`}
                                  variant="secondary"
                                  className="max-w-[200px] truncate"
                                >
                                  {courseTitleById[courseId] ?? courseId}
                                </Badge>
                              ))
                            )}
                            {user.enrolledCourseIds.length > 3 && (
                              <Badge variant="outline">
                                +{user.enrolledCourseIds.length - 3}
                              </Badge>
                            )}
                          </div>
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

export default AdminStudentsPage;
