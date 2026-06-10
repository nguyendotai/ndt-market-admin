import { apiClient } from "@/lib/axios";
import type { Store, StoreFormPayload, StoreStatus } from "@/modules/stores";
import { normalizeBackendResponse } from "@/services/api-response";

export type StoreListParams = {
  search?: string;
  status?: StoreStatus | "all";
};

export const storeService = {
  async listStores(params?: StoreListParams) {
    const response = await apiClient.get("/stores", {
      params: {
        ...params,
        status: params?.status === "all" ? undefined : params?.status,
      },
    });
    return normalizeBackendResponse<Store[]>(response.data);
  },

  async createStore(payload: StoreFormPayload) {
    const response = await apiClient.post("/admin/stores", payload);
    return normalizeBackendResponse<Store>(response.data);
  },

  async updateStore(id: string, payload: Partial<StoreFormPayload>) {
    const response = await apiClient.patch(`/admin/stores/${id}`, payload);
    return normalizeBackendResponse<Store>(response.data);
  },

  async deleteStore(id: string) {
    const response = await apiClient.delete(`/admin/stores/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
