import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMasterclassAssignment,
  readMasterclassAssignmentForWeek,
  updateMasterclassAssignment,
} from "@/lib/masterclass";
import type { MasterclassAssignment, MasterclassWeek } from "@/types/masterclass";

const AdminMasterclassAssignmentPanel = ({ week }: { week: MasterclassWeek }) => {
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<MasterclassAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    title: "Weekly Project",
    brief: "",
    requirements: "",
    submissionInstructions: "Share the GitHub repository link for your project.",
  });
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const row = await readMasterclassAssignmentForWeek(week.id);
    setAssignment(row);
    if (row) {
      setForm({
        title: row.title,
        brief: row.brief,
        requirements: row.requirements,
        submissionInstructions: row.submissionInstructions,
      });
    } else {
      setForm({
        title: "Weekly Project",
        brief: "",
        requirements: "",
        submissionInstructions: "Share the GitHub repository link for your project.",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const saveAssignment = async () => {
    setIsSaving(true);
    try {
      if (assignment) {
        await updateMasterclassAssignment(assignment.id, form);
        toast({ title: "Assignment updated" });
      } else {
        await createMasterclassAssignment(week.id, form);
        toast({ title: "Assignment created" });
      }
      await load();
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

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Weekly Assignment &mdash; Week {week.weekNumber}</h3>
        <p className="text-sm text-muted-foreground">
          Mostly a project brief — student builds something and submits a GitHub link.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Brief</Label>
          <Textarea
            rows={3}
            value={form.brief}
            onChange={(event) => setForm((prev) => ({ ...prev, brief: event.target.value }))}
            placeholder="What should the student build this week?"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Requirements</Label>
          <Textarea
            rows={3}
            value={form.requirements}
            onChange={(event) => setForm((prev) => ({ ...prev, requirements: event.target.value }))}
            placeholder="What must the finished project include?"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Submission Instructions</Label>
          <Textarea
            rows={2}
            value={form.submissionInstructions}
            onChange={(event) => setForm((prev) => ({ ...prev, submissionInstructions: event.target.value }))}
          />
        </div>
        <Button variant="accent" onClick={() => void saveAssignment()} disabled={isSaving}>
          {assignment ? (isSaving ? "Saving..." : "Save Changes") : isSaving ? "Creating..." : "Create Assignment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassAssignmentPanel;
