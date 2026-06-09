import { createCrudService } from "@/services/crud-service";

export type ArticleServiceItem = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
};

const service = createCrudService<ArticleServiceItem>("/articles");

export const articleService = {
  listArticles: service.list,
  getArticleById: service.getById,
  createArticle: service.create,
  updateArticle: service.update,
  deleteArticle: service.remove,
};

