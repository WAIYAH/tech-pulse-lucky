import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ListChecks, Search, Wrench, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createStudentNotification,
  readAllSupportTickets,
  subscribeStudentExperience,
  type SupportTicket,
  type SupportTicketStatus,
  updateSupportTicket,
} from "@/lib/student/studentPortalState";
import { ticketStatusBadgeVariant } from "@/lib/statusBadges";

type StatusFilter = "all" | SupportTicketStatus;

const statusIcon = (status: SupportTicketStatus) => {
  if (status === "resolved") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "in_progress") return <Wrench className="h-4 w-4 text-blue-600" />;
  return <Clock3 className="h-4 w-4 text-amber-600" />;
};

const AdminSupportPage = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [replyById, setReplyById] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      const rows = await readAllSupportTickets();
      if (!isMounted) return;
      setTickets(rows);
      setReplyById((prev) => {
        const next = { ...prev };
        rows.forEach((ticket) => {
          if (!(ticket.id in next)) {
            next[ticket.id] = ticket.adminReply ?? "";
          }
        });
        return next;
      });
    };

    void sync();
    const unsubscribe = subscribeStudentExperience(() => {
      void sync();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredTickets = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesSearch =
        normalized.length === 0 ||
        ticket.subject.toLowerCase().includes(normalized) ||
        ticket.userName.toLowerCase().includes(normalized) ||
        ticket.userEmail.toLowerCase().includes(normalized) ||
        ticket.message.toLowerCase().includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, tickets]);

  const summary = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        acc.total += 1;
        if (ticket.status === "open") acc.open += 1;
        if (ticket.status === "in_progress") acc.inProgress += 1;
        if (ticket.status === "resolved") acc.resolved += 1;
        return acc;
      },
      { total: 0, open: 0, inProgress: 0, resolved: 0 },
    );
  }, [tickets]);

  const updateTicket = async (
    ticket: SupportTicket,
    nextStatus: SupportTicketStatus,
  ) => {
    try {
      const adminReply = replyById[ticket.id]?.trim() || undefined;
      const updated = await updateSupportTicket(ticket.id, {
        status: nextStatus,
        adminReply,
      });

      if (!updated) {
        toast({
          title: "Update failed",
          description: "Could not update this ticket.",
          variant: "destructive",
        });
        return;
      }

      await createStudentNotification({
        userId: updated.userId,
        title: "Support ticket updated",
        message: `Your ticket "${updated.subject}" is now ${updated.status.replace("_", " ")}.`,
        type: "support",
        actionPath: "/dashboard/support",
      });

      setTickets((prev) => prev.map((row) => (row.id === ticket.id ? updated : row)));
      toast({
        title: "Ticket updated",
        description: `Status moved to ${nextStatus.replace("_", " ")}.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update this ticket.",
        variant: "destructive",
      });
    }
  };

  const saveReplyOnly = async (ticket: SupportTicket) => {
    try {
      const adminReply = replyById[ticket.id]?.trim() || undefined;
      const updated = await updateSupportTicket(ticket.id, { adminReply });
      if (!updated) {
        toast({
          title: "Save failed",
          description: "Could not save this admin reply.",
          variant: "destructive",
        });
        return;
      }

      await createStudentNotification({
        userId: updated.userId,
        title: "Support response received",
        message: `Support responded to "${updated.subject}".`,
        type: "support",
        actionPath: "/dashboard/support",
      });

      setTickets((prev) => prev.map((row) => (row.id === ticket.id ? updated : row)));
      toast({
        title: "Reply saved",
        description: "Your response has been saved for the student.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Could not save this admin reply.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Support Operations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage learner support tickets, respond quickly, and track resolution progress.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-3xl font-semibold">{summary.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-3xl font-semibold">{summary.open}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-semibold">{summary.inProgress}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-semibold">{summary.resolved}</p>
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Ticket Queue</h2>
                <p className="text-sm text-muted-foreground">
                  Search by learner or issue and take action on each request.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="relative w-full sm:w-[280px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search learner or ticket"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {(["all", "open", "in_progress", "resolved"] as StatusFilter[]).map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? "default" : "outline"}
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                      >
                        {status === "in_progress" ? "in progress" : status}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                No support tickets match your current filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{ticket.subject}</p>
                        <p className="break-all text-xs text-muted-foreground">
                          {ticket.userName} • {ticket.userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleString("en-KE")}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{ticket.category}</Badge>
                        <Badge variant="outline">{ticket.priority}</Badge>
                        <Badge variant={ticketStatusBadgeVariant[ticket.status]} className="capitalize">
                          {ticket.status === "in_progress"
                            ? "in progress"
                            : ticket.status}
                        </Badge>
                        {statusIcon(ticket.status)}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">{ticket.message}</p>

                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Admin Reply</p>
                      <Textarea
                        rows={2}
                        value={replyById[ticket.id] ?? ""}
                        onChange={(event) =>
                          setReplyById((prev) => ({
                            ...prev,
                            [ticket.id]: event.target.value,
                          }))
                        }
                        placeholder="Add your guidance or next steps for the learner."
                      />
                      {ticket.adminReply && (
                        <p className="text-xs text-muted-foreground">
                          Last saved reply: {ticket.adminReply}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void saveReplyOnly(ticket)}
                        className="w-full sm:w-auto"
                      >
                        Save Reply
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => void updateTicket(ticket, "in_progress")}
                        className="w-full sm:w-auto"
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => void updateTicket(ticket, "resolved")}
                        className="w-full sm:w-auto"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void updateTicket(ticket, "open")}
                        className="w-full sm:w-auto"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reopen
                      </Button>
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

export default AdminSupportPage;
