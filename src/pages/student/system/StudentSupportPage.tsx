import { useEffect, useMemo, useState } from "react";
import { LifeBuoy, MessageCircleHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createStudentNotification,
  createSupportTicket,
  readStudentSupportTickets,
  subscribeStudentExperience,
  type SupportTicket,
  type SupportTicketCategory,
  type SupportTicketPriority,
  updateSupportTicket,
} from "@/lib/student/studentPortalState";
import { ticketStatusBadgeVariant } from "@/lib/statusBadges";
import { useStudentPortal } from "./StudentPortalContext";
import { readAdminSettings } from "@/lib/admin/adminState";

const StudentSupportPage = () => {
  const { user } = useStudentPortal();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<SupportTicketCategory>("course");
  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supportSettings = readAdminSettings();

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const sync = async () => {
      const rows = await readStudentSupportTickets(user.id);
      if (!isMounted) return;
      setTickets(rows);
    };
    void sync();

    const unsubscribe = subscribeStudentExperience(() => {
      void sync();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user]);

  const sortedTickets = useMemo(() => {
    return tickets.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tickets]);

  if (!user) return null;

  const createTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing details",
        description: "Please add subject and message before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const nextTicket = await createSupportTicket({
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority,
      });

      await createStudentNotification({
        userId: user.id,
        title: "Support request submitted",
        message: "We received your ticket and the support queue has been updated.",
        type: "support",
        actionPath: "/dashboard/support",
      });

      setTickets((prev) => [nextTicket, ...prev]);
      setSubject("");
      setMessage("");
      setCategory("course");
      setPriority("medium");

      toast({
        title: "Support request submitted",
        description: "Your request has been added to your student support queue.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          error instanceof Error ? error.message : "Unable to submit support request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const markResolved = async (ticketId: string) => {
    try {
      const updated = await updateSupportTicket(ticketId, { status: "resolved" });
      if (!updated) {
        toast({
          title: "Update failed",
          description: "Unable to mark this ticket as resolved.",
          variant: "destructive",
        });
        return;
      }

      await createStudentNotification({
        userId: user.id,
        title: "Support ticket updated",
        message: `Ticket "${updated.subject}" has been marked resolved.`,
        type: "support",
        actionPath: "/dashboard/support",
      });

      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === ticketId ? updated : ticket)),
      );
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Unable to mark this ticket as resolved.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Support Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Need help with access, payment, or lesson issues? Submit a support request.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Create Support Ticket</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Short summary of your issue"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: SupportTicketCategory) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: SupportTicketPriority) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe what happened and what you need help with."
              />
            </div>

            <Button
              variant="accent"
              onClick={() => void createTicket()}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Contact Options</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Support Email</p>
              <p className="break-all text-muted-foreground">{supportSettings.supportEmail}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Support Phone</p>
              <p className="break-all text-muted-foreground">{supportSettings.supportPhone}</p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <a
                href={`https://wa.me/${supportSettings.supportPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircleHeart className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">My Support Requests</h2>
          </CardHeader>
          <CardContent>
            {sortedTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No support requests yet.
              </p>
            ) : (
              <div className="space-y-3">
                {sortedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleString("en-KE")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ticket.category}</Badge>
                        <Badge variant={ticketStatusBadgeVariant[ticket.status]}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{ticket.message}</p>
                    {ticket.adminReply && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Admin reply: {ticket.adminReply}
                      </p>
                    )}
                    {ticket.status !== "resolved" && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => void markResolved(ticket.id)}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    )}
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

export default StudentSupportPage;
