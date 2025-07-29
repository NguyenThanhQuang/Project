import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../../store";

type Role = "user" | "company_admin" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<Role>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  console.log(
    `[ProtectedRoute] Path: ${
      location.pathname
    }. User exists: ${!!user}. User roles: ${user?.roles}`
  );

  if (!user) {
    return (
      <Navigate to="/" state={{ from: location, openAuth: true }} replace />
    );
  }

  const hasRequiredRole = user.roles.some((role) =>
    allowedRoles.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
