export type Category = {
  id: string;
  name: string;
  parent?: string | Category | null;
  parentId?: string | null;
  slug: string;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
};

export type CategoryFormPayload = {
  name: string;
  parent?: string | null;
  slug: string;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
};
