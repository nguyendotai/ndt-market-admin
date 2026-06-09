export const USER_ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ADMIN_ALLOWED_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.STAFF,
  USER_ROLES.SUPER_ADMIN,
] as const;
