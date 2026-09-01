import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMasterclassResource,
  deleteMasterclassResource,
  readMasterclassResources,
  updateMasterclassResource,
} from "@/lib/masterclass";
import type {
  MasterclassProgram,
  MasterclassResource,
  MasterclassResourceType,
  MasterclassResourceVisibility,
  MasterclassWeek,
} from "@/types/masterclass";

const resourceTypes: MasterclassResourceType[] = [
  "link",
  "github",
  "video",
  "pdf",
  "doc",
  "ppt",
  "image",
  "zip",
  "code",
];
const visibilities: MasterclassResourceVisibility[] = ["enrolled", "public"];

interface ResourceFormState {
  id?: string;
  title: string;
  description: string;
  resourceType: MasterclassResourceType;
  url: string;
  visibility: MasterclassResourceVisibility;
  resourceOrder: number;
  isLiveLink: boolean;
}

const emptyForm = (nextOrder: number): ResourceFormState => ({
  title: "",
  description: "",
  resourceType: "link",
  url: "",
  visibility: "enrolled",
  resourceOrder: nextOrder,
  isLiveLink: false,
});

const AdminMasterclassResourcesPanel = ({
  week,
  program,
}: {
  week: MasterclassWeek;
  program: MasterclassProgram;
}) => {
  const { toast } = useToast();
  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ResourceFormState>(emptyForm(1));
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const rows = await readMasterclassResources(program.id, week.id);
    setResources(rows);
    setForm(emptyForm(rows.length + 1));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const startEdit = (resource: MasterclassResource) => {
    setForm({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      resourceType: resource.resourceType,
      url: resource.url,
      visibility: resource.visibility,
      resourceOrder: resource.resourceOrder,
      isLiveLink: resource.isLiveLink,
    });
  };

  const resetForm = () => setForm(emptyForm(resources.length + 1));

  const saveResource = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast({ title: "Missing fields", description: "Title and URL are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      if (form.id) {
        await updateMasterclassResource(form.id, {
          title: form.title.trim(),
          description: form.description.trim(),
          resourceType: form.resourceType,
          url: form.url.trim(),
          visibility: form.visibility,
          resourceOrder: form.resourceOrder,
          isLiveLink: form.isLiveLink,
        });
        toast({ title: "Resource updated" });
      } else {
        await createMasterclassResource({
          programId: program.id,
          weekId: week.id,
          title: form.title.trim(),
          description: form.description.trim(),
          resourceType: form.resourceType,
          url: form.url.trim(),
          visibility: form.visibility,
          resourceOrder: form.resourceOrder,
          isLiveLink: form.isLiveLink,
        });
        toast({ title: "Resource created" });
      }
      resetForm();
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

  const removeResource = async (resource: MasterclassResource) => {
    if (!window.confirm(`Delete resource "${resource.title}"?`)) return;
    try {
      await deleteMasterclassResource(resource.id);
      toast({ title: "Resource deleted" });
      await load();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          Live Session &amp; Resources &mdash; Week {week.weekNumber}
        </h3>
        <p className="text-sm text-muted-foreground">
          Add the Zoom/Google Meet link (mark it as the live class link) plus any other resources for this week.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources yet.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="capitalize">
                      {resource.resourceType}
                    </Badge>
                    {resource.isLiveLink && <Badge variant="accent">Live Link</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{resource.visibility}</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{resource.title}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(resource)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => void removeResource(resource)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g. Live Class — Zoom"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min={1}
                value={form.resourceOrder}
                onChange={(event) => setForm((prev) => ({ ...prev, resourceOrder: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.resourceType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, resourceType: value as MasterclassResourceType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select
                value={form.visibility}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, visibility: value as MasterclassResourceVisibility }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility} className="capitalize">
                      {visibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
            <Switch
              checked={form.isLiveLink}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isLiveLink: checked }))}
            />
            <span className="text-sm font-medium">This is the live class link (Zoom/Google Meet)</span>
          </label>
          <div className="flex gap-2">
            <Button variant="accent" onClick={() => void saveResource()} disabled={isSaving}>
              {form.id ? (isSaving ? "Saving..." : "Save Changes") : isSaving ? "Creating..." : "Add Resource"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassResourcesPanel;
