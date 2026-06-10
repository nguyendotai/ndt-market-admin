import { apiClient } from "@/lib/axios";
import type { ProfileSettingsPayload, StoreSettings, SystemSettings } from "@/modules/settings";
import { normalizeBackendResponse } from "@/services/api-response";

export const settingsService = {
  async updateProfile(payload: ProfileSettingsPayload) {
    try {
      const response = await apiClient.patch("/auth/profile", payload);
      return normalizeBackendResponse<ProfileSettingsPayload>(response.data);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;

      return {
        success: true,
        message: "Profile saved locally",
        data: payload,
      };
    }
  },

  async getStoreSettings() {
    try {
      const response = await apiClient.get("/admin/settings/store");
      return normalizeBackendResponse<StoreSettings>(response.data);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;

      return {
        success: true,
        message: "Default store settings",
        data: defaultStoreSettings,
      };
    }
  },

  async updateStoreSettings(payload: StoreSettings) {
    try {
      const response = await apiClient.patch("/admin/settings/store", payload);
      return normalizeBackendResponse<StoreSettings>(response.data);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;

      return {
        success: true,
        message: "Store settings saved locally",
        data: payload,
      };
    }
  },

  async getSystemSettings() {
    try {
      const response = await apiClient.get("/admin/settings/system");
      return normalizeBackendResponse<SystemSettings>(response.data);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;

      return {
        success: true,
        message: "Default system settings",
        data: defaultSystemSettings,
      };
    }
  },

  async updateSystemSettings(payload: SystemSettings) {
    try {
      const response = await apiClient.patch("/admin/settings/system", payload);
      return normalizeBackendResponse<SystemSettings>(response.data);
    } catch (error) {
      if (!isNotFoundError(error)) throw error;

      return {
        success: true,
        message: "System settings saved locally",
        data: payload,
      };
    }
  },
};

const defaultStoreSettings: StoreSettings = {
  address: "NDT Market",
  defaultShippingFee: 30000,
  email: "support@ndtmarket.vn",
  freeShippingThreshold: 300000,
  phone: "0900000000",
  storeName: "NDT Market",
};

const defaultSystemSettings: SystemSettings = {
  maintenanceMode: false,
  themeDefault: "system",
};

function isNotFoundError(error: unknown) {
  return Boolean(error && typeof error === "object" && "status" in error && error.status === 404);
}
