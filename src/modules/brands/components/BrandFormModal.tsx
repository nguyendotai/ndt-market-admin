"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  brandFormSchema,
  type Brand,
  type BrandFormInput,
  type BrandFormValues,
} from "@/modules/brands";
import { uploadService } from "@/services/upload.service";

type BrandFormModalProps = {
  open: boolean;
  title: string;
  initialValues?: Brand | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: BrandFormValues) => void;
};

const defaultValues: BrandFormInput = {
  name: "",
  slug: "",
  logo: "",
  description: "",
  isActive: true,
};

export function BrandFormModal({
  open,
  title,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: BrandFormModalProps) {
  const [uploading, setUploading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<BrandFormInput, unknown, BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues,
  });

  const logo = useWatch({ control, name: "logo" });
  const name = useWatch({ control, name: "name" });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            slug: initialValues.slug,
            logo: initialValues.logo ?? "",
            description: initialValues.description ?? "",
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

  async function handleUploadLogo(file?: File) {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "brand");
      setValue("logo", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload logo thuong hieu thanh cong");
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
              Quan ly ten, slug, logo, mo ta va trang thai hien thi.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ten thuong hieu" error={errors.name?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Vinamilk"
                {...register("name")}
              />
            </Field>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="vinamilk"
                {...register("slug")}
              />
            </Field>
          </div>

          <Field label="Logo" error={errors.logo?.message}>
            <div className="grid gap-3 md:grid-cols-[1fr_120px]">
              <div className="grid gap-2">
                <input
                  className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                  placeholder="Cloudinary logo URL"
                  {...register("logo")}
                />
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload logo
                  <input
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    disabled={uploading}
                    type="file"
                    onChange={(event) => handleUploadLogo(event.target.files?.[0])}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Ho tro jpg, jpeg, png, webp. Toi da 5MB. Anh luu tren Cloudinary folder ndt-market/brand.
                </p>
              </div>
              <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {logo ? (
                  <div
                    aria-label="Brand logo preview"
                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                    role="img"
                    style={{ backgroundImage: `url(${logo})` }}
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </Field>

          <Field label="Mo ta" error={errors.description?.message}>
            <textarea
              className="min-h-28 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="Mo ta ngan ve thuong hieu"
              {...register("description")}
            />
          </Field>

          <label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium">
            <input className="size-4 accent-primary" type="checkbox" {...register("isActive")} />
            Active
          </label>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Huy
            </Button>
            <Button disabled={submitting || uploading} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu thuong hieu
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

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Upload logo that bai";
}

