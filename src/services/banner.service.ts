import { apiClient } from "@/lib/axios";
import type { Banner, BannerFormPayload, BannerPosition, BannerStatus } from "@/modules/banners";
import { normalizeBackendResponse } from "@/services/api-response";

export type BannerListParams = {
  keyword?: string;
  position?: BannerPosition | "all";
  status?: BannerStatus | "all";
};

export const bannerService = {
  async listBanners(params?: BannerListParams) {
    const response = await apiClient.get("/banners", {
      params: {
        ...params,
        position: params?.position === "all" ? undefined : params?.position,
        status: params?.status === "all" ? undefined : params?.status,
      },
    });
    return normalizeBackendResponse<Banner[]>(response.data);
  },

  async createBanner(payload: BannerFormPayload) {
    const response = await apiClient.post("/admin/banners", payload);
    return normalizeBackendResponse<Banner>(response.data);
  },

  async updateBanner(id: string, payload: Partial<BannerFormPayload>) {
    const response = await apiClient.patch(`/admin/banners/${id}`, payload);
    return normalizeBackendResponse<Banner>(response.data);
  },

  async deleteBanner(id: string) {
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
