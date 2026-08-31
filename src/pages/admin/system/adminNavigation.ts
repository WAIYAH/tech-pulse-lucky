import type { LucideIcon } from "lucide-react";
import {
  FileText,
  BookOpen,
  CircleDollarSign,
  Coins,
  Gauge,
  Headset,
  LayoutTemplate,
  ListChecks,
  Settings2,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { routes } from "@/routes/routeConfig";

export interface AdminNavItem {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Overview",
    description: "Platform activity and high-level KPIs",
    path: routes.admin.root,
    icon: Gauge,
  },
  {
    label: "Students",
    description: "Learner accounts, enrollment status, activity",
    path: routes.admin.students,
    icon: Users,
  },
  {
    label: "Courses",
    description: "Create and maintain LMS courses and lessons",
    path: routes.admin.courses,
    icon: BookOpen,
  },
  {
    label: "Webinars",
    description: "Review event schedule and registration readiness",
    path: routes.admin.webinars,
    icon: Video,
  },
  {
    label: "Articles",
    description: "Review published article catalog and metadata",
    path: routes.admin.articles,
    icon: FileText,
  },
  {
    label: "Payments",
    description: "Review and approve paid course submissions",
    path: routes.admin.payments,
    icon: CircleDollarSign,
  },
  {
    label: "Masterclass",
    description: "Cohorts, curriculum, final projects, and certificates",
    path: routes.admin.masterclass,
    icon: Sparkles,
  },
  {
    label: "Support",
    description: "Handle student support tickets and responses",
    path: routes.admin.support,
    icon: Headset,
  },
  {
    label: "Finance",
    description: "Revenue summaries and monthly payout metrics",
    path: routes.admin.finance,
    icon: Coins,
  },
  {
    label: "Website Content",
    description: "Homepage messaging and SEO preferences",
    path: routes.admin.content,
    icon: LayoutTemplate,
  },
  {
    label: "LMS Control",
    description: "Payment rails, features, and operational controls",
    path: routes.admin.lmsControl,
    icon: ListChecks,
  },
  {
    label: "Settings",
    description: "Admin profile, operations, and platform defaults",
    path: routes.admin.settings,
    icon: Settings2,
  },
];
