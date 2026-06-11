export type DiscountType = "PERCENT" | "FIXED";
export type PromotionStatus = "ACTIVE" | "INACTIVE";

export type PromotionProductRef = {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
};

export type Promotion = {
  _id?: string;
  id: string;
  name: string;
  code?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  startDate: string;
  endDate: string;
  productIds?: string[];
  products?: Array<PromotionProductRef | string>;
  status: PromotionStatus;
};

export type PromotionFormPayload = {
  name: string;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  status: PromotionStatus;
};
