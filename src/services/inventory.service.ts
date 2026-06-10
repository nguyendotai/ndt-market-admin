import { apiClient } from "@/lib/axios";
import type {
  InventoryAdjustPayload,
  InventoryImportPayload,
  InventoryItem,
  StockMovement,
} from "@/modules/inventories";
import { normalizeBackendResponse } from "@/services/api-response";

export type InventoryListParams = {
  store?: string;
  keyword?: string;
};

export const inventoryService = {
  async listInventories(params?: InventoryListParams) {
    const response = await apiClient.get("/admin/inventories", { params });
    return normalizeBackendResponse<InventoryItem[]>(response.data);
  },

  async updateInventory(id: string, payload: Partial<Pick<InventoryItem, "quantity" | "reservedQuantity">>) {
    const response = await apiClient.patch(`/admin/inventories/${id}`, payload);
    return normalizeBackendResponse<InventoryItem>(response.data);
  },

  async importStock(payload: InventoryImportPayload) {
    const response = await apiClient.post("/admin/inventories/import", payload);
    return normalizeBackendResponse<InventoryItem | StockMovement>(response.data);
  },

  async adjustStock(payload: InventoryAdjustPayload) {
    const response = await apiClient.post("/admin/inventories/adjust", payload);
    return normalizeBackendResponse<InventoryItem | StockMovement>(response.data);
  },

  async listMovements(params?: { inventoryId?: string }) {
    const response = await apiClient.get("/admin/inventories/movements", { params });
    return normalizeBackendResponse<StockMovement[]>(response.data);
  },
};
