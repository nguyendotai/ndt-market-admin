import { createCrudService } from "@/services/crud-service";

export type CategoryServiceItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

const service = createCrudService<CategoryServiceItem>("/categories");

export const categoryService = {
  listCategories: service.list,
  getCategoryById: service.getById,
  createCategory: service.create,
  updateCategory: service.update,
  deleteCategory: service.remove,
};

