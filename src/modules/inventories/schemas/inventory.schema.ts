import { z } from "zod";

export const inventoryImportSchema = z.object({
  inventoryId: z.string().min(1, "Vui long chon dong ton kho"),
  quantity: z.coerce.number().int("So luong phai la so nguyen").positive("So luong nhap phai lon hon 0"),
  note: z.string().max(300, "Ghi chu toi da 300 ky tu").optional().or(z.literal("")),
});

export const inventoryAdjustSchema = z.object({
  inventoryId: z.string().min(1, "Vui long chon dong ton kho"),
  quantity: z.coerce.number().int("So luong moi phai la so nguyen").min(0, "So luong khong duoc am"),
  note: z.string().max(300, "Ghi chu toi da 300 ky tu").optional().or(z.literal("")),
});

export type InventoryImportInput = z.input<typeof inventoryImportSchema>;
export type InventoryImportValues = z.infer<typeof inventoryImportSchema>;
export type InventoryAdjustInput = z.input<typeof inventoryAdjustSchema>;
export type InventoryAdjustValues = z.infer<typeof inventoryAdjustSchema>;
