import { apiClient } from "@/lib/axios";
import type { AuthUser, LoginRequest, LoginResponse } from "@/modules/auth/types";

export const authService = {
  async login(payload: LoginRequest) {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  async me() {
    const response = await apiClient.get<AuthUser | { data: AuthUser }>("/auth/me");
    return "data" in response.data ? response.data.data : response.data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Backend may not expose logout; client logout still clears local session.
    }
  },
};

export function getAccessTokenFromLoginResponse(response: LoginResponse) {
  return response.accessToken ?? response.token ?? response.data?.accessToken ?? response.data?.token ?? null;
}

export function getUserFromLoginResponse(response: LoginResponse) {
  return response.user ?? response.data?.user ?? null;
}

