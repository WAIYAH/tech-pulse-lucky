import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { computeFinalProjectPercent, readAllMasterclassFinalProjects, reviewMasterclassFinalProject } from "@/lib/masterclass";
import type { MasterclassFinalProject } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const AdminMasterclassFinalProjectsTab = () => {
  const { selectedCohort } = useAdminMasterclass();
  const { toast } = useToast();
  const [projects, setProjects] = useState<MasterclassFinalProject[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    if (!selectedCohort) return;
    setIsLoading(true);
    const [rows, users] = await Promise.all([
      readAllMasterclassFinalProjects(selectedCohort.id),
      lmsProvider.listUsers(),
    ]);
    setProjects(rows);
    setNames(Object.fromEntries(users.map((user) => [user.id, user.fullName])));
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
  }, [selectedCohort?.id]);

  const submitReview = async (project: MasterclassFinalProject, approve: boolean) => {
    try {
      await reviewMasterclassFinalProject(project.id, {
        adminFeedback: feedbackDrafts[project.id] ?? "",
        status: approve ? "approved" : project.status,
      });
      toast({ title: approve ? "Project approved" : "Feedback saved" });
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
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Final Projects &mdash; {selectedCohort.cohortLabel}</h2>
        <p className="text-sm text-muted-foreground">
          Students self-report stage progress; only admins can leave feedback or approve.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading final projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No final projects submitted for this cohort yet.</p>
        ) : (
          projects.map((project) => {
            const overall = computeFinalProjectPercent(project.stages);
            return (
              <div key={project.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{names[project.userId] ?? project.userId}</p>
                    <p className="text-xs text-muted-foreground">{project.projectType || "Untitled project"}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{project.problemStatement}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={overall} className="h-2 flex-1" />
                  <span className="text-sm font-semibold">{overall}%</span>
                </div>
                {(project.githubUrl || project.deploymentUrl) && (
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-primary underline">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {project.deploymentUrl && (
                      <a href={project.deploymentUrl} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  <Textarea
                    rows={2}
                    placeholder="Feedback for this student"
                    value={feedbackDrafts[project.id] ?? ""}
                    onChange={(event) =>
                      setFeedbackDrafts((prev) => ({ ...prev, [project.id]: event.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => void submitReview(project, false)}>
                      Save Feedback
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => void submitReview(project, true)}
                      disabled={project.status === "approved"}
                    >
                      Approve Project
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassFinalProjectsTab;
