import { useEffect, useState } from "react";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { lmsProvider } from "@/lib/lms";
import { createMasterclassAnnouncement, deleteMasterclassAnnouncement, readMasterclassAnnouncements } from "@/lib/masterclass";
import type { AdminUserOverview } from "@/types/lms";
import type { MasterclassAnnouncement } from "@/types/masterclass";
import { useAdminMasterclass } from "./AdminMasterclassProvider";

const AdminMasterclassAnnouncementsTab = () => {
  const { selectedCohort, weeks } = useAdminMasterclass();
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<MasterclassAnnouncement[]>([]);
  const [roster, setRoster] = useState<AdminUserOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"cohort" | "week" | "student">("cohort");
  const [weekNumber, setWeekNumber] = useState<string>("1");
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    if (!selectedCohort) return;
    setIsLoading(true);
    const [rows, users] = await Promise.all([
      readMasterclassAnnouncements(selectedCohort.id),
      lmsProvider.listUsers(),
    ]);
    setAnnouncements(rows);
    setRoster(users.filter((row) => row.enrolledCourseIds.includes(selectedCohort.courseId)));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCohort?.id]);

  const submit = async () => {
    if (!selectedCohort || !user) return;
    if (!title.trim() || !message.trim()) {
      toast({ title: "Missing fields", description: "Title and message are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const week = scope === "week" ? weeks.find((row) => row.weekNumber === Number(weekNumber)) : undefined;
      await createMasterclassAnnouncement({
        cohortId: selectedCohort.id,
        weekId: scope === "week" ? week?.id : undefined,
        targetUserId: scope === "student" ? targetUserId || undefined : undefined,
        title: title.trim(),
        message: message.trim(),
        isPinned,
        createdBy: user.id,
      });
      toast({ title: "Announcement published" });
      setTitle("");
      setMessage("");
      setIsPinned(false);
      await load();
    } catch (error) {
      toast({
        title: "Publish failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (announcement: MasterclassAnnouncement) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteMasterclassAnnouncement(announcement.id);
      toast({ title: "Announcement deleted" });
      await load();
    } catch (error) {
      toast({
        title: "Delete failed",
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
          <h2 className="text-xl font-semibold">New Announcement &mdash; {selectedCohort.cohortLabel}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={scope} onValueChange={(value) => setScope(value as typeof scope)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cohort">Entire cohort</SelectItem>
                  <SelectItem value="week">Specific week</SelectItem>
                  <SelectItem value="student">Specific student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {scope === "week" && (
              <div className="space-y-1.5">
                <Label>Week</Label>
                <Select value={weekNumber} onValueChange={setWeekNumber}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((week) => (
                      <SelectItem key={week.id} value={String(week.weekNumber)}>
                        Week {week.weekNumber}: {week.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {scope === "student" && (
              <div className="space-y-1.5">
                <Label>Student</Label>
                <Select value={targetUserId} onValueChange={setTargetUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {roster.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isPinned} onCheckedChange={setIsPinned} />
            <Label>Pin to top</Label>
          </div>
          <Button variant="accent" onClick={() => void submit()} disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish Announcement"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Published Announcements</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {announcement.isPinned && (
                      <Badge variant="accent" className="gap-1">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </Badge>
                    )}
                    <p className="font-semibold">{announcement.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(announcement.publishedAt).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{announcement.message}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">
                    {announcement.targetUserId
                      ? "Student-specific"
                      : announcement.weekId
                        ? "Week-specific"
                        : "Cohort-wide"}
                  </Badge>
                  <Button size="sm" variant="destructive" onClick={() => void remove(announcement)}>
                    Delete
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

export default AdminMasterclassAnnouncementsTab;
