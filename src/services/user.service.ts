import { apiClient } from "@/lib/axios";
import type { User, UserRole, UserStatus } from "@/modules/users";
import { normalizeBackendResponse } from "@/services/api-response";

export type UserListParams = {
  keyword?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  page?: number;
  limit?: number;
};

export const userService = {
  async listUsers(params?: UserListParams) {
    const requestParams = toUserListRequestParams(params);

    const response = await getWithFallback("/admin/users", "/users", requestParams);
    return normalizeBackendResponse<User[]>(response.data);
  },

  async getUserById(id: string) {
    const response = await getWithFallback(`/admin/users/${id}`, `/users/${id}`);
    return normalizeBackendResponse<User>(response.data);
  },

  async updateUserStatus(id: string, status: UserStatus) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return normalizeBackendResponse<User>(response.data);
  },

  async updateUserRole(id: string, role: UserRole, permissions?: string[]) {
    const response = await apiClient.patch(`/admin/users/${id}/role`, {
      role,
      permissions,
    });
    return normalizeBackendResponse<User>(response.data);
  },
};

function toUserListRequestParams(params?: UserListParams) {
  return {
    ...params,
    role: params?.role === "all" ? undefined : params?.role,
    status: params?.status === "all" ? undefined : params?.status,
  };
}

async function getWithFallback(primaryUrl: string, fallbackUrl: string, params?: Record<string, unknown>) {
  try {
    return await apiClient.get(primaryUrl, { params });
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    return apiClient.get(fallbackUrl, { params });
  }
}

function isNotFoundError(error: unknown) {
  return Boolean(error && typeof error === "object" && "status" in error && error.status === 404);
}
