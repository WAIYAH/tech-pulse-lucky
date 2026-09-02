import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
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
  path: string;
  icon: LucideIcon;
  description?: string;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Overview",
    path: routes.admin.root,
    icon: Gauge,
    description: "Key metrics at a glance",
  },
  {
    label: "Students",
    path: routes.admin.students,
    icon: Users,
    description: "Manage learner accounts and enrollments",
  },
  {
    label: "Courses",
    path: routes.admin.courses,
    icon: BookOpen,
    description: "Create and edit the course catalog",
  },
  {
    label: "Webinars",
    path: routes.admin.webinars,
    icon: Video,
    description: "Schedule and manage live sessions",
  },
  {
    label: "Articles",
    path: routes.admin.articles,
    icon: FileText,
    description: "Publish and edit blog content",
  },
  {
    label: "Payments",
    path: routes.admin.payments,
    icon: CircleDollarSign,
    description: "Review and approve payment submissions",
  },
  {
    label: "Masterclass",
    path: routes.admin.masterclass,
    icon: Sparkles,
    description: "Manage cohorts and curriculum",
  },
  {
    label: "Support",
    path: routes.admin.support,
    icon: Headset,
    description: "Respond to learner support tickets",
  },
  {
    label: "Finance",
    path: routes.admin.finance,
    icon: Coins,
    description: "Revenue and payment totals",
  },
  {
    label: "Reports",
    path: routes.admin.reports,
    icon: BarChart3,
    description: "Charts, trends, and rule-based insights",
  },
  {
    label: "Website Content",
    path: routes.admin.content,
    icon: LayoutTemplate,
    description: "Edit public site content",
  },
  {
    label: "LMS Control",
    path: routes.admin.lmsControl,
    icon: ListChecks,
    description: "Configure platform-wide LMS settings",
  },
  {
    label: "Settings",
    path: routes.admin.settings,
    icon: Settings2,
    description: "Admin account and system preferences",
  },
];
