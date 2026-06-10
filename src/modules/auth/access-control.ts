import type { AdminMenuItem } from "@/configs/menu";
import type { AuthUser } from "@/modules/auth/types";
import type { UserRole } from "@/modules/users";

export type AccessRule = {
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
};

export function isSuperAdmin(user?: Pick<AuthUser, "role"> | null) {
  return user?.role === "SUPER_ADMIN";
}

export function hasRequiredRole(user: Pick<AuthUser, "role"> | null | undefined, requiredRoles?: UserRole[]) {
  if (!requiredRoles?.length) return true;
  if (isSuperAdmin(user)) return true;

  return Boolean(user?.role && requiredRoles.includes(user.role));
}

export function hasRequiredPermissions(
  user: Pick<AuthUser, "permissions" | "role"> | null | undefined,
  requiredPermissions?: string[],
) {
  if (!requiredPermissions?.length) return true;
  if (isSuperAdmin(user)) return true;

  const userPermissions = new Set(user?.permissions ?? []);
  return requiredPermissions.every((permission) => userPermissions.has(permission));
}

export function canAccess(user: AuthUser | null | undefined, rule?: AccessRule) {
  if (!rule) return true;

  return hasRequiredRole(user, rule.requiredRoles) && hasRequiredPermissions(user, rule.requiredPermissions);
}

export function canAccessMenuItem(user: AuthUser | null | undefined, item: AdminMenuItem) {
  return canAccess(user, {
    requiredPermissions: item.requiredPermissions,
    requiredRoles: item.requiredRoles,
  });
}
