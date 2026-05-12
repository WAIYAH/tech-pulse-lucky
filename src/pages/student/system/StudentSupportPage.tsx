import { useMemo, useState } from "react";
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
  readStudentSupportTickets,
  saveStudentSupportTickets,
  type SupportTicket,
  type SupportTicketPriority,
} from "@/lib/student/studentPortalState";
import { useStudentPortal } from "./StudentPortalContext";

const StudentSupportPage = () => {
  const { user, config } = useStudentPortal();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("course");
  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    user ? readStudentSupportTickets(user.id) : [],
  );

  const sortedTickets = useMemo(() => {
    return tickets.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tickets]);

  if (!user) return null;

  const createTicket = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing details",
        description: "Please add subject and message before submitting.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const nextTicket: SupportTicket = {
      id: `${Date.now()}`,
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority,
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    const nextTickets = [nextTicket, ...tickets];
    setTickets(nextTickets);
    saveStudentSupportTickets(user.id, nextTickets);
    setSubject("");
    setMessage("");
    setCategory("course");
    setPriority("medium");

    toast({
      title: "Support request submitted",
      description: "Your request has been added to your student support queue.",
    });
  };

  const markResolved = (ticketId: string) => {
    const nextTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, status: "resolved", updatedAt: new Date().toISOString() }
        : ticket,
    );
    setTickets(nextTickets);
    saveStudentSupportTickets(user.id, nextTickets);
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
                  onValueChange={(value: SupportTicket["category"]) => setCategory(value)}
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

            <Button onClick={createTicket}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              Submit Request
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
              <p className="text-muted-foreground">{config.supportEmail}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Support Phone</p>
              <p className="text-muted-foreground">{config.supportPhone}</p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <a
                href={config.whatsappCommunityLink}
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
                        <Badge variant="secondary">{ticket.status}</Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{ticket.message}</p>
                    {ticket.status !== "resolved" && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markResolved(ticket.id)}
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
