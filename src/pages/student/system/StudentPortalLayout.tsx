import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  UserCircle2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { routes } from "@/routes/routeConfig";
import { studentNavItems, type StudentNavItem } from "./studentNavigation";
import { useStudentPortal } from "./StudentPortalContext";

const SIDEBAR_COLLAPSE_KEY = "student_portal_sidebar_collapsed_v1";

const isPathActive = (itemPath: string, pathname: string): boolean => {
  if (itemPath === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const readSidebarCollapsed = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
};

const quickNavItems = [
  { label: "Home", path: routes.student.overview, icon: LayoutDashboard },
  { label: "Courses", path: routes.student.myCourses, icon: BookOpenCheck },
  { label: "Webinars", path: routes.student.webinars, icon: Video },
  { label: "Alerts", path: routes.student.notifications, icon: Bell },
  { label: "Profile", path: routes.student.profile, icon: UserCircle2 },
] as const;

const StudentNav = ({
  pathname,
  collapsed,
  unreadNotificationsCount,
  onItemClick,
}: {
  pathname: string;
  collapsed: boolean;
  unreadNotificationsCount: number;
  onItemClick?: () => void;
}) => {
  return (
    <nav className="space-y-1">
      {studentNavItems.map((item) => {
        const active = isPathActive(item.path, pathname);
        const Icon = item.icon;
        const notificationCount =
          item.path === routes.student.notifications ? unreadNotificationsCount : 0;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex rounded-xl border transition-all",
              collapsed
                ? "items-center justify-center px-2 py-3"
                : "items-start gap-3 px-3 py-3",
              active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
            )}
          >
            <div className="relative shrink-0">
              <Icon className={cn("h-4 w-4", collapsed ? "mt-0" : "mt-0.5")} />
              {notificationCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="flex-1">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

const StudentPortalLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useStudentPortal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readSidebarCollapsed);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, isSidebarCollapsed ? "1" : "0");
  }, [isSidebarCollapsed]);

  const activeItem = useMemo<StudentNavItem | undefined>(() => {
    return studentNavItems.find((item) => isPathActive(item.path, location.pathname));
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-140px] h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-140px] h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "hidden border-r border-border/70 bg-card/90 px-3 py-6 backdrop-blur transition-all lg:block",
            isSidebarCollapsed ? "w-[92px]" : "w-[300px]",
          )}
        >
          <div
            className={cn(
              "mb-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/95 via-primary/80 to-primary text-primary-foreground shadow-lg",
              isSidebarCollapsed ? "px-2 py-3 text-center" : "px-4 py-4",
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
              Student
            </p>
            {!isSidebarCollapsed && (
              <>
                <p className="mt-2 text-lg font-semibold">Learning Command Center</p>
                <p className="mt-1 text-xs text-primary-foreground/85">
                  Progress, learning tools, and support for your journey.
                </p>
              </>
            )}
          </div>

          <div className="mb-3 flex justify-end">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <StudentNav
            pathname={location.pathname}
            collapsed={isSidebarCollapsed}
            unreadNotificationsCount={unreadNotificationsCount}
          />

          <div
            className={cn(
              "mt-6 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground",
              isSidebarCollapsed && "text-center",
            )}
          >
            {!isSidebarCollapsed && "Signed in as"}
            <p
              className={cn(
                "mt-1 truncate text-sm font-semibold text-foreground",
                isSidebarCollapsed && "text-[11px]",
              )}
              title={user?.email}
            >
              {isSidebarCollapsed ? "Account" : user?.email}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="lg:hidden"
                    >
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Open portal navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[88vw] max-w-[360px] p-4">
                    <SheetHeader>
                      <SheetTitle>Student Navigation</SheetTitle>
                      <SheetDescription>
                        Move across your learning workspace.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                      <StudentNav
                        pathname={location.pathname}
                        collapsed={false}
                        unreadNotificationsCount={unreadNotificationsCount}
                        onItemClick={() => setMobileOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hidden lg:inline-flex"
                  onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                  aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {activeItem?.label ?? "Student Portal"}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground md:text-base">
                    {activeItem?.description ?? "Personal learning workspace"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <Button variant="outline" size="icon" asChild className="relative sm:hidden">
                  <Link to={routes.student.notifications} aria-label="Open notifications">
                    <Bell className="h-4 w-4" />
                    {unreadNotificationsCount > 0 && (
                      <Badge className="absolute -right-2 -top-2 h-5 min-w-5 px-1" variant="destructive">
                        {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button variant="outline" size="sm" asChild className="relative hidden sm:inline-flex">
                  <Link to={routes.student.notifications}>
                    <Bell className="mr-1 h-4 w-4" />
                    Notifications
                    {unreadNotificationsCount > 0 && (
                      <Badge className="ml-2" variant="destructive">
                        {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button variant="outline" size="icon" asChild className="sm:hidden">
                  <Link to={routes.public.courses} aria-label="Browse courses">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link to={routes.public.courses}>
                    Browse Courses
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="secondary" size="icon" onClick={() => void logout()} className="sm:hidden">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>

                <Button variant="secondary" size="sm" onClick={() => void logout()} className="hidden sm:inline-flex">
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 pb-24 md:px-6 md:py-6 lg:px-8 lg:pb-8">
            <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Your dashboard is private and visible only to authenticated learners.
            </div>
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {quickNavItems.map((item) => {
            const active = isPathActive(item.path, location.pathname);
            const Icon = item.icon;
            const count =
              item.path === routes.student.notifications ? unreadNotificationsCount : 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div className="relative">
                  <Icon className="h-4 w-4" />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default StudentPortalLayout;
