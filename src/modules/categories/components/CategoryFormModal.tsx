"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  categoryFormSchema,
  type Category,
  type CategoryFormInput,
  type CategoryFormValues,
} from "@/modules/categories";

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
  parentId: "",
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
            parentId: initialValues.parentId ?? "",
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
    (category) => category.id !== initialValues?.id,
  );

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
            <Field label="Danh muc cha" error={errors.parentId?.message}>
              <select
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                {...register("parentId")}
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

          <Field label="Image URL" error={errors.image?.message}>
            <div className="grid gap-3 md:grid-cols-[1fr_96px]">
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="https://cdn.example.com/category.jpg"
                {...register("image")}
              />
              <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg border bg-muted">
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
    { id: category.id, label: `${"--".repeat(depth)} ${category.name}`.trim() },
    ...flattenCategoryOptions(category.children ?? [], depth + 1),
  ]);
}
