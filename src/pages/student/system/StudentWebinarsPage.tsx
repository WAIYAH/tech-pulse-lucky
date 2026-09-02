import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CalendarPlus, Check, Clock3, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/student/EmptyState";
import { useToast } from "@/hooks/use-toast";
import type { WebinarRecord } from "@/data/webinars";
import noWebinarsImage from "@/assets/empty-states/no-webinars.svg";
import { readAdminWebinars, subscribeAdminWebinars } from "@/lib/admin/webinarState";
import {
  createStudentNotification,
  readInterestedWebinarIds,
  toggleInterestedWebinar,
} from "@/lib/student/studentPortalState";
import { routes } from "@/routes/routeConfig";
import { useStudentPortal } from "./StudentPortalContext";

const StudentWebinarsPage = () => {
  const { user, config } = useStudentPortal();
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<WebinarRecord[]>(() => readAdminWebinars());
  const [interestedIds, setInterestedIds] = useState<string[]>(() =>
    user ? readInterestedWebinarIds(user.id) : [],
  );

  useEffect(() => {
    const sync = () => setWebinars(readAdminWebinars());
    sync();
    return subscribeAdminWebinars(sync);
  }, []);

  useEffect(() => {
    if (user) setInterestedIds(readInterestedWebinarIds(user.id));
  }, [user]);

  const upcomingWebinars = useMemo(() => {
    const now = Date.now();
    const sorted = [...webinars].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
    const upcoming = sorted.filter((webinar) => new Date(webinar.startsAt).getTime() >= now);
    return (upcoming.length > 0 ? upcoming : sorted).slice(0, 6);
  }, [webinars]);

  const toggleInterest = (webinar: WebinarRecord) => {
    if (!user) return;
    const webinarId = String(webinar.id);
    const wasInterested = interestedIds.includes(webinarId);
    const next = toggleInterestedWebinar(user.id, webinarId);
    setInterestedIds(next);

    if (!wasInterested) {
      void createStudentNotification({
        userId: user.id,
        title: "Added to your webinars",
        message: `We'll remind you before "${webinar.title}" starts.`,
        type: "webinar",
        actionPath: routes.student.webinars,
      });
      toast({ title: "You're on the list", description: webinar.title });
    }
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Webinars & Live Sessions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stay connected with live mentor sessions, workshops, and upcoming cohort events.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                <p className="text-3xl font-semibold">{upcomingWebinars.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <Video className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">You're Interested In</p>
                <p className="text-3xl font-semibold">{interestedIds.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <CalendarPlus className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingWebinars.length === 0 ? (
              <EmptyState image={noWebinarsImage} title="No webinars are currently scheduled" />
            ) : (
              upcomingWebinars.map((webinar) => {
                const isInterested = interestedIds.includes(String(webinar.id));

                return (
                  <div
                    key={webinar.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{webinar.title}</p>
                      <Badge variant={webinar.type === "paid" ? "default" : "success"}>
                        {webinar.type === "paid" ? "Paid Masterclass" : "Free Webinar"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(webinar.startsAt).toLocaleDateString("en-KE")}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {webinar.time}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                        <MapPin className="h-3.5 w-3.5" />
                        Online Session
                      </span>
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant={isInterested ? "success" : "accent"}
                        onClick={() => toggleInterest(webinar)}
                      >
                        {isInterested ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            You're interested
                          </>
                        ) : (
                          <>
                            <CalendarPlus className="mr-1 h-4 w-4" />
                            I'm interested
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Join & Replay</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Browse all webinars, register for upcoming sessions, and replay previously
              hosted training events.
            </p>
            <Button asChild className="w-full">
              <Link to={routes.public.webinars}>
                <Video className="mr-2 h-4 w-4" />
                Open Webinar Catalog
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a
                href={config.whatsappCommunityLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join WhatsApp Learning Community
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentWebinarsPage;
