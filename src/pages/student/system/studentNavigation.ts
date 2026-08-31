import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  BookOpenCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  NotebookPen,
  Settings2,
  UserCircle2,
  Video,
  WalletCards,
} from "lucide-react";
import { routes } from "@/routes/routeConfig";

export interface StudentNavItem {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export const studentNavItems: StudentNavItem[] = [
  {
    label: "Overview",
    description: "Your learning dashboard and activity",
    path: routes.student.overview,
    icon: LayoutDashboard,
  },
  {
    label: "Progress",
    description: "Track milestones and completion",
    path: routes.student.progress,
    icon: GraduationCap,
  },
  {
    label: "My Courses",
    description: "Manage enrollments and continue learning",
    path: routes.student.myCourses,
    icon: BookOpenCheck,
  },
  {
    label: "Payments",
    description: "Payment history and approval status",
    path: routes.student.payments,
    icon: CreditCard,
  },
  {
    label: "Assignments",
    description: "Course tasks and submission readiness",
    path: routes.student.assignments,
    icon: NotebookPen,
  },
  {
    label: "Certificates",
    description: "Eligibility and earned achievements",
    path: routes.student.certificates,
    icon: BadgeCheck,
  },
  {
    label: "Webinars",
    description: "Upcoming sessions and watch links",
    path: routes.student.webinars,
    icon: Video,
  },
  {
    label: "Notifications",
    description: "Updates on payments, support, and learning",
    path: routes.student.notifications,
    icon: Bell,
  },
  {
    label: "Resources",
    description: "Downloads, links, and study materials",
    path: routes.student.resources,
    icon: WalletCards,
  },
  {
    label: "Support",
    description: "Help center and support requests",
    path: routes.student.support,
    icon: LifeBuoy,
  },
  {
    label: "Profile",
    description: "Account details and learning profile",
    path: routes.student.profile,
    icon: UserCircle2,
  },
  {
    label: "Settings",
    description: "Notifications, preferences, and controls",
    path: routes.student.settings,
    icon: Settings2,
  },
];
