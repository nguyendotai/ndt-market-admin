export type ProductStatus = "active" | "inactive" | "draft";
export type ProductVariantStatus = "active" | "inactive";

export type ProductCategoryRef = {
  id: string;
  name: string;
  slug?: string;
};

export type ProductBrandRef = {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
};

export type ProductVariant = {
  id: string;
  name: string;
  barcode?: string | null;
  price: number;
  salePrice?: number | null;
  weight?: number | null;
  unit?: string | null;
  status: ProductVariantStatus;
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category?: ProductCategoryRef | string | null;
  brand?: ProductBrandRef | string | null;
  description?: string | null;
  shortDescription?: string | null;
  unit?: string | null;
  origin?: string | null;
  ingredients?: string | null;
  storageInstruction?: string | null;
  tags?: string[];
  status: ProductStatus;
  variants?: ProductVariant[];
  images?: ProductImage[];
  soldCount?: number;
  createdAt?: string;
};

export type ProductFormPayload = {
  name: string;
  sku: string;
  category: string;
  brand: string;
  description?: string | null;
  shortDescription?: string | null;
  unit?: string | null;
  origin?: string | null;
  ingredients?: string | null;
  storageInstruction?: string | null;
  tags: string[];
  status: ProductStatus;
};

export type ProductVariantPayload = {
  name: string;
  barcode?: string | null;
  price: number;
  salePrice?: number | null;
  weight?: number | null;
  unit?: string | null;
  status: ProductVariantStatus;
};

export type ProductImagePayload = {
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
};
