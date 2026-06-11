"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, ImageIcon, Loader2, Newspaper, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  articleFormSchema,
  type ArticleCategory,
  type ArticleFormInput,
  type ArticleFormPayload,
  type ArticleFormValues,
} from "@/modules/articles";
import { articleService } from "@/services/article.service";
import { uploadService } from "@/services/upload.service";

type ArticleFormPageProps = {
  articleSlug?: string;
};

const defaultValues: ArticleFormInput = {
  title: "",
  slug: "",
  thumbnail: "",
  excerpt: "",
  content: "",
  category: "",
  status: "DRAFT",
  publishedAt: "",
};

export function ArticleFormPage({ articleSlug }: ArticleFormPageProps) {
  const isEdit = Boolean(articleSlug);
  const router = useRouter();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(Boolean(articleSlug));
  const [editingArticleId, setEditingArticleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ArticleFormInput, unknown, ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues,
  });

  const title = useWatch({ control, name: "title" });
  const thumbnail = useWatch({ control, name: "thumbnail" });
  const content = useWatch({ control, name: "content" });
  const status = useWatch({ control, name: "status" });
  const category = useWatch({ control, name: "category" });

  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  }, [isEdit, title, setValue]);

  async function loadCategories() {
    try {
      const response = await articleService.listArticleCategories();
      setCategories(response.data);
    } catch {
      setCategories([]);
    }
  }

  async function loadArticle(slug: string) {
    setLoading(true);

    try {
      const response = await articleService.getArticleBySlug(slug);
      const article = response.data;
      setEditingArticleId(getEntityId(article));
      reset({
        title: article.title,
        slug: article.slug,
        thumbnail: article.thumbnail ?? "",
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        category: getCategoryId(article.category, article.categoryId),
        status: article.status,
        publishedAt: toDateTimeInputValue(article.publishedAt ?? undefined),
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCategories();
      if (articleSlug) {
        loadArticle(articleSlug);
      }
    }, 0);

    return () => window.clearTimeout(timer);
    // load functions intentionally read current articleSlug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  const selectedCategoryName = useMemo(() => {
    const selected = categories.find((item) => getEntityId(item) === category);
    return selected?.name ?? "Chua chon category";
  }, [categories, category]);

  async function handleUploadThumbnail(file?: File) {
    if (!file) return;

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "article");
      setValue("thumbnail", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload thumbnail thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: ArticleFormValues) {
    setSubmitting(true);

    const payload: ArticleFormPayload = {
      title: values.title,
      slug: values.slug,
      thumbnail: emptyToUndefined(values.thumbnail),
      excerpt: emptyToUndefined(values.excerpt),
      content: values.content,
      category: emptyToUndefined(values.category),
      status: values.status,
      publishedAt: values.status === "PUBLISHED" ? values.publishedAt || new Date().toISOString() : undefined,
    };

    try {
      if (isEdit) {
        if (!editingArticleId) {
          throw new Error("Khong tim thay ID bai viet de cap nhat");
        }

        await articleService.updateArticle(editingArticleId, payload);
        toast.success("Cap nhat bai viet thanh cong");
      } else {
        await articleService.createArticle(payload);
        toast.success("Tao bai viet thanh cong");
      }

      router.replace("/admin/articles");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-96 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Soan noi dung bai viet, quan ly thumbnail, slug, category va trang thai publish."
        icon={Newspaper}
        title={isEdit ? "Sua bai viet" : "Tao bai viet"}
        actions={
          <Button variant="outline">
            <Link className="inline-flex items-center gap-2" href="/admin/articles">
              <ArrowLeft className="size-4" />
              Quay lai
            </Link>
          </Button>
        }
      />

      <form className="grid gap-6 xl:grid-cols-[1fr_360px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Noi dung bai viet</CardTitle>
              <CardDescription>Title se tu dong tao slug khi tao moi.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field error={errors.title?.message} label="Title">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("title")} />
              </Field>
              <Field error={errors.slug?.message} label="Slug">
                <input className="h-10 rounded-lg border bg-background px-3 font-mono text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("slug")} />
              </Field>
              <Field error={errors.excerpt?.message} label="Excerpt">
                <textarea className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("excerpt")} />
              </Field>
              <Field error={errors.content?.message} label="Editor content">
                <div className="overflow-hidden rounded-lg border bg-background">
                  <div className="flex items-center justify-between border-b px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">Markdown/HTML content editor</p>
                    <Button size="sm" type="button" variant="outline" onClick={() => setPreviewOpen((value) => !value)}>
                      <Eye className="size-3.5" />
                      {previewOpen ? "An preview" : "Preview"}
                    </Button>
                  </div>
                  <textarea className="min-h-96 w-full resize-y bg-transparent px-3 py-3 font-mono text-sm outline-none" {...register("content")} />
                </div>
              </Field>
              {previewOpen ? (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">Preview</p>
                  <article className="whitespace-pre-wrap text-sm leading-6">{content}</article>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish settings</CardTitle>
              <CardDescription>{selectedCategoryName}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field error={errors.category?.message} label="Category">
                <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("category")}>
                  <option value="">Chua chon</option>
                  {categories.map((category) => {
                    const categoryId = getEntityId(category);
                    if (!categoryId) return null;
                    return <option key={categoryId} value={categoryId}>{category.name}</option>;
                  })}
                </select>
              </Field>
              <Field error={errors.status?.message} label="Status">
                <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </Field>
              <Field error={errors.publishedAt?.message} label="Published at">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" disabled={status !== "PUBLISHED"} type="datetime-local" {...register("publishedAt")} />
              </Field>
              <StatusBadge label={status ?? "DRAFT"} variant={status === "PUBLISHED" ? "success" : "warning"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
              <CardDescription>Upload hoac dan URL thumbnail bai viet.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {thumbnail ? (
                  <div aria-label="Article thumbnail" className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${thumbnail})` }} />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground" />
                )}
              </div>
              <Field error={errors.thumbnail?.message} label="Thumbnail URL">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("thumbnail")} />
              </Field>
              <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Upload thumbnail
                <input accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" disabled={uploading} type="file" onChange={(event) => handleUploadThumbnail(event.target.files?.[0])} />
              </label>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button disabled={submitting || uploading} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Luu bai viet
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

function getCategoryId(value: ArticleCategory | string | null | undefined, fallback?: string) {
  if (!value) return fallback ?? "";
  if (typeof value === "string") return value;
  return getEntityId(value);
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toDateTimeInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 16);
}

function generateSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
