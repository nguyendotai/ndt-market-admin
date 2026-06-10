export type InventoryItem = {
  _id?: string;
  id: string;
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
  id: string;
  type: "IMPORT" | "ADJUST" | "RESERVE" | "RELEASE" | "SALE" | string;
  quantity: number;
  note?: string | null;
  createdAt?: string;
  inventory?: string | InventoryItem | null;
};

export type InventoryImportPayload = {
  inventoryId: string;
  quantity: number;
  note?: string;
};

export type InventoryAdjustPayload = {
  inventoryId: string;
  quantity: number;
  note?: string;
};
