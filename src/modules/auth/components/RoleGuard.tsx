"use client";

import { AccessDenied } from "@/components/common/access-denied";
import { hasRequiredRole } from "@/modules/auth/access-control";
import type { UserRole } from "@/modules/users";
import { useAppSelector } from "@/store/hooks";

type RoleGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: UserRole[];
};

export function RoleGuard({ children, fallback, requiredRoles }: RoleGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!hasRequiredRole(user, requiredRoles)) {
    return fallback ?? <AccessDenied />;
  }

  return children;
}
