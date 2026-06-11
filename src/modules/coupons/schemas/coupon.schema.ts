import { z } from "zod";

import { discountTypeSchema } from "@/modules/promotions";

export const couponStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const couponFormSchema = z.object({
  code: z.string().min(2, "Ma coupon phai co it nhat 2 ky tu").transform((value) => value.trim().toUpperCase()),
  name: z.string().optional().or(z.literal("")),
  discountType: discountTypeSchema.default("PERCENT"),
  discountValue: z.coerce.number().positive("Gia tri giam phai lon hon 0"),
  minOrderValue: z.coerce.number().min(0, "Gia tri don toi thieu khong duoc am").optional().or(z.literal("")),
  maxDiscount: z.coerce.number().min(0, "Giam toi da khong duoc am").optional().or(z.literal("")),
  expiredAt: z.string().min(1, "Vui long chon ngay het han"),
  usageLimit: z.coerce.number().int("Usage limit phai la so nguyen").min(0, "Usage limit khong duoc am").optional().or(z.literal("")),
  userLimit: z.coerce.number().int("User limit phai la so nguyen").min(0, "User limit khong duoc am").optional().or(z.literal("")),
  status: couponStatusSchema.default("ACTIVE"),
});

export type CouponFormInput = z.input<typeof couponFormSchema>;
export type CouponFormValues = z.infer<typeof couponFormSchema>;
