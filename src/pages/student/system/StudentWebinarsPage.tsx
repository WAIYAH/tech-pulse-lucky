import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routes } from "@/routes/routeConfig";
import { useStudentPortal } from "./StudentPortalContext";

const upcomingWebinars = [
  {
    id: "web-1",
    title: "Cybersecurity Fundamentals Live Lab",
    date: "2026-05-22",
    time: "7:00 PM EAT",
    location: "Google Meet",
    type: "Live Training",
  },
  {
    id: "web-2",
    title: "Career Roadmap: Junior Dev to Professional Engineer",
    date: "2026-05-29",
    time: "7:30 PM EAT",
    location: "YouTube Live",
    type: "Career Session",
  },
  {
    id: "web-3",
    title: "Practical API Security Workshop",
    date: "2026-06-05",
    time: "6:30 PM EAT",
    location: "Zoom",
    type: "Hands-on Workshop",
  },
];

const StudentWebinarsPage = () => {
  const { config } = useStudentPortal();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Webinars & Live Sessions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stay connected with live mentor sessions, workshops, and upcoming cohort events.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingWebinars.map((webinar) => (
              <div
                key={webinar.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{webinar.title}</p>
                  <Badge variant="secondary">{webinar.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(webinar.date).toLocaleDateString("en-KE")}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {webinar.time}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {webinar.location}
                  </span>
                </div>
              </div>
            ))}
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
