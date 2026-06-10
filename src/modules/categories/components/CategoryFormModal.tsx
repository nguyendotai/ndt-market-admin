"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  categoryFormSchema,
  type Category,
  type CategoryFormInput,
  type CategoryFormValues,
} from "@/modules/categories";
import { uploadService } from "@/services/upload.service";

type CategoryFormModalProps = {
  open: boolean;
  title: string;
  categories: Category[];
  initialValues?: Category | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
};

const defaultValues: CategoryFormInput = {
  name: "",
  parent: "",
  slug: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

export function CategoryFormModal({
  open,
  title,
  categories,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [uploading, setUploading] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    control,
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const image = useWatch({ control, name: "image" });
  const name = useWatch({ control, name: "name" });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            parent: getCategoryParentId(initialValues) ?? "",
            slug: initialValues.slug,
            image: initialValues.image ?? "",
            sortOrder: initialValues.sortOrder ?? 0,
            isActive: initialValues.isActive,
          }
        : defaultValues,
    );
  }, [initialValues, open, reset]);

  useEffect(() => {
    if (!initialValues && name) {
      setValue("slug", generateSlug(name), { shouldValidate: true });
    }
  }, [initialValues, name, setValue]);

  if (!open) {
    return null;
  }

  const parentOptions = flattenCategoryOptions(categories).filter(
    (category) => category.id !== initialValues?._id,
  );

  async function handleUploadImage(file?: File) {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "category");
      setValue("image", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload anh danh muc thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section
        aria-modal="true"
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl"
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quan ly ten, slug, danh muc cha, hinh anh va trang thai hien thi.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ten danh muc" error={errors.name?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Rau cu qua"
                {...register("name")}
              />
            </Field>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="rau-cu-qua"
                {...register("slug")}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Danh muc cha" error={errors.parent?.message}>
              <select
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                {...register("parent")}
              >
                <option value="">Khong co</option>
                {parentOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Thu tu sap xep" error={errors.sortOrder?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                min={0}
                type="number"
                {...register("sortOrder")}
              />
            </Field>
          </div>

          <Field label="Hinh anh danh muc" error={errors.image?.message}>
            <div className="grid gap-3 md:grid-cols-[1fr_120px]">
              <div className="grid gap-2">
                <input
                  className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                  placeholder="Cloudinary image URL"
                  {...register("image")}
                />
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload anh
                  <input
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    disabled={uploading}
                    type="file"
                    onChange={(event) => handleUploadImage(event.target.files?.[0])}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Ho tro jpg, jpeg, png, webp. Toi da 5MB. Anh luu tren Cloudinary folder ndt-market/category.
                </p>
              </div>
              <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {image ? (
                  <div
                    aria-label="Category preview"
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </Field>

          <label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium">
            <input className="size-4 accent-primary" type="checkbox" {...register("isActive")} />
            Active
          </label>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Huy
            </Button>
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu danh muc
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

function generateSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function flattenCategoryOptions(categories: Category[], depth = 0): Array<{ id: string; label: string }> {
  return categories.flatMap((category) => [
    { id: category._id, label: `${"--".repeat(depth)} ${category.name}`.trim() },
    ...flattenCategoryOptions(category.children ?? [], depth + 1),
  ]);
}

function getCategoryParentId(category: Category) {
  if (category.parentId) {
    return category.parentId;
  }

  if (typeof category.parent === "string") {
    return category.parent;
  }

  return category.parent?._id ?? "";
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Upload anh that bai";
}
