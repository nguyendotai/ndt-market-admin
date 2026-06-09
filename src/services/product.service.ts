import { createCrudService } from "@/services/crud-service";

export type ProductServiceItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId?: string;
  isActive: boolean;
};

const service = createCrudService<ProductServiceItem>("/products");

export const productService = {
  listProducts: service.list,
  getProductById: service.getById,
  createProduct: service.create,
  updateProduct: service.update,
  deleteProduct: service.remove,
};

