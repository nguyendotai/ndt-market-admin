"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  bannerFormSchema,
  type Banner,
  type BannerFormInput,
  type BannerFormValues,
} from "@/modules/banners";
import { uploadService } from "@/services/upload.service";

type BannerFormModalProps = {
  open: boolean;
  title: string;
  initialValues?: Banner | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: BannerFormValues) => void;
};

const defaultValues: BannerFormInput = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  position: "HOME_HERO",
  startDate: "",
  endDate: "",
  status: "ACTIVE",
  sortOrder: 0,
};

const POSITION_OPTIONS = [
  "HOME_HERO",
  "HOME_TOP",
  "HOME_MIDDLE",
  "HOME_BOTTOM",
  "CATEGORY_TOP",
  "PRODUCT_DETAIL",
];

export function BannerFormModal({
  open,
  title,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: BannerFormModalProps) {
  const [uploading, setUploading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<BannerFormInput, unknown, BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  useEffect(() => {
    reset(
      initialValues
        ? {
            title: initialValues.title,
            imageUrl: initialValues.imageUrl,
            linkUrl: initialValues.linkUrl ?? "",
            position: initialValues.position,
            startDate: toDateInputValue(initialValues.startDate),
            endDate: toDateInputValue(initialValues.endDate),
            status: initialValues.status,
            sortOrder: initialValues.sortOrder ?? 0,
          }
        : defaultValues,
    );
  }, [initialValues, open, reset]);

  if (!open) return null;

  async function handleUploadImage(file?: File) {
    if (!file) return;

    setUploading(true);

    try {
      const response = await uploadService.uploadImage(file, "banner");
      setValue("imageUrl", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload banner thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section aria-modal="true" className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl" role="dialog">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quan ly anh banner, vi tri hien thi, thoi gian chay va thu tu sap xep.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tieu de" error={errors.title?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("title")} />
            </Field>
            <Field label="Link URL" error={errors.linkUrl?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="https://..." {...register("linkUrl")} />
            </Field>
          </div>

          <Field label="Anh banner" error={errors.imageUrl?.message}>
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="grid gap-2">
                <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="Cloudinary image URL" {...register("imageUrl")} />
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload banner
                  <input
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    disabled={uploading}
                    type="file"
                    onChange={(event) => handleUploadImage(event.target.files?.[0])}
                  />
                </label>
                <p className="text-xs text-muted-foreground">Ho tro jpg, jpeg, png, webp. Toi da 5MB. Folder Cloudinary: banner.</p>
              </div>
              <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {imageUrl ? (
                  <div aria-label="Banner preview" className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${imageUrl})` }} />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </Field>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Position" error={errors.position?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("position")}>
                {POSITION_OPTIONS.map((position) => <option key={position} value={position}>{position}</option>)}
              </select>
            </Field>
            <Field label="Ngay bat dau" error={errors.startDate?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="date" {...register("startDate")} />
            </Field>
            <Field label="Ngay ket thuc" error={errors.endDate?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="date" {...register("endDate")} />
            </Field>
            <Field label="Sort order" error={errors.sortOrder?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("sortOrder")} />
            </Field>
          </div>

          <Field label="Trang thai" error={errors.status?.message}>
            <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </Field>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting || uploading} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu banner
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

function toDateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Upload banner that bai";
}
