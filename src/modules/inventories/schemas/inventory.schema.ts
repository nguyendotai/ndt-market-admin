import { z } from "zod";

export const inventoryImportSchema = z.object({
  inventoryId: z.string().optional().or(z.literal("")),
  storeId: z.string().min(1, "Vui long chon chi nhanh"),
  productId: z.string().min(1, "Vui long chon san pham"),
  variantId: z.string().min(1, "Vui long chon bien the"),
  quantity: z.coerce.number().int("So luong phai la so nguyen").positive("So luong nhap phai lon hon 0"),
  reason: z.string().max(300, "Ly do toi da 300 ky tu").optional().or(z.literal("")),
});

export const inventoryAdjustSchema = z.object({
  inventoryId: z.string().optional().or(z.literal("")),
  storeId: z.string().min(1, "Vui long chon chi nhanh"),
  productId: z.string().min(1, "Vui long chon san pham"),
  variantId: z.string().min(1, "Vui long chon bien the"),
  quantity: z.coerce
    .number()
    .int("So luong dieu chinh phai la so nguyen")
    .refine((value) => value !== 0, "So luong dieu chinh khong duoc bang 0"),
  reason: z.string().max(300, "Ly do toi da 300 ky tu").optional().or(z.literal("")),
});

export type InventoryImportInput = z.input<typeof inventoryImportSchema>;
export type InventoryImportValues = z.infer<typeof inventoryImportSchema>;
export type InventoryAdjustInput = z.input<typeof inventoryAdjustSchema>;
export type InventoryAdjustValues = z.infer<typeof inventoryAdjustSchema>;
