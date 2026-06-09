import { apiClient } from "@/lib/axios";
import type { AuthUser, LoginRequest, LoginResponse } from "@/modules/auth/types";
import { normalizeBackendResponse } from "@/services/api-response";

type LoginPayload = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
};

export const authService = {
  async login(payload: LoginRequest) {
    const response = await apiClient.post<LoginResponse | LoginPayload>("/auth/login", payload);
    const normalized = normalizeBackendResponse<LoginPayload>(response.data);

    return {
      ...normalized.data,
      success: normalized.success,
      message: normalized.message,
      data: normalized.data,
      meta: normalized.meta,
    } satisfies LoginResponse;
  },

  async me() {
    const response = await apiClient.get<AuthUser | { data: AuthUser }>("/auth/me");
    return normalizeBackendResponse<AuthUser>(response.data).data;
  },

  async logout() {
    try {
      const response = await apiClient.post("/auth/logout");
      return normalizeBackendResponse<null>(response.data);
    } catch {
      return {
        success: true,
        message: "Logged out locally",
        data: null,
      };
    }
  },
};

export function getAccessTokenFromLoginResponse(response: LoginResponse) {
  return response.accessToken ?? response.token ?? response.data?.accessToken ?? response.data?.token ?? null;
}

export function getUserFromLoginResponse(response: LoginResponse) {
  return response.user ?? response.data?.user ?? null;
}

