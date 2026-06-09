import type { AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/axios";
import type { BackendResponse } from "@/services/api-response";
import { normalizeBackendResponse } from "@/services/api-response";

export type ListParams = Record<string, string | number | boolean | undefined | null>;

export function createCrudService<TItem, TCreate = Partial<TItem>, TUpdate = Partial<TItem>>(
  endpoint: string,
) {
  return {
    async list(params?: ListParams, config?: AxiosRequestConfig) {
      const response = await apiClient.get(endpoint, { ...config, params });
      return normalizeBackendResponse<TItem[]>(response.data);
    },

    async getById(id: string | number, config?: AxiosRequestConfig) {
      const response = await apiClient.get(`${endpoint}/${id}`, config);
      return normalizeBackendResponse<TItem>(response.data);
    },

    async create(payload: TCreate, config?: AxiosRequestConfig) {
      const response = await apiClient.post(endpoint, payload, config);
      return normalizeBackendResponse<TItem>(response.data);
    },

    async update(id: string | number, payload: TUpdate, config?: AxiosRequestConfig) {
      const response = await apiClient.put(`${endpoint}/${id}`, payload, config);
      return normalizeBackendResponse<TItem>(response.data);
    },

    async remove(id: string | number, config?: AxiosRequestConfig): Promise<BackendResponse<null>> {
      const response = await apiClient.delete(`${endpoint}/${id}`, config);
      return normalizeBackendResponse<null>(response.data);
    },
  };
}

