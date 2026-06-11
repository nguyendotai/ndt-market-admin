export type DiscountType = "PERCENT" | "FIXED";
export type PromotionType = "PRODUCT_DISCOUNT" | "ORDER_DISCOUNT" | "BUY_X_GET_Y";
export type PromotionStatus = "ACTIVE" | "INACTIVE";

export type PromotionVariantRef = {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
  barcode?: string | null;
};

export type Promotion = {
  _id?: string;
  id: string;
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  startDate: string;
  endDate: string;
  variantIds?: string[];
  variants?: Array<PromotionVariantRef | string>;
  status: PromotionStatus;
};

export type PromotionFormPayload = {
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  variantIds: string[];
  status: PromotionStatus;
};
