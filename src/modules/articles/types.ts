export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type ArticleCategory = {
  _id?: string;
  id: string;
  name: string;
  slug: string;
};

export type ArticleCategoryPayload = {
  name: string;
  slug: string;
};

export type Article = {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  excerpt?: string | null;
  content: string;
  category?: ArticleCategory | string | null;
  categoryId?: string;
  status: ArticleStatus;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ArticleFormPayload = {
  title: string;
  slug: string;
  thumbnail?: string;
  excerpt?: string;
  content: string;
  category?: string;
  status: ArticleStatus;
  publishedAt?: string;
};
