export type Brand = {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isActive: boolean;
};

export type BrandFormPayload = {
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isActive: boolean;
};
