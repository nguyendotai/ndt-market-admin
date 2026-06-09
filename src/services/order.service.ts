import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";
import { createCrudService } from "@/services/crud-service";

export type OrderServiceItem = {
  id: string;
  customerId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

const service = createCrudService<OrderServiceItem>("/orders");

export const orderService = {
  listOrders: service.list,
  getOrderById: service.getById,
  createOrder: service.create,
  updateOrder: service.update,
  deleteOrder: service.remove,
};

