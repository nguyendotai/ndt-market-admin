import { apiClient } from "@/lib/axios";
import type {
  Product,
  ProductFormPayload,
  ProductImage,
  ProductImagePayload,
  ProductStatus,
  ProductVariant,
  ProductVariantPayload,
} from "@/modules/products";
import { normalizeBackendResponse } from "@/services/api-response";

export type ProductListParams = {
  keyword?: string;
  category?: string;
  brand?: string;
  status?: ProductStatus | "all";
  sort?: "price_asc" | "price_desc" | "newest" | "best_seller";
  page?: number;
  limit?: number;
};

export const productService = {
  async listProducts(params?: ProductListParams) {
    const response = await apiClient.get("/products", { params });
    return normalizeBackendResponse<Product[]>(response.data);
  },

  async getProductById(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return normalizeBackendResponse<Product>(response.data);
  },

  async createProduct(payload: ProductFormPayload) {
    const response = await apiClient.post("/admin/products", payload);
    return normalizeBackendResponse<Product>(response.data);
  },

  async updateProduct(id: string, payload: Partial<ProductFormPayload>) {
    const response = await apiClient.patch(`/admin/products/${id}`, payload);
    return normalizeBackendResponse<Product>(response.data);
  },

  async deleteProduct(id: string) {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },

  async createVariant(productId: string, payload: ProductVariantPayload) {
    const response = await apiClient.post(`/admin/products/${productId}/variants`, payload);
    return normalizeBackendResponse<ProductVariant>(response.data);
  },

  async updateVariant(variantId: string, payload: Partial<ProductVariantPayload>) {
    const response = await apiClient.patch(`/admin/products/variants/${variantId}`, payload);
    return normalizeBackendResponse<ProductVariant>(response.data);
  },

  async deleteVariant(variantId: string) {
    const response = await apiClient.delete(`/admin/products/variants/${variantId}`);
    return normalizeBackendResponse<null>(response.data);
  },

  async createImage(productId: string, payload: ProductImagePayload) {
    const response = await apiClient.post(`/admin/products/${productId}/images`, payload);
    return normalizeBackendResponse<ProductImage>(response.data);
  },

  async deleteImage(imageId: string) {
    const response = await apiClient.delete(`/admin/products/images/${imageId}`);
    return normalizeBackendResponse<null>(response.data);
  },
};
