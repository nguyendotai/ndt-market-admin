import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";

export type Order = {
  id: string;
  customerId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

