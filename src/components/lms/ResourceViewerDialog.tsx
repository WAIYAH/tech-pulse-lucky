import { useCallback, useEffect, useState } from "react";
import { Download, ExternalLink, Loader2, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResourceIcon from "@/components/lms/ResourceIcon";
import { canPreviewInBrowser, createResourceSignedUrl, formatFileSize } from "@/lib/masterclass";
import { RESOURCE_TYPE_LABELS } from "@/lib/masterclass/resourceDisplay";
import type { MasterclassResource } from "@/types/masterclass";

/**
 * Opens a resource without forcing a download where the browser can render it.
 *
 * Stored files are reached through a short-lived signed URL minted on open, so
 * nothing durable is ever embedded in the page and an unauthorised viewer gets
 * an error rather than a working link.
 */
const ResourceViewerDialog = ({
  resource,
  open,
  onOpenChange,
}: {
  resource: MasterclassResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!resource) return;

    setIsLoading(true);
    setError(null);
    setViewUrl(null);
    setDownloadUrl(null);
    setTextPreview(null);

    // Link-style resources have no stored file - they simply point outward.
    if (!resource.storagePath) {
      setViewUrl(resource.url);
      setIsLoading(false);
      return;
    }

    const [inlineUrl, fileUrl] = await Promise.all([
      createResourceSignedUrl(resource.storagePath),
      createResourceSignedUrl(resource.storagePath, {
        download: resource.fileName ?? true,
      }),
    ]);

    if (!inlineUrl) {
      setError("This file could not be opened. You may not have access, or it may have been removed.");
      setIsLoading(false);
      return;
    }

    setViewUrl(inlineUrl);
    setDownloadUrl(fileUrl);

    // Code and text files read better as text than as a browser download prompt.
    if (resource.resourceType === "code") {
      try {
        const response = await fetch(inlineUrl);
        setTextPreview(response.ok ? await response.text() : null);
      } catch {
        setTextPreview(null);
      }
    }

    setIsLoading(false);
  }, [resource]);

  useEffect(() => {
    if (open && resource) void load();
  }, [open, resource, load]);

  if (!resource) return null;

  const isExternal = !resource.storagePath;
  const previewable = canPreviewInBrowser(resource.resourceType);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Opening resource...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-72 flex-col items-center justify-center gap-3 px-6 text-center">
          <TriangleAlert className="h-8 w-8 text-destructive" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      );
    }

    if (isExternal) {
      return (
        <div className="flex h-72 flex-col items-center justify-center gap-4 px-6 text-center">
          <ResourceIcon resourceType={resource.resourceType} className="h-14 w-14" />
          <div>
            <p className="text-sm font-medium">This resource lives on another site.</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">{resource.url}</p>
          </div>
          <Button variant="accent" asChild>
            <a href={resource.url} target="_blank" rel="noreferrer noopener">
              Open Link <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      );
    }

    if (textPreview !== null) {
      return (
        <pre className="max-h-[60vh] overflow-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
          <code>{textPreview}</code>
        </pre>
      );
    }

    if (resource.resourceType === "image" && viewUrl) {
      return (
        <div className="flex max-h-[60vh] justify-center overflow-auto rounded-lg bg-muted p-4">
          <img src={viewUrl} alt={resource.title} className="max-w-full rounded" />
        </div>
      );
    }

    if (resource.resourceType === "video" && viewUrl) {
      return <video src={viewUrl} controls className="max-h-[60vh] w-full rounded-lg bg-black" />;
    }

    if (resource.resourceType === "audio" && viewUrl) {
      return (
        <div className="rounded-lg bg-muted p-6">
          <audio src={viewUrl} controls className="w-full" />
        </div>
      );
    }

    if (resource.resourceType === "pdf" && viewUrl) {
      return (
        <iframe
          src={viewUrl}
          title={resource.title}
          className="h-[60vh] w-full rounded-lg border border-border bg-muted"
        />
      );
    }

    // Word, PowerPoint, spreadsheets and archives cannot render inline in a
    // browser. Say so plainly and hand over the download instead of failing.
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 px-6 text-center">
        <ResourceIcon resourceType={resource.resourceType} className="h-14 w-14" />
        <div>
          <p className="text-sm font-medium">
            {RESOURCE_TYPE_LABELS[resource.resourceType]} files open in their own application.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Download it to read on your device{resource.fileSize ? ` (${formatFileSize(resource.fileSize)})` : ""}.
          </p>
        </div>
        {downloadUrl && (
          <Button variant="accent" asChild>
            <a href={downloadUrl}>
              Download <Download className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-6">
            <ResourceIcon resourceType={resource.resourceType} />
            <div className="min-w-0">
              <DialogTitle className="text-left text-base">{resource.title}</DialogTitle>
              <DialogDescription className="text-left">
                {resource.description || "No description provided."}
              </DialogDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline">{RESOURCE_TYPE_LABELS[resource.resourceType]}</Badge>
                {resource.isRequired && <Badge variant="accent">Required</Badge>}
                {resource.version > 1 && <Badge variant="secondary">v{resource.version}</Badge>}
                {resource.fileSize ? (
                  <span className="text-xs text-muted-foreground">{formatFileSize(resource.fileSize)}</span>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        {resource.learningObjective && (
          <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
            <span className="font-semibold">What this is for: </span>
            {resource.learningObjective}
          </p>
        )}

        {renderBody()}

        {!isExternal && !error && (
          <div className="flex flex-wrap justify-end gap-2">
            {previewable && viewUrl && (
              <Button variant="outline" asChild>
                <a href={viewUrl} target="_blank" rel="noreferrer noopener">
                  Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {downloadUrl && (
              <Button variant="accent" asChild>
                <a href={downloadUrl}>
                  Download <Download className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceViewerDialog;
