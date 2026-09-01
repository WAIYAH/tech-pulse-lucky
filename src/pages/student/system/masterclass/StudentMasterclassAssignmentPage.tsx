import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { saveMasterclassAssignmentSubmission, syncMasterclassEnrollmentProgress } from "@/lib/masterclass";
import { assignmentSubmissionStatusBadgeVariant } from "@/lib/statusBadges";
import { useMasterclassStudent } from "./MasterclassStudentProvider";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";
import { useStudentPortal } from "../StudentPortalContext";

const StudentMasterclassAssignmentPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cohort, weeks } = useMasterclassStudent();
  const { assignment, assignmentSubmission, isLoading, refreshWeekData } = useStudentMasterclassWeek();
  const { refresh: refreshStudentPortal } = useStudentPortal();

  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGithubUrl(assignmentSubmission?.githubUrl ?? "");
    setNotes(assignmentSubmission?.notes ?? "");
  }, [assignmentSubmission]);

  const save = async (submit: boolean) => {
    if (!user || !cohort || !assignment) return;

    if (submit && !githubUrl.trim().toLowerCase().startsWith("https://github.com/")) {
      toast({
        title: "GitHub link required",
        description: "Paste a valid GitHub repository URL (starting with https://github.com/) before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveMasterclassAssignmentSubmission({
        userId: user.id,
        cohortId: cohort.id,
        assignmentId: assignment.id,
        githubUrl: githubUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        submit,
      });
      await syncMasterclassEnrollmentProgress({
        userId: user.id,
        courseId: cohort.courseId,
        cohortId: cohort.id,
        weeks,
      });
      await refreshWeekData();
      await refreshStudentPortal();
      toast({ title: submit ? "Project submitted" : "Draft saved" });
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">Loading assignment...</CardContent>
      </Card>
    );
  }

  if (!assignment) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No assignment published for this week yet.
        </CardContent>
      </Card>
    );
  }

  const isSubmitted = assignmentSubmission?.status === "submitted";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{assignment.title}</h2>
            <Badge variant={assignmentSubmissionStatusBadgeVariant[assignmentSubmission?.status ?? "not_started"]}>
              {isSubmitted ? "Submitted" : "Not Submitted"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignment.brief && (
            <div>
              <p className="text-sm font-semibold">Brief</p>
              <p className="mt-1 text-sm text-muted-foreground">{assignment.brief}</p>
            </div>
          )}
          {assignment.requirements && (
            <div>
              <p className="text-sm font-semibold">Requirements</p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{assignment.requirements}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">How to Submit</p>
            <p className="mt-1 text-sm text-muted-foreground">{assignment.submissionInstructions}</p>
          </div>
        </CardContent>
      </Card>

      {assignmentSubmission?.adminFeedback && (
        <Card className="border-accent/40 bg-accent/10">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold">Instructor Feedback</p>
            <p className="mt-1 text-sm text-muted-foreground">{assignmentSubmission.adminFeedback}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Submission</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>GitHub Repository URL</Label>
            <Input
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              placeholder="https://github.com/your-username/your-project"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Anything you'd like your instructor to know about this submission."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => void save(false)} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="accent" onClick={() => void save(true)} disabled={isSaving}>
              {isSaving ? "Submitting..." : isSubmitted ? "Update Submission" : "Submit Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMasterclassAssignmentPage;
