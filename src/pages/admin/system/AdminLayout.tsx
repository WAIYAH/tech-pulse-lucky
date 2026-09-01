import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CircleDollarSign,
  Gauge,
  Globe,
  Headset,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { readAdminActivityFeed } from "@/lib/admin/adminNotifications";
import { subscribeStudentExperience } from "@/lib/student/studentPortalState";
import { routes } from "@/routes/routeConfig";
import { adminNavItems, type AdminNavItem } from "./adminNavigation";

const SIDEBAR_COLLAPSE_KEY = "admin_portal_sidebar_collapsed_v1";

const getInitials = (name?: string, email?: string): string => {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

const quickAdminNavItems = [
  { label: "Overview", path: routes.admin.root, icon: Gauge },
  { label: "Students", path: routes.admin.students, icon: Users },
  { label: "Payments", path: routes.admin.payments, icon: CircleDollarSign },
  { label: "Support", path: routes.admin.support, icon: Headset },
  { label: "Settings", path: routes.admin.settings, icon: Settings2 },
] as const;

const isPathActive = (itemPath: string, pathname: string): boolean => {
  if (itemPath === "/admin") {
    return pathname === "/admin";
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const readSidebarCollapsed = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
};

const AdminNav = ({
  pathname,
  collapsed,
  onItemClick,
}: {
  pathname: string;
  collapsed: boolean;
  onItemClick?: () => void;
}) => {
  return (
    <nav className="space-y-1">
      {adminNavItems.map((item) => {
        const active = isPathActive(item.path, pathname);
        const Icon = item.icon;

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
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readSidebarCollapsed);
  const [actionableCount, setActionableCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadCount = async () => {
      const items = await readAdminActivityFeed();
      if (!isMounted) return;
      setActionableCount(items.filter((item) => item.needsAction).length);
    };
    void loadCount();
    const unsubscribe = subscribeStudentExperience(() => void loadCount());
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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

  const activeItem = useMemo<AdminNavItem | undefined>(() => {
    return adminNavItems.find((item) => isPathActive(item.path, location.pathname));
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-[-180px] h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-120px] h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
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
              {!isSidebarCollapsed && "Admin"}
            </p>
            {!isSidebarCollapsed && (
              <p className="mt-2 text-lg font-semibold">Tech Pulse Operations</p>
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

          <AdminNav pathname={location.pathname} collapsed={isSidebarCollapsed} />

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
                      <span className="sr-only">Open admin navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[88vw] max-w-[360px] p-4">
                    <SheetHeader>
                      <SheetTitle>Admin Navigation</SheetTitle>
                      <SheetDescription>
                        Move across LMS operations and website controls.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                      <AdminNav
                        pathname={location.pathname}
                        collapsed={false}
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
                    {activeItem?.label ?? "Admin"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={routes.public.home} aria-label="Back to site">
                    <Globe className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon" className="relative" asChild>
                  <Link to={routes.admin.notifications} aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {actionableCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                        {actionableCount > 9 ? "9+" : actionableCount}
                      </span>
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
                      <Link to={routes.admin.settings}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={routes.admin.support}>
                        <Headset className="mr-2 h-4 w-4" />
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
          {quickAdminNavItems.map((item) => {
            const active = isPathActive(item.path, location.pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search admin sections..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {adminNavItems.map((item) => (
              <CommandItem key={item.path} onSelect={() => goTo(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default AdminLayout;
