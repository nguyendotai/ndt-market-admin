"use client";

import { Edit, FileText, ImageIcon, Loader2, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Article, ArticleCategory, ArticleStatus } from "@/modules/articles";
import { articleService } from "@/services/article.service";

type StatusFilter = ArticleStatus | "all";

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadArticles() {
    setLoading(true);

    try {
      const response = await articleService.listArticles({
        keyword: keyword.trim() || undefined,
        status,
        category,
      });
      setArticles(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await articleService.listArticleCategories();
      setCategories(response.data);
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCategories();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadArticles();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadArticles intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status, category]);

  const visibleArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return articles.filter((article) => {
      const articleCategory = getCategoryId(article.category, article.categoryId);
      const searchBlob = [article.title, article.slug, article.excerpt, getCategoryName(article.category, categories)]
        .join(" ")
        .toLowerCase();

      const matchesStatus = status === "all" || article.status === status;
      const matchesCategory = category === "all" || articleCategory === category;
      const matchesKeyword = !normalizedKeyword || searchBlob.includes(normalizedKeyword);

      return matchesStatus && matchesCategory && matchesKeyword;
    });
  }, [articles, categories, category, keyword, status]);

  async function handleDelete() {
    if (!deletingArticle) return;

    try {
      await articleService.deleteArticle(getEntityId(deletingArticle));
      toast.success("Da xoa bai viet");
      setDeletingArticle(null);
      await loadArticles();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly tin tuc, cam nang mua sam, cong thuc va noi dung marketing cho sieu thi online."
        icon={FileText}
        title="Quan ly bai viet"
        actions={
          <Link className={buttonVariants({ className: "gap-2" })} href="/admin/articles/create">
              <Plus className="size-4" />
              Tao bai viet
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach bai viet</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(260px,360px)_170px_190px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 xl:col-span-1">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search title, slug, excerpt"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">Tat ca status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Tat ca category</option>
                {categories.map((item) => {
                  const categoryId = getEntityId(item);
                  return categoryId ? <option key={categoryId} value={categoryId}>{item.name}</option> : null;
                })}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table className="min-w-[1060px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Bai viet</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published at</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleArticles.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={6}>
                      Khong tim thay bai viet phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleArticles.map((article) => {
                    const articleId = getEntityId(article);

                    return (
                      <TableRow key={articleId}>
                        <TableCell className="w-[170px]">
                          <div className="flex aspect-[16/9] w-32 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                            {article.thumbnail ? (
                              <div
                                aria-label={article.title}
                                className="h-full w-full bg-cover bg-center"
                                role="img"
                                style={{ backgroundImage: `url(${article.thumbnail})` }}
                              />
                            ) : (
                              <ImageIcon className="size-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-[390px]">
                          <p className="font-medium">{article.title}</p>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">{article.slug}</p>
                          {article.excerpt ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{article.excerpt}</p>
                          ) : null}
                        </TableCell>
                        <TableCell className="w-[180px] text-sm text-muted-foreground">
                          {getCategoryName(article.category, categories)}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <StatusBadge
                            label={article.status}
                            variant={article.status === "PUBLISHED" ? "success" : "warning"}
                          />
                        </TableCell>
                        <TableCell className="w-[170px] text-sm text-muted-foreground">
                          {formatDate(article.publishedAt)}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="flex justify-end gap-2">
                            <Link
                              aria-label="Sua bai viet"
                              className={buttonVariants({ size: "icon", variant: "outline" })}
                              href={`/admin/articles/${article.slug}/edit`}
                            >
                              <Edit className="size-4" />
                            </Link>
                            <Button
                              aria-label="Xoa bai viet"
                              size="icon"
                              variant="destructive"
                              onClick={() => setDeletingArticle(article)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        confirmText="Xoa"
        description={`Ban co chac muon xoa bai viet "${deletingArticle?.title ?? ""}"?`}
        open={Boolean(deletingArticle)}
        title="Xoa bai viet"
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (!open) setDeletingArticle(null);
        }}
      />
    </div>
  );
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function getCategoryId(value: Article["category"], fallback?: string) {
  if (!value) return fallback ?? "";
  if (typeof value === "string") return value;
  return getEntityId(value);
}

function getCategoryName(value: Article["category"], categories: ArticleCategory[]) {
  if (!value) return "Chua phan loai";
  if (typeof value !== "string") return value.name;
  return categories.find((category) => getEntityId(category) === value)?.name ?? value;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
