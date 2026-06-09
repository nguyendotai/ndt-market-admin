export type Category = {
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
};

export type CategoryFormPayload = {
  name: string;
  parentId?: string | null;
  slug: string;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
};
