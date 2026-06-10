import { apiClient } from "@/lib/axios";
import type { Review, ReviewStatus } from "@/modules/reviews";
import { normalizeBackendResponse } from "@/services/api-response";

export type ReviewListParams = {
  keyword?: string;
  rating?: number | "all";
  status?: ReviewStatus | "all";
  page?: number;
  limit?: number;
};

export const reviewService = {
  async listReviews(params?: ReviewListParams) {
    const response = await apiClient.get("/admin/reviews", {
      params: {
        ...params,
        rating: params?.rating === "all" ? undefined : params?.rating,
        status: params?.status === "all" ? undefined : params?.status,
      },
    });
    return normalizeBackendResponse<Review[]>(response.data);
  },

  async updateReviewStatus(id: string, status: ReviewStatus) {
    const response = await apiClient.patch(`/admin/reviews/${id}/status`, { status });
    return normalizeBackendResponse<Review>(response.data);
  },
};
