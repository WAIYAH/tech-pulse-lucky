import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { readAllMasterclassAttendance, recordMasterclassAttendance } from "@/lib/masterclass";
import { attendanceStatusBadgeVariant } from "@/lib/statusBadges";
import type { AdminUserOverview } from "@/types/lms";
import type { MasterclassAttendanceRecord } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdminMasterclassAttendanceTab = () => {
  const { selectedCohort } = useAdminMasterclass();
  const { user } = useAuth();
  const { toast } = useToast();
  const [roster, setRoster] = useState<AdminUserOverview[]>([]);
  const [attendance, setAttendance] = useState<MasterclassAttendanceRecord[]>([]);
  const [sessionDate, setSessionDate] = useState(todayIso());
  const [sessionLabel, setSessionLabel] = useState("Live Session");
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!selectedCohort) return;
    setIsLoading(true);
    const [users, rows] = await Promise.all([
      lmsProvider.listUsers(),
      readAllMasterclassAttendance(selectedCohort.id),
    ]);
    setRoster(users.filter((row) => row.enrolledCourseIds.includes(selectedCohort.courseId)));
    setAttendance(rows);
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCohort?.id]);

  const mark = async (studentId: string, status: "present" | "absent") => {
    if (!selectedCohort || !user) return;
    try {
      await recordMasterclassAttendance({
        cohortId: selectedCohort.id,
        userId: studentId,
        sessionDate,
        sessionLabel,
        status,
        markedBy: user.id,
      });
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const statusFor = (studentId: string) =>
    attendance.find((row) => row.userId === studentId && row.sessionDate === sessionDate)?.status;

  if (!selectedCohort) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">Select a cohort first.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Attendance &mdash; {selectedCohort.cohortLabel}</h2>
        <p className="text-sm text-muted-foreground">
          Attendance contributes to engagement analytics; it does not block course completion.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1.5">
            <Label>Session Date</Label>
            <Input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Session Label</Label>
            <Input value={sessionLabel} onChange={(event) => setSessionLabel(event.target.value)} className="min-w-[200px]" />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading roster...</p>
        ) : roster.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students enrolled in this cohort yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status for {sessionDate}</TableHead>
                  <TableHead>Mark</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((student) => {
                  const status = statusFor(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>
                        {status ? (
                          <Badge variant={attendanceStatusBadgeVariant[status]} className="capitalize">
                            {status}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="success" onClick={() => void mark(student.id, "present")}>
                            Present
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => void mark(student.id, "absent")}>
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassAttendanceTab;
