import { apiClient } from "@/lib/axios";
import type {
  Article,
  ArticleCategory,
  ArticleCategoryPayload,
  ArticleFormPayload,
  ArticleStatus,
} from "@/modules/articles";
import { normalizeBackendResponse } from "@/services/api-response";

export type ArticleListParams = {
  keyword?: string;
  status?: ArticleStatus | "all";
  category?: string;
  page?: number;
  limit?: number;
};

export const articleService = {
  async listArticles(params?: ArticleListParams) {
    const response = await apiClient.get("/articles", {
      params: {
        ...params,
        status: params?.status === "all" ? undefined : params?.status,
        category: params?.category === "all" ? undefined : params?.category,
      },
    });
    return normalizeBackendResponse<Article[]>(response.data);
  },

  async getArticleById(id: string) {
    const response = await apiClient.get(`/articles/${id}`);
    return normalizeBackendResponse<Article>(response.data);
  },

  async createArticle(payload: ArticleFormPayload) {
    const response = await apiClient.post("/admin/articles", payload);
    return normalizeBackendResponse<Article>(response.data);
  },

  async updateArticle(id: string, payload: Partial<ArticleFormPayload>) {
    const response = await apiClient.patch(`/admin/articles/${id}`, payload);
    return normalizeBackendResponse<Article>(response.data);
  },

  async deleteArticle(id: string) {
    const response = await apiClient.delete(`/admin/articles/${id}`);
    return normalizeBackendResponse<null>(response.data);
  },

  async listArticleCategories() {
    const response = await apiClient.get("/article-categories");
    return normalizeBackendResponse<ArticleCategory[]>(response.data);
  },

  async createArticleCategory(payload: ArticleCategoryPayload) {
    const response = await apiClient.post("/admin/article-categories", payload);
    return normalizeBackendResponse<ArticleCategory>(response.data);
  },
};
