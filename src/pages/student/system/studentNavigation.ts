import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  BookOpenCheck,
  Compass,
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
  path: string;
  icon: LucideIcon;
}

export const studentNavItems: StudentNavItem[] = [
  {
    label: "Overview",
    path: routes.student.overview,
    icon: LayoutDashboard,
  },
  {
    label: "Progress",
    path: routes.student.progress,
    icon: GraduationCap,
  },
  {
    label: "My Courses",
    path: routes.student.myCourses,
    icon: BookOpenCheck,
  },
  {
    label: "Browse Courses",
    path: routes.student.browseCourses,
    icon: Compass,
  },
  {
    label: "Payments",
    path: routes.student.payments,
    icon: CreditCard,
  },
  {
    label: "Assignments",
    path: routes.student.assignments,
    icon: NotebookPen,
  },
  {
    label: "Certificates",
    path: routes.student.certificates,
    icon: BadgeCheck,
  },
  {
    label: "Webinars",
    path: routes.student.webinars,
    icon: Video,
  },
  {
    label: "Resources",
    path: routes.student.resources,
    icon: WalletCards,
  },
];

// Not in the sidebar — reachable via the header's notification icon and the
// account dropdown instead — but kept here so the header can still show a
// page title when a student is on one of these routes.
export const studentSecondaryRouteItems: StudentNavItem[] = [
  {
    label: "Notifications",
    path: routes.student.notifications,
    icon: Bell,
  },
  {
    label: "Support",
    path: routes.student.support,
    icon: LifeBuoy,
  },
  {
    label: "Profile",
    path: routes.student.profile,
    icon: UserCircle2,
  },
  {
    label: "Settings",
    path: routes.student.settings,
    icon: Settings2,
  },
];
