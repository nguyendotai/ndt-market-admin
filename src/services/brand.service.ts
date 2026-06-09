import { apiClient } from "@/lib/axios";
import type { Brand, BrandFormPayload } from "@/modules/brands";
import { normalizeBackendResponse } from "@/services/api-response";

export const brandService = {
  async listBrands(params?: { search?: string; isActive?: boolean }) {
    const response = await apiClient.get("/brands", { params });
    return normalizeBackendResponse<Brand[]>(response.data);
  },

  async createBrand(payload: BrandFormPayload) {
    const response = await apiClient.post("/admin/brands", payload);
    return normalizeBackendResponse<Brand>(response.data);
  },

  async updateBrand(id: string, payload: Partial<BrandFormPayload>) {
    const response = await apiClient.patch(`/admin/brands/${id}`, payload);
    return normalizeBackendResponse<Brand>(response.data);
  },

  async deleteBrand(id: string) {
    const response = await apiClient.delete(`/admin/brands/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
