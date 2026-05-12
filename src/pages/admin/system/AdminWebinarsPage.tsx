import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { webinars } from "@/data/webinars";
import { routes } from "@/routes/routeConfig";

const AdminWebinarsPage = () => {
  const paidCount = webinars.filter((item) => item.type === "paid").length;
  const freeCount = webinars.length - paidCount;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Webinar Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review webinar catalog records, availability, type, and booking links.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Webinars</p>
            <p className="text-3xl font-semibold">{webinars.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Free Sessions</p>
            <p className="text-3xl font-semibold">{freeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Paid Sessions</p>
            <p className="text-3xl font-semibold">{paidCount}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Webinar Catalog</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Spots</TableHead>
                  <TableHead>Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webinars.map((webinar) => (
                  <TableRow key={webinar.id}>
                    <TableCell>
                      <p className="font-medium">{webinar.title}</p>
                      <p className="text-xs text-muted-foreground">{webinar.slug}</p>
                    </TableCell>
                    <TableCell>
                      {webinar.date}
                      <p className="text-xs text-muted-foreground">{webinar.time}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={webinar.type === "paid" ? "default" : "secondary"}>
                        {webinar.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {webinar.spots.available}/{webinar.spots.total}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={webinar.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Form
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 text-sm text-muted-foreground">
              Event detail routes are generated under{" "}
              <code>{routes.public.event(":eventSlug")}</code>.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminWebinarsPage;
