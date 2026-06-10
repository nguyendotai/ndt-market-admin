import type { PaymentStatus } from "@/constants/paymentStatus";

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "COD"
  | "MOMO"
  | "VNPAY"
  | "ZALOPAY"
  | "CREDIT_CARD"
  | string;

export type Payment = {
  _id?: string;
  id: string;
  order?: PaymentOrderRef | string | null;
  orderId?: string;
  orderCode: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionCode?: string | null;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt?: string;
};

export type PaymentOrderRef = {
  _id?: string;
  id?: string;
  orderCode?: string;
};
