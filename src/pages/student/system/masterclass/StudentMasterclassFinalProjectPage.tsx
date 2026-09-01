import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  computeFinalProjectPercent,
  readMasterclassFinalProject,
  saveMasterclassFinalProject,
  syncMasterclassEnrollmentProgress,
} from "@/lib/masterclass";
import { finalProjectStatusBadgeVariant } from "@/lib/statusBadges";
import type { MasterclassFinalProject, MasterclassFinalProjectStages } from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";
import { useStudentPortal } from "../StudentPortalContext";

const defaultStages: MasterclassFinalProjectStages = {
  proposal: 0,
  requirements: 0,
  ui: 0,
  database: 0,
  development: 0,
  testing: 0,
  deployment: 0,
};

const stageLabels: Array<{ key: keyof MasterclassFinalProjectStages; label: string }> = [
  { key: "proposal", label: "Proposal" },
  { key: "requirements", label: "Requirements" },
  { key: "ui", label: "UI Design" },
  { key: "database", label: "Database" },
  { key: "development", label: "Development" },
  { key: "testing", label: "Testing" },
  { key: "deployment", label: "Deployment" },
];

const StudentMasterclassFinalProjectPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cohort, weeks, hasAccess, isLoading: isPortalLoading } = useMasterclassStudent();
  const { refresh: refreshStudentPortal } = useStudentPortal();

  const [project, setProject] = useState<MasterclassFinalProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [projectType, setProjectType] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [requirements, setRequirements] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [stages, setStages] = useState<MasterclassFinalProjectStages>(defaultStages);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user || !cohort || !hasAccess) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const row = await readMasterclassFinalProject(user.id, cohort.id);
      if (!isMounted) return;
      setProject(row);
      if (row) {
        setProjectType(row.projectType);
        setProblemStatement(row.problemStatement);
        setTargetUsers(row.targetUsers);
        setRequirements(row.requirements);
        setGithubUrl(row.githubUrl ?? "");
        setDeploymentUrl(row.deploymentUrl ?? "");
        setStages(row.stages);
      }
      setIsLoading(false);
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [user?.id, cohort?.id, hasAccess]);

  const save = async (submit: boolean) => {
    if (!user || !cohort) return;
    setIsSaving(true);
    try {
      const saved = await saveMasterclassFinalProject({
        userId: user.id,
        cohortId: cohort.id,
        projectType,
        problemStatement,
        targetUsers,
        requirements,
        githubUrl: githubUrl || undefined,
        deploymentUrl: deploymentUrl || undefined,
        stages,
        status: submit ? "submitted" : project?.status === "not_started" || !project ? "in_progress" : (project.status as "in_progress" | "submitted"),
      });
      setProject(saved);
      await syncMasterclassEnrollmentProgress({
        userId: user.id,
        courseId: cohort.courseId,
        cohortId: cohort.id,
        weeks,
      });
      await refreshStudentPortal();
      toast({ title: submit ? "Project submitted for review" : "Progress saved" });
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

  if (isPortalLoading || isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading your final project...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Enroll and get approved to start your final capstone project.
      </div>
    );
  }

  const overall = computeFinalProjectPercent(stages);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Final Capstone Project</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build, test, document, deploy, and present a complete application.
            </p>
          </div>
          {project && (
            <Badge variant={finalProjectStatusBadgeVariant[project.status]} className="capitalize">
              {project.status.replace("_", " ")}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={overall} className="h-2 flex-1" />
          <span className="text-sm font-semibold">{overall}%</span>
        </div>
      </section>

      {project?.adminFeedback && (
        <section className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
          <p className="text-sm font-semibold">Instructor Feedback</p>
          <p className="mt-1 text-sm text-muted-foreground">{project.adminFeedback}</p>
        </section>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Project Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Project Type</Label>
              <Input
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
                placeholder="e.g. Student Management System"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Users</Label>
              <Input value={targetUsers} onChange={(event) => setTargetUsers(event.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Problem Statement</Label>
            <Textarea rows={3} value={problemStatement} onChange={(event) => setProblemStatement(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea rows={3} value={requirements} onChange={(event) => setRequirements(event.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>GitHub Repository URL</Label>
              <Input value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Live Deployment URL</Label>
              <Input value={deploymentUrl} onChange={(event) => setDeploymentUrl(event.target.value)} placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Stage Progress</h2>
          <p className="text-sm text-muted-foreground">Update each stage as you complete it.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {stageLabels.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{stages[key]}%</span>
              </div>
              <Slider
                value={[stages[key]]}
                max={100}
                step={5}
                onValueChange={([value]) => setStages((prev) => ({ ...prev, [key]: value }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => void save(false)} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Progress"}
        </Button>
        <Button
          variant="accent"
          onClick={() => void save(true)}
          disabled={isSaving || project?.status === "approved"}
        >
          Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default StudentMasterclassFinalProjectPage;
