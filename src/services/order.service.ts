import { apiClient } from "@/lib/axios";
import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";
import type { DeliveryType, Order } from "@/modules/orders";
import { normalizeBackendResponse } from "@/services/api-response";

export type OrderListParams = {
  keyword?: string;
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  deliveryType?: DeliveryType | "all";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export const orderService = {
  async listOrders(params?: OrderListParams) {
    const response = await apiClient.get("/admin/orders", {
      params: {
        ...params,
        status: params?.status === "all" ? undefined : params?.status,
        paymentStatus: params?.paymentStatus === "all" ? undefined : params?.paymentStatus,
        deliveryType: params?.deliveryType === "all" ? undefined : params?.deliveryType,
      },
    });
    return normalizeBackendResponse<Order[]>(response.data);
  },

  async getOrderById(id: string) {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return normalizeBackendResponse<Order>(response.data);
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
    return normalizeBackendResponse<Order>(response.data);
  },
};
