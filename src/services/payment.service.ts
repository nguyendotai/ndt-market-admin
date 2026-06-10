import { apiClient } from "@/lib/axios";
import type { PaymentStatus } from "@/constants/paymentStatus";
import type { Order } from "@/modules/orders";
import type { Payment, PaymentMethod } from "@/modules/payments";
import { normalizeBackendResponse } from "@/services/api-response";

export type PaymentListParams = {
  keyword?: string;
  method?: PaymentMethod | "all";
  status?: PaymentStatus | "all";
  page?: number;
  limit?: number;
};

export const paymentService = {
  async listPayments(params?: PaymentListParams) {
    const response = await apiClient.get("/admin/payments", {
      params: cleanPaymentParams(params),
    });
    return normalizeBackendResponse<Payment[]>(response.data);
  },

  async listPaymentsFromOrders(params?: PaymentListParams) {
    const response = await apiClient.get("/admin/orders", {
      params: {
        keyword: params?.keyword,
        paymentStatus: params?.status === "all" ? undefined : params?.status,
        page: params?.page,
        limit: params?.limit,
      },
    });
    const normalized = normalizeBackendResponse<Order[]>(response.data);

    return {
      ...normalized,
      data: normalized.data.map(mapOrderToPayment).filter(Boolean) as Payment[],
    };
  },

  async confirmPayment(id: string) {
    const response = await apiClient.patch(`/admin/payments/${id}/confirm`);
    return normalizeBackendResponse<Payment>(response.data);
  },

  async refundPayment(id: string) {
    const response = await apiClient.patch(`/admin/payments/${id}/refund`);
    return normalizeBackendResponse<Payment>(response.data);
  },

  async getPaymentByOrderCode(orderCode: string) {
    const response = await apiClient.get(`/payments/${orderCode}`);
    return normalizeBackendResponse<Payment>(response.data);
  },
};

function cleanPaymentParams(params?: PaymentListParams) {
  return {
    ...params,
    method: params?.method === "all" ? undefined : params?.method,
    status: params?.status === "all" ? undefined : params?.status,
  };
}

function mapOrderToPayment(order: Order): Payment | null {
  if (!order.payment && !order.paymentStatus) {
    return null;
  }

  return {
    _id: order.payment?.transactionId ?? order._id,
    id: order.payment?.transactionId ?? order.id,
    order: order.id,
    orderId: order.id,
    orderCode: order.orderCode,
    method: order.payment?.method ?? "UNKNOWN",
    amount: order.totalAmount ?? order.total ?? 0,
    status: order.payment?.status ?? order.paymentStatus,
    transactionCode: order.payment?.transactionId ?? null,
    transactionId: order.payment?.transactionId ?? null,
    paidAt: order.payment?.paidAt ?? null,
    createdAt: order.createdAt,
  };
}
