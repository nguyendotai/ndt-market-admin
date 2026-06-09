import { createCrudService } from "@/services/crud-service";

export type InventoryServiceItem = {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
};

const service = createCrudService<InventoryServiceItem>("/inventories");

export const inventoryService = {
  listInventories: service.list,
  getInventoryById: service.getById,
  createInventory: service.create,
  updateInventory: service.update,
  deleteInventory: service.remove,
};

