import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellRing, CheckCheck, CircleDot, MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/student/EmptyState";
import {
  markAllStudentNotificationsRead,
  markStudentNotificationRead,
} from "@/lib/student/studentPortalState";
import { notificationTypeBadgeVariant } from "@/lib/statusBadges";
import { useStudentPortal } from "./StudentPortalContext";
import { useToast } from "@/hooks/use-toast";
import noNotificationsImage from "@/assets/empty-states/no-notifications.svg";

type NotificationFilter = "all" | "unread";

const StudentNotificationsPage = () => {
  const { user, notifications, unreadNotificationsCount, refresh } = useStudentPortal();
  const { toast } = useToast();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((item) => !item.read);
    return notifications;
  }, [filter, notifications]);

  if (!user) return null;

  const markRead = async (notificationId: string) => {
    try {
      await markStudentNotificationRead(user.id, notificationId);
      await refresh();
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Unable to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const markAll = async () => {
    try {
      await markAllStudentNotificationsRead(user.id);
      await refresh();
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Unable to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stay updated on payment approvals, support responses, and learning milestones.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-semibold">{notifications.length}</p>
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
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-3xl font-semibold">{unreadNotificationsCount}</p>
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
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-3xl font-semibold">
                  {Math.max(0, notifications.length - unreadNotificationsCount)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/15">
                <MailOpen className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Inbox</h2>
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
                  variant={filter === "unread" ? "default" : "outline"}
                  onClick={() => setFilter("unread")}
                  className="flex-1 sm:flex-none"
                >
                  Unread
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void markAll()}
                  disabled={unreadNotificationsCount === 0}
                  className="w-full sm:w-auto"
                >
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Mark all read
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState
                image={noNotificationsImage}
                title="No notifications yet"
                description="New updates will appear here as you use the LMS."
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{notification.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={notificationTypeBadgeVariant[notification.type]}>
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="warning" className="inline-flex items-center gap-1">
                            <CircleDot className="h-3 w-3" />
                            Unread
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{notification.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString("en-KE")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => void markRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {notification.actionPath && (
                        <Button size="sm" asChild>
                          <Link to={notification.actionPath}>Open</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentNotificationsPage;
