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
  accessToken?: string;
  token?: string;
  user?: AuthUser;
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
