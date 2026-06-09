import { createCrudService } from "@/services/crud-service";

export type StoreServiceItem = {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
};

const service = createCrudService<StoreServiceItem>("/stores");

export const storeService = {
  listStores: service.list,
  getStoreById: service.getById,
  createStore: service.create,
  updateStore: service.update,
  deleteStore: service.remove,
};

