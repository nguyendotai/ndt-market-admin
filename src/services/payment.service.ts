import type { PaymentStatus } from "@/constants/paymentStatus";
import { createCrudService } from "@/services/crud-service";

export type PaymentServiceItem = {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
};

const service = createCrudService<PaymentServiceItem>("/payments");

export const paymentService = {
  listPayments: service.list,
  getPaymentById: service.getById,
  createPayment: service.create,
  updatePayment: service.update,
  deletePayment: service.remove,
};

