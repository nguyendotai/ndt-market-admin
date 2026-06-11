import { z } from "zod";

export const discountTypeSchema = z.enum(["PERCENT", "FIXED"]);
export const promotionTypeSchema = z.enum(["PRODUCT_DISCOUNT", "ORDER_DISCOUNT", "BUY_X_GET_Y"]);
export const promotionStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const promotionFormSchema = z
  .object({
    name: z.string().trim().min(2, "Ten khuyen mai phai co it nhat 2 ky tu"),
    type: promotionTypeSchema.default("PRODUCT_DISCOUNT"),
    discountType: discountTypeSchema.default("PERCENT"),
    discountValue: z.coerce.number().positive("Gia tri giam phai lon hon 0"),
    minOrderValue: z.coerce.number().min(0, "Gia tri don toi thieu khong duoc am").optional().or(z.literal("")),
    maxDiscount: z.coerce.number().min(0, "Giam toi da khong duoc am").optional().or(z.literal("")),
    startDate: z.string().min(1, "Vui long chon ngay bat dau"),
    endDate: z.string().min(1, "Vui long chon ngay ket thuc"),
    variantIds: z.array(z.string()).default([]),
    status: promotionStatusSchema.default("ACTIVE"),
  })
  .refine((values) => new Date(values.endDate).getTime() >= new Date(values.startDate).getTime(), {
    message: "Ngay ket thuc phai sau ngay bat dau",
    path: ["endDate"],
  });

export type PromotionFormInput = z.input<typeof promotionFormSchema>;
export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
