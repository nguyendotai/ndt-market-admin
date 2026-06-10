import { apiClient } from "@/lib/axios";
import type { Coupon, CouponFormPayload, CouponStatus } from "@/modules/coupons";
import { normalizeBackendResponse } from "@/services/api-response";

export type CouponListParams = {
  keyword?: string;
  status?: CouponStatus | "all";
};

export const couponService = {
  async listCoupons(params?: CouponListParams) {
    const response = await apiClient.get("/admin/coupons", {
      params: {
        ...params,
        status: params?.status === "all" ? undefined : params?.status,
      },
    });
    return normalizeBackendResponse<Coupon[]>(response.data);
  },

  async createCoupon(payload: CouponFormPayload) {
    const response = await apiClient.post("/admin/coupons", payload);
    return normalizeBackendResponse<Coupon>(response.data);
  },

  async updateCoupon(id: string, payload: Partial<CouponFormPayload>) {
    const response = await apiClient.patch(`/admin/coupons/${id}`, payload);
    return normalizeBackendResponse<Coupon>(response.data);
  },

  async deleteCoupon(id: string) {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
