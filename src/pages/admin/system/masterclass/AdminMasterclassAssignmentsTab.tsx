import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import {
  readAllMasterclassAssignmentSubmissions,
  readMasterclassAssignmentForWeek,
  reviewMasterclassAssignmentSubmission,
} from "@/lib/masterclass";
import { assignmentSubmissionStatusBadgeVariant } from "@/lib/statusBadges";
import type { MasterclassAssignment, MasterclassAssignmentSubmission } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const AdminMasterclassAssignmentsTab = () => {
  const { weeks, selectedCohort } = useAdminMasterclass();
  const { toast } = useToast();
  const assignableWeeks = weeks.filter((row) => row.weekNumber !== weeks.length);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(1);
  const week = assignableWeeks.find((row) => row.weekNumber === selectedWeekNumber);

  const [assignment, setAssignment] = useState<MasterclassAssignment | null>(null);
  const [submissions, setSubmissions] = useState<MasterclassAssignmentSubmission[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    if (!week || !selectedCohort) {
      setAssignment(null);
      setSubmissions([]);
      return;
    }
    setIsLoading(true);
    const [assignmentRow, users] = await Promise.all([
      readMasterclassAssignmentForWeek(week.id),
      lmsProvider.listUsers(),
    ]);
    setAssignment(assignmentRow);
    setNames(Object.fromEntries(users.map((user) => [user.id, user.fullName])));

    const rows = assignmentRow
      ? await readAllMasterclassAssignmentSubmissions(selectedCohort.id, assignmentRow.id)
      : [];
    setSubmissions(rows);
    setFeedbackDrafts((prev) => {
      const next = { ...prev };
      rows.forEach((row) => {
        if (!(row.id in next)) next[row.id] = row.adminFeedback ?? "";
      });
      return next;
    });
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week?.id, selectedCohort?.id]);

  const submitFeedback = async (submission: MasterclassAssignmentSubmission) => {
    try {
      await reviewMasterclassAssignmentSubmission(submission.id, feedbackDrafts[submission.id] ?? "");
      toast({ title: "Feedback saved" });
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Assignments &mdash; {selectedCohort.cohortLabel}</h2>
          <p className="text-sm text-muted-foreground">
            Review each week&rsquo;s GitHub submissions and leave feedback. Submitting is self-reported by
            students and does not require your approval to count as complete.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {assignableWeeks.map((row) => (
              <Button
                key={row.id}
                size="sm"
                variant={row.weekNumber === selectedWeekNumber ? "default" : "outline"}
                onClick={() => setSelectedWeekNumber(row.weekNumber)}
              >
                Week {row.weekNumber}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{assignment?.title ?? `Week ${selectedWeekNumber} Assignment`}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading submissions...</p>
          ) : !assignment ? (
            <p className="text-sm text-muted-foreground">
              No assignment has been published for this week yet &mdash; author one from the Curriculum tab.
            </p>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet for this week.</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{names[submission.userId] ?? submission.userId}</p>
                  <Badge variant={assignmentSubmissionStatusBadgeVariant[submission.status]} className="capitalize">
                    {submission.status.replace("_", " ")}
                  </Badge>
                </div>
                {submission.githubUrl && (
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-primary underline"
                  >
                    {submission.githubUrl}
                  </a>
                )}
                {submission.notes && <p className="mt-2 text-sm text-muted-foreground">{submission.notes}</p>}
                <div className="mt-3 space-y-2">
                  <Textarea
                    rows={2}
                    placeholder="Feedback for this student"
                    value={feedbackDrafts[submission.id] ?? ""}
                    onChange={(event) =>
                      setFeedbackDrafts((prev) => ({ ...prev, [submission.id]: event.target.value }))
                    }
                  />
                  <Button size="sm" variant="outline" onClick={() => void submitFeedback(submission)}>
                    Save Feedback
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMasterclassAssignmentsTab;
