import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Ten san pham phai co it nhat 2 ky tu"),
  sku: z.string().min(2, "SKU khong duoc de trong"),
  price: z.coerce.number().positive("Gia ban phai lon hon 0"),
  stock: z.coerce.number().int().min(0, "Ton kho khong duoc am"),
  categoryId: z.string().min(1, "Vui long chon danh muc"),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

