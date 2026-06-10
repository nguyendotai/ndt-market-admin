"use client";

import { AccessDenied } from "@/components/common/access-denied";
import { canAccess } from "@/modules/auth/access-control";
import type { UserRole } from "@/modules/users";
import { useAppSelector } from "@/store/hooks";

type PermissionGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: UserRole[];
};

export function PermissionGuard({
  children,
  fallback,
  requiredPermissions,
  requiredRoles,
}: PermissionGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!canAccess(user, { requiredPermissions, requiredRoles })) {
    return fallback ?? <AccessDenied />;
  }

  return children;
}
