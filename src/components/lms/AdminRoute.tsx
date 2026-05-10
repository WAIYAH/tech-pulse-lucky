import type { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
};

export default AdminRoute;

