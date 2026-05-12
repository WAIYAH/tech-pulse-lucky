import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  type AdminLmsControlState,
  readAdminLmsControlState,
  saveAdminLmsControlState,
} from "@/lib/admin/adminState";
import { lmsProvider } from "@/lib/lms";
import type { LmsConfig, LmsCourse, LmsPayment } from "@/types/lms";

const AdminLmsControlPage = () => {
  const { toast } = useToast();
  const [controlState, setControlState] = useState<AdminLmsControlState>(() =>
    readAdminLmsControlState(),
  );
  const [config, setConfig] = useState<LmsConfig>(lmsProvider.getConfig());
  const [courses, setCourses] = useState<LmsCourse[]>([]);
  const [payments, setPayments] = useState<LmsPayment[]>([]);

  useEffect(() => {
    const load = async () => {
      const [courseRows, paymentRows] = await Promise.all([
        lmsProvider.listCourses(),
        lmsProvider.getAllPayments(),
      ]);
      setCourses(courseRows);
      setPayments(paymentRows);
      setConfig(lmsProvider.getConfig());
    };

    load();
  }, []);

  const paymentSummary = useMemo(() => {
    const pending = payments.filter((row) => row.status === "pending").length;
    const approved = payments.filter((row) => row.status === "approved").length;
    return { pending, approved };
  }, [payments]);

  const saveControls = () => {
    saveAdminLmsControlState(controlState);
    toast({
      title: "LMS controls updated",
      description: "Operational feature toggles were saved locally.",
    });
  };

  const runHealthCheck = () => {
    const freeCourses = courses.filter((row) => row.isFree).length;
    const paidCourses = courses.length - freeCourses;
    toast({
      title: "LMS health check complete",
      description: `${courses.length} courses (${freeCourses} free / ${paidCourses} paid), ${paymentSummary.pending} pending payments.`,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">LMS Control Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Operational controls for features, payment rails, and admin runtime checks.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Feature Controls</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Enable certificates</span>
              <Switch
                checked={controlState.enableCertificates}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({ ...prev, enableCertificates: checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Enable email notifications</span>
              <Switch
                checked={controlState.enableEmailNotifications}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({
                    ...prev,
                    enableEmailNotifications: checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Enable live classes</span>
              <Switch
                checked={controlState.enableLiveClasses}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({ ...prev, enableLiveClasses: checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Enable waitlist mode</span>
              <Switch
                checked={controlState.enableWaitlist}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({ ...prev, enableWaitlist: checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">Payment collection enabled</span>
              <Switch
                checked={controlState.paymentCollectionEnabled}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({
                    ...prev,
                    paymentCollectionEnabled: checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
              <span className="text-sm font-medium">
                Auto-archive rejected payments
              </span>
              <Switch
                checked={controlState.autoArchiveRejectedPayments}
                onCheckedChange={(checked) =>
                  setControlState((prev) => ({
                    ...prev,
                    autoArchiveRejectedPayments: checked,
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Runtime Status</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Provider Mode</p>
              <p className="text-muted-foreground">
                {(import.meta.env.VITE_LMS_DATA_PROVIDER ?? "auto").toString()}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Auth Mode</p>
              <p className="text-muted-foreground">
                {import.meta.env.VITE_ENABLE_SUPABASE_AUTH === "true"
                  ? "Supabase"
                  : "Local"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Pending Approvals</p>
              <p className="text-muted-foreground">{paymentSummary.pending}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="font-medium">Courses Published</p>
              <p className="text-muted-foreground">{courses.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Payment Rail Configuration</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-sm font-medium">{config.payment.methodName}</p>
              <p className="text-sm text-muted-foreground">
                Paybill {config.payment.paybillNumber} • Account {config.payment.accountNumber}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Account Name: {config.payment.accountName}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-sm font-medium">Instruction Steps</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {config.payment.instructionSteps.map((step, index) => (
                  <Badge key={`${index}-${step}`} variant="secondary">
                    {index + 1}. {step}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={runHealthCheck} variant="outline">
                Run LMS Health Check
              </Button>
              <Button onClick={saveControls}>Save LMS Controls</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Feature Flags</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border p-2">
              <span>Certificates</span>
              <Badge variant={controlState.enableCertificates ? "secondary" : "outline"}>
                {controlState.enableCertificates ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-2">
              <span>Email Notifications</span>
              <Badge
                variant={controlState.enableEmailNotifications ? "secondary" : "outline"}
              >
                {controlState.enableEmailNotifications ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-2">
              <span>Live Classes</span>
              <Badge variant={controlState.enableLiveClasses ? "secondary" : "outline"}>
                {controlState.enableLiveClasses ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-2">
              <span>Waitlist Mode</span>
              <Badge variant={controlState.enableWaitlist ? "secondary" : "outline"}>
                {controlState.enableWaitlist ? "On" : "Off"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminLmsControlPage;
