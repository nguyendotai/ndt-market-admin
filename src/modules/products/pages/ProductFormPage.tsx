"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon, Loader2, Package, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Brand } from "@/modules/brands";
import type { Category } from "@/modules/categories";
import { ProductImageModal } from "@/modules/products/components/ProductImageModal";
import { ProductVariantModal } from "@/modules/products/components/ProductVariantModal";
import {
  productFormSchema,
  type Product,
  type ProductFormInput,
  type ProductFormPayload,
  type ProductFormValues,
  type ProductImage,
  type ProductImageFormValues,
  type ProductVariant,
  type ProductVariantFormValues,
} from "@/modules/products";
import { brandService } from "@/services/brand.service";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

type ProductFormPageProps = {
  productId?: string;
};

const defaultValues: ProductFormInput = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  brand: "",
  description: "",
  shortDescription: "",
  unit: "",
  origin: "",
  ingredients: "",
  storageInstruction: "",
  tags: "",
  status: "DRAFT",
};

export function ProductFormPage({ productId }: ProductFormPageProps) {
  const isEdit = Boolean(productId);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<ProductVariant | null>(null);
  const [deletingImage, setDeletingImage] = useState<ProductImage | null>(null);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [loading, setLoading] = useState(Boolean(productId));
  const [submitting, setSubmitting] = useState(false);
  const [variantSubmitting, setVariantSubmitting] = useState(false);
  const [imageSubmitting, setImageSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    control,
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });
  const productName = useWatch({ control, name: "name" });

  useEffect(() => {
    if (!isEdit && productName) {
      setValue("slug", generateSlug(productName), { shouldValidate: true });
    }
  }, [isEdit, productName, setValue]);

  async function loadOptions() {
    try {
      const [categoryResponse, brandResponse] = await Promise.all([
        categoryService.getCategoryTree(),
        brandService.listBrands(),
      ]);
      setCategories(flattenCategories(categoryResponse.data));
      setBrands(brandResponse.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function loadProduct(id: string) {
    setLoading(true);

    try {
      const response = await productService.getProductById(id);
      const item = response.data;
      setVariants(item.variants ?? []);
      setImages(item.images ?? []);
      reset({
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        category: getRefId(item.category),
        brand: getRefId(item.brand),
        description: item.description ?? "",
        shortDescription: item.shortDescription ?? "",
        unit: item.unit ?? "",
        origin: item.origin ?? "",
        ingredients: item.ingredients ?? "",
        storageInstruction: item.storageInstruction ?? "",
        tags: (item.tags ?? []).join(", "),
        status: item.status,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOptions();
      if (productId) {
        loadProduct(productId);
      }
    }, 0);

    return () => window.clearTimeout(timer);
    // loadOptions/loadProduct are intentionally scheduled once per productId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true);

    const payload: ProductFormPayload = {
      name: values.name,
      slug: values.slug,
      sku: values.sku,
      category: values.category,
      brand: values.brand,
      description: emptyToUndefined(values.description),
      shortDescription: emptyToUndefined(values.shortDescription),
      unit: values.unit,
      origin: emptyToUndefined(values.origin),
      ingredients: emptyToUndefined(values.ingredients),
      storageInstruction: emptyToUndefined(values.storageInstruction),
      tags: splitTags(values.tags),
      status: values.status,
    };

    try {
      if (productId) {
        const response = await productService.updateProduct(productId, payload);
        setVariants(response.data.variants ?? variants);
        setImages(response.data.images ?? images);
        toast.success("Cap nhat san pham thanh cong");
      } else {
        const response = await productService.createProduct(payload);
        toast.success("Tao san pham thanh cong");
        router.replace(`/admin/products/${getEntityId(response.data)}/edit`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVariantSubmit(values: ProductVariantFormValues) {
    if (!productId) {
      toast.error("Vui long luu san pham truoc khi them variant");
      return;
    }

    setVariantSubmitting(true);

    try {
      if (editingVariant) {
        await productService.updateVariant(getEntityId(editingVariant), normalizeVariant(values));
        toast.success("Cap nhat variant thanh cong");
      } else {
        await productService.createVariant(productId, normalizeVariant(values));
        toast.success("Them variant thanh cong");
      }

      setVariantModalOpen(false);
      setEditingVariant(null);
      await loadProduct(productId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setVariantSubmitting(false);
    }
  }

  async function handleImageSubmit(values: ProductImageFormValues) {
    if (!productId) {
      toast.error("Vui long luu san pham truoc khi them anh");
      return;
    }

    setImageSubmitting(true);

    try {
      await productService.createImage(productId, values);
      toast.success("Them anh san pham thanh cong");
      setImageModalOpen(false);
      await loadProduct(productId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setImageSubmitting(false);
    }
  }

  async function handleDeleteVariant() {
    if (!deletingVariant || !productId) {
      return;
    }

    try {
      await productService.deleteVariant(getEntityId(deletingVariant));
      toast.success("Da xoa variant");
      setDeletingVariant(null);
      await loadProduct(productId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleDeleteImage() {
    if (!deletingImage || !productId) {
      return;
    }

    try {
      await productService.deleteImage(getEntityId(deletingImage));
      toast.success("Da xoa anh san pham");
      setDeletingImage(null);
      await loadProduct(productId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-96 place-items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Chia thong tin san pham thanh cac section ro rang, de van hanh va kiem soat."
        icon={Package}
        title={isEdit ? "Sua san pham" : "Tao san pham"}
        actions={
          <Button className="gap-2" variant="outline">
            <Link className="inline-flex items-center gap-2" href="/admin/products">
              <ArrowLeft className="size-4" />
              Quay lai
            </Link>
          </Button>
        }
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Thong tin co ban</CardTitle>
            <CardDescription>Ten, SKU, danh muc, thuong hieu va trang thai san pham.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field error={errors.name?.message} label="Ten san pham">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("name")} />
            </Field>
            <Field error={errors.slug?.message} label="Slug">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("slug")} />
            </Field>
            <Field error={errors.sku?.message} label="SKU">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("sku")} />
            </Field>
            <Field error={errors.category?.message} label="Danh muc">
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("category")}>
                <option value="">Chon danh muc</option>
                {categories.map((category) => {
                  const categoryId = getEntityId(category);
                  if (!categoryId) return null;
                  return <option key={categoryId} value={categoryId}>{category.name}</option>;
                })}
              </select>
            </Field>
            <Field error={errors.brand?.message} label="Thuong hieu">
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("brand")}>
                <option value="">Chon thuong hieu</option>
                {brands.map((brand) => {
                  const brandId = getEntityId(brand);
                  if (!brandId) return null;
                  return <option key={brandId} value={brandId}>{brand.name}</option>;
                })}
              </select>
            </Field>
            <Field error={errors.unit?.message} label="Don vi">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="chai, hop, kg" {...register("unit")} />
            </Field>
            <Field error={errors.status?.message} label="Trang thai">
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Noi dung san pham</CardTitle>
            <CardDescription>Mo ta ngan, mo ta chi tiet, xuat xu va cach bao quan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field error={errors.shortDescription?.message} label="Mo ta ngan">
              <textarea className="min-h-20 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("shortDescription")} />
            </Field>
            <Field error={errors.description?.message} label="Mo ta chi tiet">
              <textarea className="min-h-32 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("description")} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field error={errors.origin?.message} label="Xuat xu">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("origin")} />
              </Field>
              <Field error={errors.tags?.message} label="Tags">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="organic, fresh, imported" {...register("tags")} />
              </Field>
            </div>
            <Field error={errors.ingredients?.message} label="Thanh phan">
              <textarea className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("ingredients")} />
            </Field>
            <Field error={errors.storageInstruction?.message} label="Huong dan bao quan">
              <textarea className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("storageInstruction")} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={submitting} type="submit">
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Luu san pham
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Variants</CardTitle>
            <CardDescription>Quan ly gia, barcode va don vi ban.</CardDescription>
          </div>
          <Button disabled={!productId} className="gap-2" onClick={() => setVariantModalOpen(true)}>
            <Plus className="size-4" />
            Them variant
          </Button>
        </CardHeader>
        <CardContent>
          {!productId ? (
            <EmptyHint text="Luu san pham truoc khi them variant." />
          ) : variants.length === 0 ? (
            <EmptyHint text="Chua co variant nao." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ten</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Gia</TableHead>
                  <TableHead>Sale</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={getEntityId(variant)}>
                    <TableCell className="font-medium">{variant.name}</TableCell>
                    <TableCell className="font-mono text-xs">{variant.barcode || "-"}</TableCell>
                    <TableCell>{formatCurrency(variant.price)}</TableCell>
                    <TableCell>{variant.salePrice ? formatCurrency(variant.salePrice) : "-"}</TableCell>
                    <TableCell>
                      <StatusBadge label={variant.status} variant={variant.status === "ACTIVE" ? "success" : "neutral"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => { setEditingVariant(variant); setVariantModalOpen(true); }}>
                          <Save className="size-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => setDeletingVariant(variant)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Hinh anh san pham</CardTitle>
            <CardDescription>Quan ly gallery, thumbnail va thu tu hien thi.</CardDescription>
          </div>
          <Button disabled={!productId} className="gap-2" onClick={() => setImageModalOpen(true)}>
            <Plus className="size-4" />
            Them anh
          </Button>
        </CardHeader>
        <CardContent>
          {!productId ? (
            <EmptyHint text="Luu san pham truoc khi them anh." />
          ) : images.length === 0 ? (
            <EmptyHint text="Chua co anh san pham." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image) => (
                <div key={getEntityId(image)} className="overflow-hidden rounded-lg border bg-background">
                  <div className="flex h-40 items-center justify-center bg-muted">
                    {image.imageUrl ? (
                      <div aria-label="Product image" className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${image.imageUrl})` }} />
                    ) : (
                      <ImageIcon className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <StatusBadge label={image.isThumbnail ? "Thumbnail" : `Sort ${image.sortOrder}`} variant={image.isThumbnail ? "success" : "neutral"} />
                    <Button size="icon" variant="destructive" onClick={() => setDeletingImage(image)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProductVariantModal
        initialValues={editingVariant}
        open={variantModalOpen}
        submitting={variantSubmitting}
        onClose={() => {
          setVariantModalOpen(false);
          setEditingVariant(null);
        }}
        onSubmit={handleVariantSubmit}
      />
      <ProductImageModal
        open={imageModalOpen}
        submitting={imageSubmitting}
        onClose={() => setImageModalOpen(false)}
        onSubmit={handleImageSubmit}
      />
      <ConfirmDialog
        description={`Xoa variant "${deletingVariant?.name ?? ""}"?`}
        open={Boolean(deletingVariant)}
        title="Xoa variant"
        confirmText="Xoa"
        onConfirm={handleDeleteVariant}
        onOpenChange={(open) => {
          if (!open) setDeletingVariant(null);
        }}
      />
      <ConfirmDialog
        description="Xoa anh san pham nay?"
        open={Boolean(deletingImage)}
        title="Xoa anh"
        confirmText="Xoa"
        onConfirm={handleDeleteImage}
        onOpenChange={(open) => {
          if (!open) setDeletingImage(null);
        }}
      />
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

function EmptyHint({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</div>;
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children ?? [])]);
}

function getRefId(value: Product["category"] | Product["brand"]) {
  if (!value) return "";
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

function splitTags(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeVariant(values: ProductVariantFormValues) {
  return {
    name: values.name,
    barcode: emptyToUndefined(values.barcode),
    price: values.price,
    salePrice: values.salePrice || undefined,
    weight: values.weight || undefined,
    unit: emptyToUndefined(values.unit),
    status: values.status,
  };
}

function generateSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
