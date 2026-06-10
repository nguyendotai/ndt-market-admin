"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  productVariantFormSchema,
  type ProductVariant,
  type ProductVariantFormInput,
  type ProductVariantFormValues,
} from "@/modules/products";
import { uploadService } from "@/services/upload.service";

type ProductVariantModalProps = {
  open: boolean;
  initialValues?: ProductVariant | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductVariantFormValues) => void;
};

const defaultValues: ProductVariantFormInput = {
  name: "",
  barcode: "",
  imageUrl: "",
  price: 0,
  salePrice: 0,
  weight: 0,
  unit: "",
  status: "ACTIVE",
};

export function ProductVariantModal({
  open,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: ProductVariantModalProps) {
  const [uploading, setUploading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ProductVariantFormInput, unknown, ProductVariantFormValues>({
    resolver: zodResolver(productVariantFormSchema),
    defaultValues,
  });
  const imageUrl = useWatch({ control, name: "imageUrl" });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            barcode: initialValues.barcode ?? "",
            imageUrl: initialValues.imageUrl ?? "",
            price: initialValues.price,
            salePrice: initialValues.salePrice ?? 0,
            weight: initialValues.weight ?? 0,
            unit: initialValues.unit ?? "",
            status: initialValues.status,
          }
        : defaultValues,
    );
  }, [initialValues, open, reset]);

  if (!open) {
    return null;
  }

  async function handleUploadImage(file?: File) {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "product");
      setValue("imageUrl", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload anh variant thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {initialValues ? "Sua variant" : "Them variant"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quan ly gia, barcode, anh rieng, khoi luong va trang thai ban.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field error={errors.name?.message} label="Ten variant">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("name")} />
            </Field>
            <Field error={errors.barcode?.message} label="Barcode">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("barcode")} />
            </Field>
          </div>

          <Field error={errors.imageUrl?.message} label="Anh rieng variant">
            <div className="grid gap-3 md:grid-cols-[1fr_120px]">
              <div className="grid gap-2">
                <input
                  className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                  placeholder="Cloudinary image URL"
                  {...register("imageUrl")}
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
                  Anh rieng cho quy cach/mau/size variant. Neu bo trong, frontend fallback ve thumbnail san pham.
                </p>
              </div>
              <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {imageUrl ? (
                  <div
                    aria-label="Variant image preview"
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field error={errors.price?.message} label="Gia ban">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="number" {...register("price")} />
            </Field>
            <Field error={errors.salePrice?.message} label="Gia khuyen mai">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="number" {...register("salePrice")} />
            </Field>
            <Field error={errors.weight?.message} label="Khoi luong">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="number" {...register("weight")} />
            </Field>
            <Field error={errors.unit?.message} label="Don vi">
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="g, kg, chai, hop" {...register("unit")} />
            </Field>
          </div>

          <Field error={errors.status?.message} label="Trang thai">
            <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
          </Field>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting || uploading} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu variant
            </Button>
          </div>
        </form>
      </section>
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

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Upload anh variant that bai";
}
