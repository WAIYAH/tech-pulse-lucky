import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  UserCircle2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  studentNavItems,
  studentSecondaryRouteItems,
  type StudentNavItem,
} from "./studentNavigation";
import { useStudentPortal } from "./StudentPortalContext";

const SIDEBAR_COLLAPSE_KEY = "student_portal_sidebar_collapsed_v1";

const getInitials = (name?: string, email?: string): string => {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

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
              "group flex items-center rounded-xl border transition-all",
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5",
              active
                ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
            )}
          >
            <div className="relative shrink-0">
              <Icon className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
            {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
};

const StudentPortalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadNotificationsCount, courses } = useStudentPortal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readSidebarCollapsed);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, isSidebarCollapsed ? "1" : "0");
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const goTo = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  const activeItem = useMemo<StudentNavItem | undefined>(() => {
    return [...studentNavItems, ...studentSecondaryRouteItems].find((item) =>
      isPathActive(item.path, location.pathname),
    );
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
              "mb-5 rounded-2xl border border-primary/20 bg-gradient-hero text-primary-foreground shadow-glow",
              isSidebarCollapsed ? "px-2 py-3 text-center" : "px-4 py-4",
            )}
          >
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {!isSidebarCollapsed && "Student"}
            </p>
            {!isSidebarCollapsed && (
              <p className="mt-2 text-lg font-semibold">Learning Command Center</p>
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
              "mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3",
              isSidebarCollapsed && "justify-center",
            )}
            title={user?.email}
          >
            <Avatar className="h-9 w-9 shrink-0 border-2 border-accent/50">
              <AvatarImage src={user?.avatarUrl} alt="" />
              <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {getInitials(user?.fullName, user?.email)}
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <p className="min-w-0 truncate text-sm font-semibold text-foreground">
                {user?.fullName || user?.email}
              </p>
            )}
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
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
                  <p className="truncate text-sm font-semibold text-foreground md:text-base">
                    {activeItem?.label ?? "Student Portal"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon" asChild className="relative">
                  <Link to={routes.student.notifications} aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {unreadNotificationsCount > 0 && (
                      <Badge className="absolute -right-2 -top-2 h-5 min-w-5 px-1" variant="destructive">
                        {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-transparent transition-all hover:ring-accent focus-visible:outline-none focus-visible:ring-accent"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user?.avatarUrl} alt="" />
                        <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                          {getInitials(user?.fullName, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.student.profile}>
                        <UserCircle2 className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.student.settings}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.student.support}>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => void logout()}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 pb-24 md:px-6 md:py-6 lg:px-8 lg:pb-8">
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
                <div
                  className={cn(
                    "relative flex h-7 w-10 items-center justify-center rounded-full transition-colors",
                    active && "bg-accent/25",
                  )}
                >
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

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search your dashboard..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {studentNavItems.map((item) => (
              <CommandItem key={item.path} onSelect={() => goTo(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Account">
            {studentSecondaryRouteItems.map((item) => (
              <CommandItem key={item.path} onSelect={() => goTo(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {courses.length > 0 && (
            <CommandGroup heading="Courses">
              {courses.slice(0, 8).map((course) => (
                <CommandItem
                  key={course.id}
                  value={course.title}
                  onSelect={() => goTo(routes.public.course(course.slug))}
                >
                  <BookOpenCheck className="mr-2 h-4 w-4" />
                  {course.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default StudentPortalLayout;
