import { createCrudService } from "@/services/crud-service";

export type CouponServiceItem = {
  id: string;
  code: string;
  discountValue: number;
  isActive: boolean;
};

const service = createCrudService<CouponServiceItem>("/coupons");

export const couponService = {
  listCoupons: service.list,
  getCouponById: service.getById,
  createCoupon: service.create,
  updateCoupon: service.update,
  deleteCoupon: service.remove,
};

