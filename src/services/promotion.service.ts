import { createCrudService } from "@/services/crud-service";

export type PromotionServiceItem = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const service = createCrudService<PromotionServiceItem>("/promotions");

export const promotionService = {
  listPromotions: service.list,
  getPromotionById: service.getById,
  createPromotion: service.create,
  updatePromotion: service.update,
  deletePromotion: service.remove,
};

