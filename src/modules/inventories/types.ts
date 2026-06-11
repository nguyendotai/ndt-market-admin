export type InventoryItem = {
  _id?: string;
  id?: string;
  productName?: string;
  productSku?: string;
  variantName?: string;
  barcode?: string | null;
  storeName?: string;
  stockStatus?: "LOW_STOCK" | "IN_STOCK" | string;
  product?: InventoryProductRef | string | null;
  productId?: string;
  variant?: InventoryVariantRef | string | null;
  variantId?: string;
  store?: InventoryStoreRef | string | null;
  storeId?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity?: number;
  updatedAt?: string;
};

export type InventoryProductRef = {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
};

export type InventoryVariantRef = {
  _id?: string;
  id?: string;
  name: string;
  barcode?: string | null;
};

export type InventoryStoreRef = {
  _id?: string;
  id?: string;
  name: string;
};

export type StockMovement = {
  _id?: string;
  id?: string;
  productName?: string;
  productSku?: string;
  variantName?: string;
  barcode?: string | null;
  storeName?: string;
  type: "IMPORT" | "EXPORT" | "ADJUST" | "RESERVE" | "RELEASE" | string;
  quantity: number;
  reason?: string | null;
  note?: string | null;
  createdBy?: {
    _id?: string;
    id?: string;
    fullName?: string;
    name?: string;
  } | string | null;
  createdAt?: string;
  inventory?: string | InventoryItem | null;
  store?: string | InventoryStoreRef | null;
  variant?: string | InventoryVariantRef | null;
};

export type InventoryImportPayload = {
  store: string;
  variant: string;
  quantity: number;
  reason?: string;
};

export type InventoryAdjustPayload = {
  store: string;
  variant: string;
  quantity: number;
  reason?: string;
};
