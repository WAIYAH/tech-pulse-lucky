import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { readAllMasterclassCertificates, setMasterclassCertificateStatus } from "@/lib/masterclass";
import { certificateStatusBadgeVariant } from "@/lib/statusBadges";
import type { AdminUserOverview } from "@/types/lms";
import type { MasterclassCertificate, MasterclassCertificateStatus } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const statusOptions: MasterclassCertificateStatus[] = ["not_eligible", "eligible", "issued", "revoked"];

const AdminMasterclassCertificatesTab = () => {
  const { selectedCohort } = useAdminMasterclass();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<MasterclassCertificate[]>([]);
  const [roster, setRoster] = useState<AdminUserOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    if (!selectedCohort) return;
    setIsLoading(true);
    const [certRows, users] = await Promise.all([
      readAllMasterclassCertificates(selectedCohort.id),
      lmsProvider.listUsers(),
    ]);
    setCertificates(certRows);
    setRoster(users.filter((user) => user.enrolledCourseIds.includes(selectedCohort.courseId)));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCohort?.id]);

  const applyStatus = async (userId: string, status: MasterclassCertificateStatus) => {
    if (!selectedCohort) return;
    try {
      await setMasterclassCertificateStatus(userId, selectedCohort.id, status, urlDrafts[userId]);
      toast({ title: "Certificate updated" });
      await load();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <h2 className="text-xl font-semibold">Certificates &mdash; {selectedCohort.cohortLabel}</h2>
        <p className="text-sm text-muted-foreground">
          Set a certificate URL (uploaded elsewhere) and mark eligible/issued. No automated PDF generation.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading roster...</p>
        ) : roster.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students enrolled in this cohort yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[880px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Certificate URL</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((user) => {
                  const certificate = certificates.find((row) => row.userId === user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={certificateStatusBadgeVariant[certificate?.status ?? "not_eligible"]}
                          className="capitalize"
                        >
                          {(certificate?.status ?? "not_eligible").replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="https://..."
                          defaultValue={certificate?.certificateUrl ?? ""}
                          onChange={(event) =>
                            setUrlDrafts((prev) => ({ ...prev, [user.id]: event.target.value }))
                          }
                          className="min-w-[220px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => void applyStatus(user.id, value as MasterclassCertificateStatus)}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Set status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

export default AdminMasterclassCertificatesTab;
