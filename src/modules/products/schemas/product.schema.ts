import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);
export const productVariantStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const productFormSchema = z.object({
  name: z.string().min(2, "Ten san pham phai co it nhat 2 ky tu"),
  slug: z
    .string()
    .min(2, "Slug phai co it nhat 2 ky tu")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi gom chu thuong, so va dau gach ngang"),
  sku: z.string().min(2, "SKU khong duoc de trong"),
  category: z.string().min(1, "Vui long chon danh muc"),
  brand: z.string().min(1, "Vui long chon thuong hieu"),
  description: z.string().optional(),
  shortDescription: z.string().max(300, "Mo ta ngan toi da 300 ky tu").optional(),
  unit: z.string().min(1, "Vui long nhap don vi"),
  origin: z.string().optional(),
  ingredients: z.string().optional(),
  storageInstruction: z.string().optional(),
  tags: z.string().optional(),
  status: productStatusSchema.default("DRAFT"),
});

export const productVariantFormSchema = z.object({
  name: z.string().min(1, "Ten variant khong duoc de trong"),
  barcode: z.string().optional(),
  price: z.coerce.number().positive("Gia ban phai lon hon 0"),
  salePrice: z.coerce.number().min(0, "Gia khuyen mai khong duoc am").optional(),
  weight: z.coerce.number().min(0, "Khoi luong khong duoc am").optional(),
  unit: z.string().optional(),
  status: productVariantStatusSchema.default("ACTIVE"),
});

export const productImageFormSchema = z.object({
  imageUrl: z.string().url("Image URL khong hop le"),
  isThumbnail: z.boolean().default(false),
  sortOrder: z.coerce.number().int("Thu tu phai la so nguyen").min(0, "Thu tu khong duoc am"),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductVariantFormInput = z.input<typeof productVariantFormSchema>;
export type ProductVariantFormValues = z.infer<typeof productVariantFormSchema>;
export type ProductImageFormInput = z.input<typeof productImageFormSchema>;
export type ProductImageFormValues = z.infer<typeof productImageFormSchema>;
