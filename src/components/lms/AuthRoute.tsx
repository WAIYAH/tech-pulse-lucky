import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { routes } from "@/routes/routeConfig";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Preparing your session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const target = user?.role === "admin" ? routes.admin.root : routes.student.overview;
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
