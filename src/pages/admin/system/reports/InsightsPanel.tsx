import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronDown, ChevronUp, Info, TrendingUp } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/student/EmptyState";
import { exportToCsv } from "@/lib/exportToCsv";
import allCaughtUpImage from "@/assets/empty-states/all-caught-up.svg";
import type { AdminUserOverview, LmsEnrollment } from "@/types/lms";
import { isAtRiskEnrollment, type Insight, type InsightSeverity } from "./insightsEngine";

const severityBadgeVariant: Record<InsightSeverity, NonNullable<BadgeProps["variant"]>> = {
  positive: "success",
  warning: "warning",
  critical: "destructive",
  info: "outline",
};

const severityIcon: Record<InsightSeverity, typeof TrendingUp> = {
  positive: TrendingUp,
  warning: AlertTriangle,
  critical: AlertTriangle,
  info: Info,
};

interface InsightsPanelProps {
  insights: Insight[];
  users: AdminUserOverview[];
  enrollments: LmsEnrollment[];
}

const InsightsPanel = ({ insights, users, enrollments }: InsightsPanelProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExportEngagement = () => {
    const atRiskUserIds = new Set(
      enrollments.filter(isAtRiskEnrollment).map((enrollment) => enrollment.userId),
    );

    exportToCsv(
      "student-engagement.csv",
      [
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "dateJoined", label: "Date Joined" },
        { key: "approvedEnrollments", label: "Approved Enrollments" },
        { key: "pendingEnrollments", label: "Pending Enrollments" },
        { key: "totalPayments", label: "Total Payments" },
        { key: "latestPaymentStatus", label: "Latest Payment Status" },
        { key: "atRisk", label: "At Risk" },
      ],
      users.map((user) => ({
        ...user,
        latestPaymentStatus: user.latestPaymentStatus ?? "none",
        atRisk: atRiskUserIds.has(user.id) ? "Yes" : "No",
      })),
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Insights</h2>
        <p className="text-sm text-muted-foreground">
          Rule-based observations computed from your current data.
        </p>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <EmptyState
            image={allCaughtUpImage}
            title="Nothing stands out yet"
            description="Insights will appear here once there's enough enrollment and payment activity to analyze."
          />
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = severityIcon[insight.severity];
              const isExpanded = expandedId === insight.id;
              return (
                <div key={insight.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{insight.title}</p>
                        {insight.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{insight.description}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={severityBadgeVariant[insight.severity]} className="shrink-0 capitalize">
                      {insight.severity}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {insight.actionPath && insight.actionLabel && (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={insight.actionPath}>{insight.actionLabel}</Link>
                      </Button>
                    )}
                    {insight.detail && insight.detail.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                      >
                        {isExpanded ? "Hide details" : "Show details"}
                        {isExpanded ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>

                  {isExpanded && insight.detail && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      {insight.detail.map((row) => (
                        <div
                          key={`${row.userId}-${row.courseTitle}`}
                          className="flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <p className="font-medium text-foreground">{row.fullName}</p>
                            <p className="text-muted-foreground">
                              {row.courseTitle} • {row.progress}% complete
                            </p>
                          </div>
                          <span className="text-muted-foreground">
                            {row.daysSinceActivity}d inactive
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={handleExportEngagement} disabled={users.length === 0}>
          Export Student Engagement (CSV)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightsPanel;
