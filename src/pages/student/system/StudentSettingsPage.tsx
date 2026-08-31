import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  readStudentSettingsState,
  saveStudentSettingsState,
  type StudentSettingsState,
} from "@/lib/student/studentPortalState";
import { useStudentPortal } from "./StudentPortalContext";

const defaultSettings: StudentSettingsState = {
  emailNotifications: true,
  smsNotifications: false,
  weeklyDigest: true,
  webinarReminders: true,
  autoplayNextLesson: true,
  highContrastMode: false,
};

const StudentSettingsPage = () => {
  const { user } = useStudentPortal();
  const { toast } = useToast();
  const [settings, setSettings] = useState<StudentSettingsState>(() =>
    user ? readStudentSettingsState(user.id) : defaultSettings,
  );

  useEffect(() => {
    if (!user) return;
    document.body.classList.toggle(
      "student-high-contrast",
      settings.highContrastMode,
    );
  }, [settings.highContrastMode, user]);

  if (!user) return null;

  const saveSettings = () => {
    saveStudentSettingsState(user.id, settings);
    toast({
      title: "Settings saved",
      description: "Your portal preferences were updated.",
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveStudentSettingsState(user.id, defaultSettings);
    toast({
      title: "Settings reset",
      description: "Preferences were restored to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure notifications and behavior preferences for your student portal.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Email notifications</span>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, emailNotifications: checked }))
                }
              />
            </label>
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">SMS notifications</span>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, smsNotifications: checked }))
                }
              />
            </label>
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Weekly digest summary</span>
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, weeklyDigest: checked }))
                }
              />
            </label>
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Webinar reminders</span>
              <Switch
                checked={settings.webinarReminders}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, webinarReminders: checked }))
                }
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Learning Experience</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Autoplay next lesson</span>
              <Switch
                checked={settings.autoplayNextLesson}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, autoplayNextLesson: checked }))
                }
              />
            </label>
            <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">High contrast mode</span>
              <Switch
                checked={settings.highContrastMode}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, highContrastMode: checked }))
                }
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={saveSettings} className="w-full sm:w-auto">Save Settings</Button>
              <Button variant="outline" onClick={resetSettings} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentSettingsPage;
