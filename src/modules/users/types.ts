export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN" | "SHIPPER" | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED";

export type UserAddress = {
  _id?: string;
  id?: string;
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  isDefault?: boolean;
};

export type UserOrderSummary = {
  _id?: string;
  id?: string;
  orderCode?: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
  total?: number;
  createdAt?: string;
};

export type User = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  role: UserRole;
  permissions?: string[];
  status?: UserStatus;
  isActive?: boolean;
  addresses?: UserAddress[];
  orders?: UserOrderSummary[];
  orderHistory?: UserOrderSummary[];
  loyaltyPoints?: number;
  points?: number;
  totalPoints?: number;
  membershipTier?: string;
  createdAt?: string;
  updatedAt?: string;
};
