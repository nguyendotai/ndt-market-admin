export type Store = {
  _id?: string;
  id: string;
  phone?: string | null;
  province: string;
  district: string;
  ward: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: string | null;
  status: StoreStatus;
};

export type StoreStatus = "ACTIVE" | "INACTIVE";

export type StoreFormPayload = {
  name: string;
  phone?: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  status: StoreStatus;
};
