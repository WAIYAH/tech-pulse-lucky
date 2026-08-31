import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WebinarRecord, WebinarType } from "@/data/webinars";
import { lmsProvider } from "@/lib/lms";
import { createBulkStudentNotifications } from "@/lib/student/studentPortalState";
import {
  formatWebinarDate,
  formatWebinarTime,
  readAdminWebinars,
  saveAdminWebinars,
  toDateTimeLocalValue,
  toStartsAtValue,
  toWebinarSlug,
} from "@/lib/admin/webinarState";
import { routes } from "@/routes/routeConfig";

interface WebinarFormState {
  id?: number;
  title: string;
  slug: string;
  startsAt: string;
  date: string;
  time: string;
  duration: string;
  type: WebinarType;
  priceAmount: number;
  totalSpots: number;
  availableSpots: number;
  description: string;
  longDescription: string;
  targetAudience: string;
  topicsText: string;
  trainer: string;
  bookingLink: string;
  paymentMethodsText: string;
}

const createEmptyForm = (): WebinarFormState => ({
  title: "",
  slug: "",
  startsAt: "",
  date: "",
  time: "",
  duration: "",
  type: "free",
  priceAmount: 0,
  totalSpots: 100,
  availableSpots: 100,
  description: "",
  longDescription: "",
  targetAudience: "",
  topicsText: "",
  trainer: "Lucky Nakola",
  bookingLink: "",
  paymentMethodsText: "M-Pesa\nBank Transfer\nPayPal",
});

const toLines = (items: string[] = []) => items.join("\n");
const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toPriceLabel = (amount: number): string => `KES ${amount.toLocaleString("en-KE")}`;

const webinarToForm = (webinar: WebinarRecord): WebinarFormState => ({
  id: webinar.id,
  title: webinar.title,
  slug: webinar.slug,
  startsAt: toDateTimeLocalValue(webinar.startsAt),
  date: webinar.date,
  time: webinar.time,
  duration: webinar.duration,
  type: webinar.type,
  priceAmount: webinar.priceAmount ?? 0,
  totalSpots: webinar.spots.total,
  availableSpots: webinar.spots.available,
  description: webinar.description,
  longDescription: webinar.longDescription,
  targetAudience: webinar.targetAudience,
  topicsText: toLines(webinar.topics),
  trainer: webinar.trainer,
  bookingLink: webinar.bookingLink,
  paymentMethodsText: toLines(webinar.paymentMethods ?? ["M-Pesa", "Bank Transfer", "PayPal"]),
});

const AdminWebinarsPage = () => {
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<WebinarRecord[]>(() => readAdminWebinars());
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<WebinarFormState>(createEmptyForm());

  const paidCount = useMemo(
    () => webinars.filter((item) => item.type === "paid").length,
    [webinars],
  );
  const freeCount = webinars.length - paidCount;

  const selectedWebinar = useMemo(
    () => webinars.find((webinar) => webinar.id === selectedId) ?? null,
    [selectedId, webinars],
  );

  const filteredWebinars = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return webinars;
    return webinars.filter((webinar) => {
      return (
        webinar.title.toLowerCase().includes(normalized) ||
        webinar.slug.toLowerCase().includes(normalized) ||
        webinar.date.toLowerCase().includes(normalized) ||
        webinar.type.toLowerCase().includes(normalized)
      );
    });
  }, [search, webinars]);

  const startCreateMode = () => {
    setSelectedId(null);
    setForm(createEmptyForm());
  };

  const startEditMode = (webinar: WebinarRecord) => {
    setSelectedId(webinar.id);
    setForm(webinarToForm(webinar));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim() || !form.description.trim() || !form.longDescription.trim()) {
      toast({
        title: "Required fields missing",
        description: "Title, short description, and long description are required.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.startsAt || !form.duration.trim() || !form.bookingLink.trim()) {
      toast({
        title: "Required fields missing",
        description: "Start time, duration, and booking link are required.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.targetAudience.trim() || fromLines(form.topicsText).length === 0) {
      toast({
        title: "Required fields missing",
        description: "Target audience and at least one topic are required.",
        variant: "destructive",
      });
      return false;
    }

    if (form.totalSpots < 1) {
      toast({
        title: "Invalid spots",
        description: "Total spots must be at least 1.",
        variant: "destructive",
      });
      return false;
    }

    if (form.availableSpots < 0 || form.availableSpots > form.totalSpots) {
      toast({
        title: "Invalid spots",
        description: "Available spots must be between 0 and total spots.",
        variant: "destructive",
      });
      return false;
    }

    if (form.type === "paid" && form.priceAmount <= 0) {
      toast({
        title: "Price required",
        description: "Paid webinars must include a price greater than zero.",
        variant: "destructive",
      });
      return false;
    }

    const nextSlug = form.slug.trim() || toWebinarSlug(form.title);
    if (!nextSlug) {
      toast({
        title: "Slug required",
        description: "Please provide a valid title or custom slug.",
        variant: "destructive",
      });
      return false;
    }

    const duplicate = webinars.find(
      (webinar) => webinar.slug === nextSlug && webinar.id !== form.id,
    );
    if (duplicate) {
      toast({
        title: "Slug already in use",
        description: "Use a unique slug so event routes do not clash.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const saveWebinar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const startsAt = toStartsAtValue(form.startsAt);
      const priceAmount = Math.max(0, Math.round(form.priceAmount));
      const nextRecord: WebinarRecord = {
        id: form.id ?? webinars.reduce((max, row) => Math.max(max, row.id), 0) + 1,
        title: form.title.trim(),
        slug: form.slug.trim() || toWebinarSlug(form.title),
        startsAt,
        date: form.date.trim() || formatWebinarDate(startsAt),
        time: form.time.trim() || formatWebinarTime(startsAt),
        duration: form.duration.trim(),
        type: form.type,
        price: form.type === "paid" ? toPriceLabel(priceAmount) : undefined,
        priceAmount: form.type === "paid" ? priceAmount : undefined,
        spots: {
          total: Math.round(form.totalSpots),
          available: Math.round(form.availableSpots),
        },
        description: form.description.trim(),
        longDescription: form.longDescription.trim(),
        targetAudience: form.targetAudience.trim(),
        topics: fromLines(form.topicsText),
        trainer: form.trainer.trim() || "Lucky Nakola",
        bookingLink: form.bookingLink.trim(),
        paymentMethods:
          form.type === "paid" ? fromLines(form.paymentMethodsText) : undefined,
      };

      const nextCatalog = form.id
        ? webinars.map((webinar) => (webinar.id === form.id ? nextRecord : webinar))
        : [...webinars, nextRecord];

      const persisted = saveAdminWebinars(nextCatalog);
      setWebinars(persisted);
      setSelectedId(form.id ?? nextRecord.id);
      setForm(webinarToForm(nextRecord));

      if (!form.id) {
        const users = await lmsProvider.listUsers();
        const studentIds = users
          .filter((item) => item.role === "student")
          .map((item) => item.id);

        if (studentIds.length > 0) {
          await createBulkStudentNotifications({
            userIds: studentIds,
            title: "New webinar available",
            message: `${nextRecord.title} is now open for registration.`,
            type: "webinar",
            actionPath: routes.student.webinars,
          });
        }
      }

      toast({
        title: form.id ? "Webinar updated" : "Webinar created",
        description: form.id
          ? "Changes were saved to the webinar catalog."
          : "The webinar was added to the live catalog.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWebinar = (webinar: WebinarRecord) => {
    const shouldDelete = window.confirm(
      `Delete "${webinar.title}" from the webinar catalog?`,
    );
    if (!shouldDelete) return;

    const nextCatalog = webinars.filter((row) => row.id !== webinar.id);
    const persisted = saveAdminWebinars(nextCatalog);
    setWebinars(persisted);

    if (selectedId === webinar.id) {
      startCreateMode();
    }

    toast({
      title: "Webinar deleted",
      description: "The webinar was removed from the catalog.",
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Webinar Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Full CRUD controls for webinar metadata, booking links, topics, and seat counts.
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

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Webinar Catalog</h2>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search webinars"
                  className="pl-9"
                />
              </div>
              <Button onClick={startCreateMode}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Webinar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredWebinars.length === 0 ? (
              <p className="text-sm text-muted-foreground">No webinars matched your search.</p>
            ) : (
              <div className="space-y-3">
                {filteredWebinars.map((webinar) => (
                  <div
                    key={webinar.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{webinar.title}</p>
                      <Badge variant={webinar.type === "paid" ? "default" : "secondary"}>
                        {webinar.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{webinar.slug}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {webinar.date} • {webinar.time}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Spots {webinar.spots.available}/{webinar.spots.total}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditMode(webinar)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteWebinar(webinar)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {selectedWebinar ? `Editing: ${selectedWebinar.title}` : "Create New Webinar"}
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={saveWebinar}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={form.slug}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, slug: event.target.value }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, slug: toWebinarSlug(prev.title) }))
                      }
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Starts At</Label>
                  <Input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(event) => {
                      const value = event.target.value;
                      const startsAt = toStartsAtValue(value);
                      setForm((prev) => ({
                        ...prev,
                        startsAt: value,
                        date: prev.date || formatWebinarDate(startsAt),
                        time: prev.time || formatWebinarTime(startsAt),
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={form.duration}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, duration: event.target.value }))
                    }
                    placeholder="2 hours"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Label</Label>
                  <Input
                    value={form.date}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    placeholder="March 13, 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Label</Label>
                  <Input
                    value={form.time}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    placeholder="7:00 PM - 9:00 PM EAT"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: WebinarType) =>
                      setForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (KES)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.priceAmount}
                    disabled={form.type === "free"}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        priceAmount: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Spots</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.totalSpots}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        totalSpots: Number(event.target.value) || 1,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Spots</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.availableSpots}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        availableSpots: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Booking Link</Label>
                  <Input
                    type="url"
                    value={form.bookingLink}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, bookingLink: event.target.value }))
                    }
                    placeholder="https://forms.gle/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trainer</Label>
                  <Input
                    value={form.trainer}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, trainer: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Textarea
                  rows={2}
                  value={form.targetAudience}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, targetAudience: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Long Description</Label>
                <Textarea
                  rows={4}
                  value={form.longDescription}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, longDescription: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Topics (one per line)</Label>
                <Textarea
                  rows={5}
                  value={form.topicsText}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, topicsText: event.target.value }))
                  }
                />
              </div>

              {form.type === "paid" && (
                <div className="space-y-2">
                  <Label>Payment Methods (one per line)</Label>
                  <Textarea
                    rows={3}
                    value={form.paymentMethodsText}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        paymentMethodsText: event.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2">
                {selectedWebinar && (
                  <Button type="button" variant="outline" onClick={startCreateMode} className="w-full sm:w-auto">
                    Cancel Edit
                  </Button>
                )}
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving
                    ? "Saving..."
                    : selectedWebinar
                      ? "Update Webinar"
                      : "Create Webinar"}
                </Button>
              </div>
            </form>

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
