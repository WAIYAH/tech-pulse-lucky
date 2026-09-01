import { useMemo, useState } from "react";
import { FileText, Globe, SearchCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  type AdminContentState,
  readAdminContentState,
  saveAdminContentState,
} from "@/lib/admin/adminState";

const AdminContentPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<AdminContentState>(() => readAdminContentState());

  const saveContent = () => {
    const payload: AdminContentState = {
      ...form,
      updatedAt: new Date().toISOString(),
    };
    saveAdminContentState(payload);
    setForm(payload);
    toast({
      title: "Content preferences saved",
      description: "Homepage and SEO control settings were persisted locally.",
    });
  };

  const robotsMode = useMemo(() => {
    return form.blockSearchIndexing ? "Hidden from search engines" : "Visible to search engines";
  }, [form.blockSearchIndexing]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Website Content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Homepage messaging and search engine visibility.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Homepage Content Controls</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={form.heroTitle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, heroTitle: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                rows={3}
                value={form.heroSubtitle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-cta">Primary CTA Label</Label>
              <Input
                id="hero-cta"
                value={form.primaryCta}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, primaryCta: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement">Homepage Announcement</Label>
              <Textarea
                id="announcement"
                rows={3}
                value={form.homepageAnnouncement}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    homepageAnnouncement: event.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Publishing Status</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <SearchCheck className="h-4 w-4 text-primary" />
                Crawl Mode
              </div>
              <p className="mt-1 text-muted-foreground">{robotsMode}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <Globe className="h-4 w-4 text-primary" />
                Sitemap
              </div>
              <p className="mt-1 text-muted-foreground">
                {form.includeCoursePagesInSitemap
                  ? "Course pages are included in sitemap publishing."
                  : "Course pages are currently excluded from sitemap publishing."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-primary" />
                Last Update
              </div>
              <p className="mt-1 text-muted-foreground">
                {new Date(form.updatedAt).toLocaleString("en-KE")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">SEO Controls</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={form.seoTitle}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, seoTitle: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-description">SEO Description</Label>
              <Textarea
                id="seo-description"
                rows={3}
                value={form.seoDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, seoDescription: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                <span className="text-sm font-medium">Block search indexing</span>
                <Switch
                  checked={form.blockSearchIndexing}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, blockSearchIndexing: checked }))
                  }
                />
              </label>

              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                <span className="text-sm font-medium">Include course pages in sitemap</span>
                <Switch
                  checked={form.includeCoursePagesInSitemap}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, includeCoursePagesInSitemap: checked }))
                  }
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Search Preview</h2>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="line-clamp-2 text-base font-medium text-primary">{form.seoTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                https://gettechy.nakolaexpertsystems.com
              </p>
              <p className="mt-2 text-sm text-foreground">{form.seoDescription}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={form.blockSearchIndexing ? "destructive" : "success"}>
                {form.blockSearchIndexing ? "Noindex" : "Indexing Enabled"}
              </Badge>
              <Badge variant="outline">
                {form.includeCoursePagesInSitemap ? "Sitemap includes courses" : "Courses excluded"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="flex justify-end">
        <Button variant="accent" onClick={saveContent} className="w-full sm:w-auto">
          Save Content Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminContentPage;
