import { useMemo, useState } from "react";
import { Download, ExternalLink, Eye, FolderOpen, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ResourceIcon from "@/components/lms/ResourceIcon";
import ResourceViewerDialog from "@/components/lms/ResourceViewerDialog";
import { createResourceSignedUrl, formatFileSize } from "@/lib/masterclass";
import {
  groupResourcesByCategory,
  isStoredFile,
  RESOURCE_TYPE_LABELS,
} from "@/lib/masterclass/resourceDisplay";
import type { MasterclassResource } from "@/types/masterclass";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";

const StudentMasterclassLiveAndResourcesPage = () => {
  const { liveLinkResource, resources, isLoading, week } = useStudentMasterclassWeek();
  const [activeResource, setActiveResource] = useState<MasterclassResource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const groups = useMemo(() => groupResourcesByCategory(resources), [resources]);
  const requiredCount = useMemo(
    () => resources.filter((resource) => resource.isRequired).length,
    [resources],
  );

  const openResource = (resource: MasterclassResource) => {
    setActiveResource(resource);
    setIsViewerOpen(true);
  };

  // Downloads need a fresh signed URL, so the link is minted on click rather
  // than held in the page where it would expire while the student reads.
  const downloadResource = async (resource: MasterclassResource) => {
    if (!resource.storagePath) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
      return;
    }
    const url = await createResourceSignedUrl(resource.storagePath, {
      download: resource.fileName ?? true,
    });
    if (url) window.location.href = url;
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/40 bg-accent/10">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
              <Video className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{liveLinkResource ? liveLinkResource.title : "Live Class"}</p>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : liveLinkResource
                    ? liveLinkResource.description || "Join the live session for this week."
                    : "No live session scheduled for this week yet."}
              </p>
            </div>
          </div>
          {liveLinkResource && (
            <Button variant="accent" asChild>
              <a href={liveLinkResource.url} target="_blank" rel="noreferrer noopener">
                Join Live Class <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">Week {week.weekNumber} Resources</h2>
              <p className="text-sm text-muted-foreground">
                Everything you need for this week, grouped by how you will use it.
              </p>
            </div>
            {requiredCount > 0 && (
              <Badge variant="accent">{requiredCount} required</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-7">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading resources...</p>
          ) : groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No resources for this week yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your instructor adds materials as the week opens. Check back shortly.
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.category} className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {group.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">{group.hint}</p>
                </div>

                <ul className="space-y-2">
                  {group.resources.map((resource) => (
                    <li
                      key={resource.id}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <ResourceIcon resourceType={resource.resourceType} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-semibold">{resource.title}</p>
                            {resource.isRequired && (
                              <Badge variant="accent" className="text-[10px]">
                                Required
                              </Badge>
                            )}
                            {resource.version > 1 && (
                              <Badge variant="secondary" className="text-[10px]">
                                v{resource.version}
                              </Badge>
                            )}
                          </div>
                          {resource.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{resource.description}</p>
                          )}
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                            {RESOURCE_TYPE_LABELS[resource.resourceType]}
                            {resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="outline" onClick={() => openResource(resource)}>
                          <Eye className="mr-1.5 h-4 w-4" />
                          View
                        </Button>
                        {isStoredFile(resource) ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => void downloadResource(resource)}
                            aria-label={`Download ${resource.title}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" asChild aria-label={`Open ${resource.title}`}>
                            <a href={resource.url} target="_blank" rel="noreferrer noopener">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </CardContent>
      </Card>

      <ResourceViewerDialog
        resource={activeResource}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />
    </div>
  );
};

export default StudentMasterclassLiveAndResourcesPage;
