import type { DiscountType } from "@/modules/promotions";

export type CouponStatus = "ACTIVE" | "INACTIVE";

export type Coupon = {
  _id?: string;
  id: string;
  code: string;
  name?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  expiredAt: string;
  usageLimit?: number | null;
  usedCount?: number | null;
  userLimit?: number | null;
  status: CouponStatus;
};

export type CouponFormPayload = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiredAt: string;
  usageLimit?: number;
  userLimit?: number;
  status: CouponStatus;
};
