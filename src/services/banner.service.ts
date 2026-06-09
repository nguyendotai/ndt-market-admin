import { createCrudService } from "@/services/crud-service";

export type BannerServiceItem = {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
};

const service = createCrudService<BannerServiceItem>("/banners");

export const bannerService = {
  listBanners: service.list,
  getBannerById: service.getById,
  createBanner: service.create,
  updateBanner: service.update,
  deleteBanner: service.remove,
};

