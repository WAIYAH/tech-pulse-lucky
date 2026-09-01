import { ExternalLink, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";

const StudentMasterclassLiveAndResourcesPage = () => {
  const { liveLinkResource, resources, isLoading } = useStudentMasterclassWeek();

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
              <a href={liveLinkResource.url} target="_blank" rel="noreferrer">
                Join Live Class <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Resources</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources for this week yet.</p>
          ) : (
            resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target={resource.url.startsWith("http") ? "_blank" : undefined}
                rel={resource.url.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm hover:border-primary"
              >
                <span>{resource.title}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMasterclassLiveAndResourcesPage;
