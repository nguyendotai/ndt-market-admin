export type Setting = {
  key: string;
  value: string;
};

export type ThemeDefault = "system" | "light" | "dark";

export type ProfileSettingsPayload = {
  fullName: string;
  avatar?: string;
};

export type StoreSettings = {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
};

export type SystemSettings = {
  themeDefault: ThemeDefault;
  maintenanceMode: boolean;
};
