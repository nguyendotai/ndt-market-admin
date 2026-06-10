export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  UNPAID: "UNPAID",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
