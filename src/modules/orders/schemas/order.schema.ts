import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type UpdateOrderStatusValues = z.infer<typeof updateOrderStatusSchema>;
