import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { updateMasterclassCohort } from "@/lib/masterclass";
import { cohortStatusBadgeVariant, paymentStatusBadgeVariant } from "@/lib/statusBadges";
import type { AdminUserOverview } from "@/types/lms";
import type { MasterclassCohortStatus } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const statusOptions: MasterclassCohortStatus[] = ["upcoming", "active", "completed", "archived"];

const AdminMasterclassCohortsTab = () => {
  const { cohorts, selectedCohortId, selectedCohort, setSelectedCohortId, refresh } = useAdminMasterclass();
  const { toast } = useToast();
  const [roster, setRoster] = useState<AdminUserOverview[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<MasterclassCohortStatus>("upcoming");
  const [maxSeats, setMaxSeats] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedCohort) return;
    setStartDate(selectedCohort.startDate.slice(0, 10));
    setEndDate(selectedCohort.endDate.slice(0, 10));
    setStatus(selectedCohort.status);
    setMaxSeats(selectedCohort.maxSeats ? String(selectedCohort.maxSeats) : "");
  }, [selectedCohort]);

  useEffect(() => {
    let isMounted = true;
    const loadRoster = async () => {
      if (!selectedCohort) {
        setRoster([]);
        return;
      }
      setIsLoadingRoster(true);
      const users = await lmsProvider.listUsers();
      if (!isMounted) return;
      setRoster(users.filter((user) => user.enrolledCourseIds.includes(selectedCohort.courseId)));
      setIsLoadingRoster(false);
    };
    void loadRoster();
    return () => {
      isMounted = false;
    };
  }, [selectedCohort]);

  const saveCohort = async () => {
    if (!selectedCohort) return;
    setIsSaving(true);
    try {
      await updateMasterclassCohort(selectedCohort.id, {
        startDate,
        endDate,
        status,
        maxSeats: maxSeats ? Number(maxSeats) : null,
      });
      toast({ title: "Cohort updated" });
      await refresh();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Cohorts</h2>
          <p className="text-sm text-muted-foreground">
            Select a cohort to manage its dates, status, and roster. New cohorts (2027+) are created by
            adding a new course row and linking it via a new cohort record.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {cohorts.map((cohort) => (
              <Button
                key={cohort.id}
                size="sm"
                variant={cohort.id === selectedCohortId ? "default" : "outline"}
                onClick={() => setSelectedCohortId(cohort.id)}
              >
                {cohort.cohortLabel}
                <Badge variant={cohortStatusBadgeVariant[cohort.status]} className="ml-2 capitalize">
                  {cohort.status}
                </Badge>
              </Button>
            ))}
          </div>

          {selectedCohort && (
            <div className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as MasterclassCohortStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option} className="capitalize">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Seats (optional)</Label>
                <Input
                  type="number"
                  min={0}
                  value={maxSeats}
                  onChange={(event) => setMaxSeats(event.target.value)}
                  placeholder="Unlimited"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <Button variant="accent" onClick={() => void saveCohort()} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Cohort"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Cohort Roster</h2>
          <p className="text-sm text-muted-foreground">
            Students enrolled in {selectedCohort?.cohortLabel ?? "this cohort"}. Approve or reject
            payments from Admin &gt; Payments.
          </p>
        </CardHeader>
        <CardContent>
          {isLoadingRoster ? (
            <p className="text-sm text-muted-foreground">Loading roster...</p>
          ) : roster.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students enrolled in this cohort yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roster.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="break-all">{user.email}</TableCell>
                      <TableCell>
                        {user.latestPaymentStatus ? (
                          <Badge
                            variant={paymentStatusBadgeVariant[user.latestPaymentStatus]}
                            className="capitalize"
                          >
                            {user.latestPaymentStatus}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">&mdash;</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.dateJoined).toLocaleDateString("en-KE")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMasterclassCohortsTab;
