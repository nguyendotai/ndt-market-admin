"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  productImageFormSchema,
  type ProductImageFormInput,
  type ProductImageFormValues,
} from "@/modules/products";
import { uploadService } from "@/services/upload.service";

type ProductImageModalProps = {
  open: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductImageFormValues) => void;
};

export function ProductImageModal({
  open,
  submitting = false,
  onClose,
  onSubmit,
}: ProductImageModalProps) {
  const [uploading, setUploading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<ProductImageFormInput, unknown, ProductImageFormValues>({
    resolver: zodResolver(productImageFormSchema),
    defaultValues: {
      imageUrl: "",
      isThumbnail: false,
      sortOrder: 0,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  if (!open) {
    return null;
  }

  async function handleUpload(file?: File) {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "product");
      setValue("imageUrl", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload anh san pham thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section className="w-full max-w-2xl rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Them anh san pham</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upload hoac nhap URL anh Cloudinary.</p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid gap-2 text-sm font-medium">
            Image URL
            <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("imageUrl")} />
            {errors.imageUrl ? <span className="text-xs font-medium text-destructive">{errors.imageUrl.message}</span> : null}
          </label>

          <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload anh
            <input accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" disabled={uploading} type="file" onChange={(event) => handleUpload(event.target.files?.[0])} />
          </label>

          <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {imageUrl ? (
              <div aria-label="Product image preview" className="h-full w-full bg-contain bg-center bg-no-repeat" role="img" style={{ backgroundImage: `url(${imageUrl})` }} />
            ) : (
              <ImageIcon className="size-6 text-muted-foreground" />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Sort order
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="number" {...register("sortOrder")} />
              {errors.sortOrder ? <span className="text-xs font-medium text-destructive">{errors.sortOrder.message}</span> : null}
            </label>
            <label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium">
              <input className="size-4 accent-primary" type="checkbox" {...register("isThumbnail")} />
              Anh thumbnail
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting || uploading} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu anh
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Upload anh that bai";
}

