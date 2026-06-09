export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
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

export type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
};
