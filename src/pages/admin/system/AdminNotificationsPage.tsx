import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellRing, CheckCircle2, CircleDollarSign, Headset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { readAdminActivityFeed, type AdminActivityItem } from "@/lib/admin/adminNotifications";
import { subscribeStudentExperience } from "@/lib/student/studentPortalState";

type ActivityFilter = "all" | "needs-action";

const activityIcon = (type: AdminActivityItem["type"]) => {
  return type === "payment" ? CircleDollarSign : Headset;
};

const AdminNotificationsPage = () => {
  const [items, setItems] = useState<AdminActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityFilter>("all");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const rows = await readAdminActivityFeed();
      if (!isMounted) return;
      setItems(rows);
      setIsLoading(false);
    };
    void load();
    const unsubscribe = subscribeStudentExperience(() => void load());
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const needsActionCount = useMemo(() => items.filter((item) => item.needsAction).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "needs-action") return items.filter((item) => item.needsAction);
    return items;
  }, [filter, items]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A live feed of payment submissions and support tickets that need your attention.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-semibold">{items.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Action</p>
                <p className="text-3xl font-semibold">{needsActionCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <BellRing className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-semibold">{Math.max(0, items.length - needsActionCount)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Activity Feed</h2>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <Button
                  size="sm"
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="flex-1 sm:flex-none"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === "needs-action" ? "default" : "outline"}
                  onClick={() => setFilter("needs-action")}
                  className="flex-1 sm:flex-none"
                >
                  Needs Action
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 text-foreground">
                  <BellRing className="h-4 w-4 text-primary" />
                  {filter === "needs-action" ? "Nothing needs action" : "No activity yet"}
                </div>
                {filter === "needs-action"
                  ? "You're all caught up on payments and support tickets."
                  : "New payment submissions and support tickets will appear here."}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const Icon = activityIcon(item.type);
                  return (
                    <div key={item.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
                              (item.type === "payment" ? "bg-primary/15 text-primary" : "bg-accent/25 text-accent-foreground")
                            }
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <p className="font-semibold">{item.title}</p>
                        </div>
                        <Badge variant={item.badgeVariant} className="capitalize">
                          {item.badgeLabel}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString("en-KE")}
                      </p>
                      <div className="mt-3">
                        <Button size="sm" asChild>
                          <Link to={item.actionPath}>Open</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminNotificationsPage;
