import { apiClient } from "@/lib/axios";
import type { Promotion, PromotionFormPayload, PromotionStatus } from "@/modules/promotions";
import { normalizeBackendResponse } from "@/services/api-response";

export type PromotionListParams = {
  keyword?: string;
  status?: PromotionStatus | "all";
};

export const promotionService = {
  async listPromotions(params?: PromotionListParams) {
    const response = await apiClient.get("/promotions", {
      params: {
        ...params,
        status: params?.status === "all" ? undefined : params?.status,
      },
    });
    return normalizeBackendResponse<Promotion[]>(response.data);
  },

  async createPromotion(payload: PromotionFormPayload) {
    const response = await apiClient.post("/admin/promotions", payload);
    return normalizeBackendResponse<Promotion>(response.data);
  },

  async updatePromotion(id: string, payload: Partial<PromotionFormPayload>) {
    const response = await apiClient.patch(`/admin/promotions/${id}`, payload);
    return normalizeBackendResponse<Promotion>(response.data);
  },

  async deletePromotion(id: string) {
    const response = await apiClient.delete(`/admin/promotions/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
