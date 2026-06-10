export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Review = {
  _id?: string;
  id: string;
  product?: ReviewProductRef | string | null;
  productId?: string;
  user?: ReviewUserRef | string | null;
  userId?: string;
  customer?: ReviewUserRef | string | null;
  customerId?: string;
  rating: number;
  comment?: string | null;
  content?: string | null;
  status: ReviewStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewProductRef = {
  _id?: string;
  id?: string;
  name?: string;
  sku?: string;
};

export type ReviewUserRef = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};
