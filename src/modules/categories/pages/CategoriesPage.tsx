"use client";

import {
  Edit,
  FolderTree,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryFormModal } from "@/modules/categories/components/CategoryFormModal";
import type { Category, CategoryFormPayload, CategoryFormValues } from "@/modules/categories";
import { categoryService } from "@/services/category.service";

type ActiveFilter = "all" | "active" | "inactive";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadCategories() {
    setLoading(true);

    try {
      const [listResponse, treeResponse] = await Promise.all([
        categoryService.listCategories(),
        categoryService.getCategoryTree(),
      ]);

      setCategories(listResponse.data);
      setCategoryTree(treeResponse.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  const flatTree = useMemo(() => flattenCategories(categoryTree), [categoryTree]);
  const parentNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  const visibleCategories = useMemo(() => {
    return flatTree.filter((item) => {
      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        item.category.name.toLowerCase().includes(keyword) ||
        item.category.slug.toLowerCase().includes(keyword);
      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && item.category.isActive) ||
        (activeFilter === "inactive" && !item.category.isActive);

      return matchesSearch && matchesActive;
    });
  }, [activeFilter, flatTree, search]);

  async function handleSubmit(values: CategoryFormValues) {
    setSubmitting(true);

    const payload: CategoryFormPayload = {
      name: values.name,
      parent: values.parent || null,
      slug: values.slug,
      image: values.image || null,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    };

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.success("Cap nhat danh muc thanh cong");
      } else {
        await categoryService.createCategory(payload);
        toast.success("Tao danh muc thanh cong");
      }

      setFormOpen(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) {
      return;
    }

    try {
      await categoryService.deleteCategory(deletingCategory.id);
      toast.success("Da xoa danh muc");
      setDeletingCategory(null);
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleToggleActive(category: Category) {
    try {
      await categoryService.updateCategory(category.id, {
        isActive: !category.isActive,
      });
      toast.success(category.isActive ? "Da tat danh muc" : "Da bat danh muc");
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly cau truc danh muc cha con, hinh anh, slug va trang thai hien thi."
        icon={FolderTree}
        title="Quan ly danh muc"
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setEditingCategory(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Tao danh muc
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Danh sach category</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none sm:w-64"
                  placeholder="Search theo ten hoac slug"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value as ActiveFilter)}
              >
                <option value="all">Tat ca</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="mb-3 size-6 animate-spin text-primary" />
                <p className="font-medium">Dang tai danh muc</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Danh muc</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Trang thai</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCategories.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={6}>
                      Khong tim thay danh muc phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleCategories.map(({ category, depth }) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3" style={{ paddingLeft: depth * 20 }}>
                          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                            {category.image ? (
                              <div
                                aria-label={category.name}
                                className="h-full w-full bg-cover bg-center"
                                role="img"
                                style={{ backgroundImage: `url(${category.image})` }}
                              />
                            ) : (
                              <ImageIcon className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {depth > 0 ? <Badge variant="secondary">Cap {depth + 1}</Badge> : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getCategoryParentId(category)
                          ? parentNameById.get(getCategoryParentId(category)) ?? "Unknown"
                          : "Root"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{category.slug}</TableCell>
                      <TableCell>{category.sortOrder}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => handleToggleActive(category)}>
                          <StatusBadge
                            label={category.isActive ? "Active" : "Inactive"}
                            variant={category.isActive ? "success" : "neutral"}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            aria-label="Sua danh muc"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(category);
                              setFormOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            aria-label="Xoa danh muc"
                            size="icon"
                            variant="destructive"
                            onClick={() => setDeletingCategory(category)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CategoryFormModal
        categories={categoryTree}
        initialValues={editingCategory}
        open={formOpen}
        submitting={submitting}
        title={editingCategory ? "Sua category" : "Tao category"}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa danh muc "${deletingCategory?.name ?? ""}"? Hanh dong nay khong the hoan tac.`}
        open={Boolean(deletingCategory)}
        title="Xoa danh muc"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCategory(null);
          }
        }}
      />
    </div>
  );
}

function flattenCategories(categories: Category[], depth = 0): Array<{ category: Category; depth: number }> {
  return categories.flatMap((category) => [
    { category, depth },
    ...flattenCategories(category.children ?? [], depth + 1),
  ]);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}

function getCategoryParentId(category: Category) {
  if (category.parentId) {
    return category.parentId;
  }

  if (typeof category.parent === "string") {
    return category.parent;
  }

  return category.parent?.id ?? "";
}
