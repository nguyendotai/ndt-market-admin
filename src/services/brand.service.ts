import { createCrudService } from "@/services/crud-service";

export type BrandServiceItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

const service = createCrudService<BrandServiceItem>("/brands");

export const brandService = {
  listBrands: service.list,
  getBrandById: service.getById,
  createBrand: service.create,
  updateBrand: service.update,
  deleteBrand: service.remove,
};

