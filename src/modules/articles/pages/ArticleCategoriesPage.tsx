"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  articleCategorySchema,
  type ArticleCategory,
  type ArticleCategoryInput,
  type ArticleCategoryValues,
} from "@/modules/articles";
import { articleService } from "@/services/article.service";

const defaultValues: ArticleCategoryInput = {
  name: "",
  slug: "",
};

export function ArticleCategoriesPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    control,
  } = useForm<ArticleCategoryInput, unknown, ArticleCategoryValues>({
    resolver: zodResolver(articleCategorySchema),
    defaultValues,
  });

  const name = useWatch({ control, name: "name" });

  useEffect(() => {
    setValue("slug", generateSlug(name ?? ""), { shouldValidate: Boolean(name) });
  }, [name, setValue]);

  async function loadCategories() {
    setLoading(true);

    try {
      const response = await articleService.listArticleCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCategories();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function onSubmit(values: ArticleCategoryValues) {
    setSubmitting(true);

    try {
      await articleService.createArticleCategory({
        name: values.name,
        slug: values.slug,
      });
      toast.success("Tao category bai viet thanh cong");
      reset(defaultValues);
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  const visibleCategories = categories.filter((category) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return true;
    return [category.name, category.slug].join(" ").toLowerCase().includes(normalizedKeyword);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        description="Tao nhom noi dung cho bai viet de filter va phan loai tren trang admin."
        icon={FolderTree}
        title="Article categories"
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tao category</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <Field error={errors.name?.message} label="Name">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("name")} />
              </Field>
              <Field error={errors.slug?.message} label="Slug">
                <input className="h-10 rounded-lg border bg-background px-3 font-mono text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("slug")} />
              </Field>
              <Button disabled={submitting} type="submit">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Tao category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="gap-4 border-b">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Danh sach category</CardTitle>
              <div className="flex h-9 w-full items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:max-w-sm">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search category" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="grid min-h-80 place-items-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <Table className="min-w-[680px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleCategories.length === 0 ? (
                    <TableRow>
                      <TableCell className="py-12 text-center text-muted-foreground" colSpan={2}>
                        Chua co category bai viet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleCategories.map((category) => (
                      <TableRow key={getEntityId(category)}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
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

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
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
