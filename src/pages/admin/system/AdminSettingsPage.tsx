import { useState } from "react";
import AvatarUpload from "@/components/AvatarUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  type AdminSettingsState,
  readAdminSettings,
  saveAdminSettings,
} from "@/lib/admin/adminState";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettingsPage = () => {
  const { user, authMode, logout } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<AdminSettingsState>(() => readAdminSettings());
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);

  const saveSettings = () => {
    saveAdminSettings(form);
    toast({
      title: "Admin settings saved",
      description: "Operational and platform defaults were saved locally.",
    });
  };

  const clearSession = async () => {
    await logout();
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Admin Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage platform defaults, payment review policy, and admin operational settings.
        </p>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile Picture</h2>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              userId={user?.id ?? ""}
              fullName={user?.fullName}
              email={user?.email}
              avatarUrl={avatarUrl}
              onUploaded={setAvatarUrl}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Platform Defaults</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={form.platformName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, platformName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-currency">Default Currency</Label>
                <Input
                  id="default-currency"
                  value={form.defaultCurrency}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, defaultCurrency: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={form.supportEmail}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, supportEmail: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input
                  id="support-phone"
                  value={form.supportPhone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, supportPhone: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min={15}
                  max={720}
                  value={form.sessionTimeoutMinutes}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      sessionTimeoutMinutes: Number(event.target.value) || 120,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Payment Alert Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  value={form.paymentAlertThreshold}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      paymentAlertThreshold: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                <span className="text-sm font-medium">Require note on rejection</span>
                <Switch
                  checked={form.requireRejectionNote}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, requireRejectionNote: checked }))
                  }
                />
              </label>

              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                <span className="text-sm font-medium">Maintenance mode</span>
                <Switch
                  checked={form.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, maintenanceMode: checked }))
                  }
                />
              </label>
            </div>

            <div className="flex justify-end">
              <Button variant="accent" onClick={saveSettings} className="w-full sm:w-auto">
                Save Admin Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Admin Session</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Current User</p>
              <p className="text-muted-foreground">{user?.fullName}</p>
              <p className="break-all text-xs text-muted-foreground">{user?.email}</p>
              <div className="mt-2">
                <Badge variant="default">{user?.role ?? "guest"}</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Auth Provider</p>
              <p className="text-muted-foreground capitalize">{authMode}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Rejection Note Required</p>
              <Badge variant={form.requireRejectionNote ? "success" : "outline"} className="mt-1">
                {form.requireRejectionNote ? "Required" : "Optional"}
              </Badge>
            </div>

            <Button variant="outline" className="w-full" onClick={clearSession}>
              Log Out and Clear Session
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
