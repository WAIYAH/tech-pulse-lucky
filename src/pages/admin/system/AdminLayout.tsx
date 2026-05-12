import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, LogOut, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { adminNavItems, type AdminNavItem } from "./adminNavigation";

const isPathActive = (itemPath: string, pathname: string): boolean => {
  if (itemPath === "/admin") {
    return pathname === "/admin";
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const AdminNav = ({
  pathname,
  onItemClick,
}: {
  pathname: string;
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
            className={cn(
              "group flex items-start gap-3 rounded-xl border px-3 py-3 transition-all",
              active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const activeItem = useMemo<AdminNavItem | undefined>(() => {
    return adminNavItems.find((item) => isPathActive(item.path, location.pathname));
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-[-180px] h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-120px] h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[300px_1fr]">
        <aside className="hidden border-r border-border/70 bg-card/90 px-5 py-6 backdrop-blur lg:block">
          <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/95 via-primary/80 to-primary px-4 py-4 text-primary-foreground shadow-lg">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
              Admin Console
            </p>
            <p className="mt-2 text-lg font-semibold">Tech Pulse Operations</p>
            <p className="mt-1 text-xs text-primary-foreground/85">
              Manage LMS, payments, students, and website controls.
            </p>
          </div>

          <AdminNav pathname={location.pathname} />

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            Signed in as
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {user?.email}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
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
                        onItemClick={() => setMobileOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {activeItem?.label ?? "Admin"}
                  </p>
                  <p className="text-sm font-semibold text-foreground md:text-base">
                    {activeItem?.description ?? "Administration"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={routes.public.home}>
                    Back to Site
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" onClick={logout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8">
            <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Admin routes are role-protected and unavailable to non-admin users.
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
