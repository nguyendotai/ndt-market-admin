import type { UserRole, UserStatus } from "@/modules/users";

export type AuthUser = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  role: UserRole;
  permissions?: string[];
  status?: UserStatus;
  membershipTier?: string;
  totalPoints?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  meta?: Record<string, unknown>;
  data?: {
    accessToken?: string;
    token?: string;
    user?: AuthUser;
  };
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
};
