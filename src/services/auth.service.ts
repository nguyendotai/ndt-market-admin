import { apiClient } from "@/lib/axios";
import type {
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/modules/auth/types";
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

  async register(payload: RegisterRequest) {
    const response = await apiClient.post<LoginResponse | LoginPayload>("/auth/register", {
      ...payload,
      fullName: emptyToUndefined(payload.fullName),
      phone: emptyToUndefined(payload.phone),
      avatar: emptyToUndefined(payload.avatar),
    });
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

  async changePassword(payload: ChangePasswordRequest) {
    const response = await apiClient.patch("/auth/change-password", payload);
    return normalizeBackendResponse<null>(response.data);
  },
};

export function getAccessTokenFromLoginResponse(response: LoginResponse) {
  return response.accessToken ?? response.token ?? response.data?.accessToken ?? response.data?.token ?? null;
}

export function getUserFromLoginResponse(response: LoginResponse) {
  return response.user ?? response.data?.user ?? null;
}

function emptyToUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
