import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ResourceIcon from "@/components/lms/ResourceIcon";
import { useToast } from "@/hooks/use-toast";
import {
  ACCEPTED_FILE_EXTENSIONS,
  createMasterclassResource,
  createResourceSignedUrl,
  deleteMasterclassResource,
  formatFileSize,
  MAX_RESOURCE_BYTES,
  readMasterclassResources,
  replaceMasterclassResource,
  updateMasterclassResource,
  uploadResourceFile,
  validateResourceFile,
} from "@/lib/masterclass";
import {
  groupResourcesByCategory,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_ORDER,
  RESOURCE_TYPE_LABELS,
} from "@/lib/masterclass/resourceDisplay";
import type {
  MasterclassProgram,
  MasterclassResource,
  MasterclassResourceCategory,
  MasterclassResourceType,
  MasterclassResourceVisibility,
  MasterclassWeek,
} from "@/types/masterclass";

const linkTypes: MasterclassResourceType[] = ["link", "github", "video"];
const visibilities: MasterclassResourceVisibility[] = ["enrolled", "public"];

type SourceMode = "file" | "link";

interface ResourceFormState {
  id?: string;
  title: string;
  description: string;
  learningObjective: string;
  category: MasterclassResourceCategory;
  resourceType: MasterclassResourceType;
  url: string;
  visibility: MasterclassResourceVisibility;
  resourceOrder: number;
  isLiveLink: boolean;
  isRequired: boolean;
  isPublished: boolean;
}

const emptyForm = (nextOrder: number): ResourceFormState => ({
  title: "",
  description: "",
  learningObjective: "",
  category: "notes",
  resourceType: "link",
  url: "",
  visibility: "enrolled",
  resourceOrder: nextOrder,
  isLiveLink: false,
  isRequired: false,
  isPublished: true,
});

const AdminMasterclassResourcesPanel = ({
  week,
  program,
}: {
  week: MasterclassWeek;
  program: MasterclassProgram;
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ResourceFormState>(emptyForm(1));
  const [sourceMode, setSourceMode] = useState<SourceMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  /** Set when editing a stored-file resource, so saving can offer a new version. */
  const [editingOriginal, setEditingOriginal] = useState<MasterclassResource | null>(null);

  const groups = useMemo(() => groupResourcesByCategory(resources), [resources]);

  const load = async () => {
    setIsLoading(true);
    const rows = await readMasterclassResources(program.id, week.id);
    setResources(rows);
    setForm(emptyForm(rows.length + 1));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const resetForm = () => {
    setForm(emptyForm(resources.length + 1));
    setSelectedFile(null);
    setFileError(null);
    setEditingOriginal(null);
    setSourceMode("file");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (resource: MasterclassResource) => {
    setForm({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      learningObjective: resource.learningObjective,
      category: resource.category,
      resourceType: resource.resourceType,
      url: resource.url,
      visibility: resource.visibility,
      resourceOrder: resource.resourceOrder,
      isLiveLink: resource.isLiveLink,
      isRequired: resource.isRequired,
      isPublished: resource.isPublished,
    });
    setEditingOriginal(resource.storagePath ? resource : null);
    setSourceMode(resource.storagePath ? "file" : "link");
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileChosen = (file: File | null) => {
    setSelectedFile(null);
    setFileError(null);
    if (!file) return;

    const validation = validateResourceFile(file);
    if (!validation.ok) {
      setFileError(validation.error ?? "This file cannot be uploaded.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setForm((prev) => ({
      ...prev,
      resourceType: validation.resourceType ?? prev.resourceType,
      // Offer the filename as a starting title so the common case is one click.
      title: prev.title || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
    }));
  };

  const saveResource = async () => {
    if (!form.title.trim()) {
      toast({ title: "Missing title", description: "Give the resource a title.", variant: "destructive" });
      return;
    }

    const isNewFileUpload = sourceMode === "file" && selectedFile;
    const keepingExistingFile = sourceMode === "file" && !selectedFile && editingOriginal;

    if (sourceMode === "link" && !form.url.trim()) {
      toast({ title: "Missing URL", description: "A link resource needs a URL.", variant: "destructive" });
      return;
    }
    if (sourceMode === "file" && !selectedFile && !editingOriginal) {
      toast({ title: "No file chosen", description: "Choose a file to upload.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const base = {
        weekId: week.id,
        title: form.title.trim(),
        description: form.description.trim(),
        learningObjective: form.learningObjective.trim(),
        category: form.category,
        visibility: form.visibility,
        resourceOrder: form.resourceOrder,
        isLiveLink: form.isLiveLink,
        isRequired: form.isRequired,
        isPublished: form.isPublished,
      };

      if (isNewFileUpload) {
        const uploaded = await uploadResourceFile({
          file: selectedFile,
          programSlug: program.slug,
          weekNumber: week.weekNumber,
          category: form.category,
        });

        const payload = {
          ...base,
          resourceType: uploaded.resourceType,
          url: "",
          storagePath: uploaded.storagePath,
          fileName: uploaded.fileName,
          fileSize: uploaded.fileSize,
          mimeType: uploaded.mimeType,
        };

        if (editingOriginal) {
          // Replacing a stored file publishes a new version and retires the old
          // row, so nothing a student already opened silently changes underneath.
          await replaceMasterclassResource(editingOriginal, payload);
          toast({
            title: "New version published",
            description: `"${form.title.trim()}" is now version ${editingOriginal.version + 1}.`,
          });
        } else {
          await createMasterclassResource({ ...payload, programId: program.id });
          toast({ title: "Resource uploaded" });
        }
      } else if (keepingExistingFile && form.id) {
        await updateMasterclassResource(form.id, base);
        toast({ title: "Resource updated" });
      } else if (form.id) {
        await updateMasterclassResource(form.id, {
          ...base,
          resourceType: form.resourceType,
          url: form.url.trim(),
        });
        toast({ title: "Resource updated" });
      } else {
        await createMasterclassResource({
          ...base,
          programId: program.id,
          resourceType: form.resourceType,
          url: form.url.trim(),
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

  const togglePublished = async (resource: MasterclassResource) => {
    try {
      await updateMasterclassResource(resource.id, { isPublished: !resource.isPublished });
      toast({ title: resource.isPublished ? "Resource hidden from students" : "Resource published" });
      await load();
    } catch (error) {
      toast({
        title: "Could not change visibility",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const previewResource = async (resource: MasterclassResource) => {
    if (!resource.storagePath) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
      return;
    }
    const url = await createResourceSignedUrl(resource.storagePath);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({ title: "Could not open the file", variant: "destructive" });
    }
  };

  const removeResource = async (resource: MasterclassResource) => {
    if (!window.confirm(`Delete "${resource.title}"? This also removes the stored file.`)) return;
    try {
      await deleteMasterclassResource(resource.id, { storagePath: resource.storagePath });
      toast({ title: "Resource deleted" });
      if (form.id === resource.id) resetForm();
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
          Resources &mdash; Week {week.weekNumber}: {week.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload notes, slides, practicals and reference files, or add a link such as the Zoom or
          Google Meet session. Files are stored privately and only reach enrolled students.
        </p>
      </CardHeader>

      <CardContent className="grid gap-6 lg:grid-cols-5">
        {/* ------------------------------------------------ existing library */}
        <div className="space-y-4 lg:col-span-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading resources...</p>
          ) : groups.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No resources yet for this week.
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.category} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </p>
                {group.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`rounded-xl border p-3 ${
                      resource.isPublished ? "border-border bg-background" : "border-dashed border-muted bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <ResourceIcon resourceType={resource.resourceType} className="h-8 w-8" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{resource.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <Badge variant="outline" className="text-[10px]">
                            {RESOURCE_TYPE_LABELS[resource.resourceType]}
                          </Badge>
                          {resource.isLiveLink && (
                            <Badge variant="accent" className="text-[10px]">
                              Live
                            </Badge>
                          )}
                          {resource.isRequired && (
                            <Badge variant="secondary" className="text-[10px]">
                              Required
                            </Badge>
                          )}
                          {resource.version > 1 && (
                            <Badge variant="secondary" className="text-[10px]">
                              v{resource.version}
                            </Badge>
                          )}
                          {!resource.isPublished && (
                            <Badge variant="destructive" className="text-[10px]">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {resource.visibility === "public" ? "Public" : "Enrolled only"}
                          {resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => startEdit(resource)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void previewResource(resource)}>
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => void togglePublished(resource)}
                        aria-label={resource.isPublished ? "Unpublish" : "Publish"}
                      >
                        {resource.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void removeResource(resource)}
                        aria-label={`Delete ${resource.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ------------------------------------------------------------ form */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={sourceMode === "file" ? "accent" : "outline"}
              onClick={() => setSourceMode("file")}
            >
              Upload a file
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sourceMode === "link" ? "accent" : "outline"}
              onClick={() => setSourceMode("link")}
            >
              Add a link
            </Button>
          </div>

          {sourceMode === "file" ? (
            <div className="space-y-2">
              <Label htmlFor="resource-file">
                {editingOriginal ? "Replace file (optional)" : "File"}
              </Label>
              <Input
                id="resource-file"
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_EXTENSIONS}
                onChange={(event) => onFileChosen(event.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                Up to {formatFileSize(MAX_RESOURCE_BYTES)}. PDF, Word, PowerPoint, spreadsheets,
                images, code, archives, audio and video.
              </p>

              {selectedFile && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 p-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Upload className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-sm">{selectedFile.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onFileChosen(null)}
                    aria-label="Remove selected file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {fileError && <p className="text-sm text-destructive">{fileError}</p>}

              {editingOriginal && !selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Currently: {editingOriginal.fileName}. Choosing a new file publishes version{" "}
                  {editingOriginal.version + 1} and retires the current one.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>URL</Label>
                <Input
                  value={form.url}
                  onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://meet.google.com/... or https://github.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link type</Label>
                <Select
                  value={linkTypes.includes(form.resourceType) ? form.resourceType : "link"}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, resourceType: value as MasterclassResourceType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {linkTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {RESOURCE_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g. CSS Foundations Notes"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, category: value as MasterclassResourceCategory }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_CATEGORY_ORDER.map((category) => (
                    <SelectItem key={category} value={category}>
                      {RESOURCE_CATEGORY_LABELS[category]}
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
                      {visibility === "public" ? "Public" : "Enrolled students only"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min={1}
                value={form.resourceOrder}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, resourceOrder: Number(event.target.value) }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="One line telling students what this is."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Learning objective (optional)</Label>
            <Textarea
              rows={2}
              value={form.learningObjective}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, learningObjective: event.target.value }))
              }
              placeholder="What should a student be able to do after using this?"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <label className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
              <Switch
                checked={form.isRequired}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isRequired: checked }))}
              />
              <span className="text-sm font-medium">Required</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isPublished: checked }))}
              />
              <span className="text-sm font-medium">Published</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
              <Switch
                checked={form.isLiveLink}
                disabled={sourceMode === "file"}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isLiveLink: checked }))}
              />
              <span className="text-sm font-medium">Live class link</span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button variant="accent" onClick={() => void saveResource()} disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : form.id
                  ? selectedFile
                    ? "Publish New Version"
                    : "Save Changes"
                  : "Add Resource"}
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
