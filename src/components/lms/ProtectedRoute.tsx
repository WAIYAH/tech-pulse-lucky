import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { LmsRole } from "@/types/lms";
import { useAuth } from "@/contexts/AuthContext";
import { routes } from "@/routes/routeConfig";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: LmsRole[];
}

const AuthLoadingState = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={routes.auth.login}
        replace
        state={{
          from: `${location.pathname}${location.search}`,
          reason: "login_required",
        }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackRoute =
      user.role === "admin" ? routes.admin.root : routes.student.overview;
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
