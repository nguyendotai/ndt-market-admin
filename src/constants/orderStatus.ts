export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PACKING: "packing",
  SHIPPING: "shipping",
  COMPLETED: "completed",
  CANCELED: "canceled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

