import { ADMIN_ALLOWED_ROLES } from "@/constants/roles";

export const ACCESS_TOKEN_STORAGE_KEY = "ndt_market_admin_access_token";

export function isAdminAllowedRole(role?: string | null) {
  if (!role) {
    return false;
  }

  return ADMIN_ALLOWED_ROLES.includes(
    role.toUpperCase() as (typeof ADMIN_ALLOWED_ROLES)[number],
  );
}

