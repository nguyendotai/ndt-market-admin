import { apiClient } from "@/lib/axios";
import type { Category, CategoryFormPayload } from "@/modules/categories";
import { normalizeBackendResponse } from "@/services/api-response";

export const categoryService = {
  async listCategories(params?: { search?: string; isActive?: boolean }) {
    const response = await apiClient.get("/categories", { params });
    return normalizeBackendResponse<Category[]>(response.data);
  },

  async getCategoryTree() {
    const response = await apiClient.get("/categories/tree");
    return normalizeBackendResponse<Category[]>(response.data);
  },

  async createCategory(payload: CategoryFormPayload) {
    const response = await apiClient.post("/admin/categories", payload);
    return normalizeBackendResponse<Category>(response.data);
  },

  async updateCategory(id: string, payload: Partial<CategoryFormPayload>) {
    const response = await apiClient.patch(`/admin/categories/${id}`, payload);
    return normalizeBackendResponse<Category>(response.data);
  },

  async deleteCategory(id: string) {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
