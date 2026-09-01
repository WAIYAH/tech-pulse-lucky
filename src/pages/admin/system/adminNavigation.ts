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
  path: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Overview",
    path: routes.admin.root,
    icon: Gauge,
  },
  {
    label: "Students",
    path: routes.admin.students,
    icon: Users,
  },
  {
    label: "Courses",
    path: routes.admin.courses,
    icon: BookOpen,
  },
  {
    label: "Webinars",
    path: routes.admin.webinars,
    icon: Video,
  },
  {
    label: "Articles",
    path: routes.admin.articles,
    icon: FileText,
  },
  {
    label: "Payments",
    path: routes.admin.payments,
    icon: CircleDollarSign,
  },
  {
    label: "Masterclass",
    path: routes.admin.masterclass,
    icon: Sparkles,
  },
  {
    label: "Support",
    path: routes.admin.support,
    icon: Headset,
  },
  {
    label: "Finance",
    path: routes.admin.finance,
    icon: Coins,
  },
  {
    label: "Website Content",
    path: routes.admin.content,
    icon: LayoutTemplate,
  },
  {
    label: "LMS Control",
    path: routes.admin.lmsControl,
    icon: ListChecks,
  },
  {
    label: "Settings",
    path: routes.admin.settings,
    icon: Settings2,
  },
];
