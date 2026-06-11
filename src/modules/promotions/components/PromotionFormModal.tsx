"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { Product } from "@/modules/products";
import {
  promotionFormSchema,
  type Promotion,
  type PromotionFormInput,
  type PromotionFormValues,
} from "@/modules/promotions";

type PromotionFormModalProps = {
  open: boolean;
  title: string;
  products: Product[];
  initialValues?: Promotion | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: PromotionFormValues) => void;
};

const defaultValues: PromotionFormInput = {
  name: "",
  code: "",
  discountType: "PERCENT",
  discountValue: 0,
  minOrderValue: "",
  maxDiscount: "",
  startDate: "",
  endDate: "",
  productIds: [],
  status: "ACTIVE",
};

export function PromotionFormModal({
  open,
  title,
  products,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: PromotionFormModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PromotionFormInput, unknown, PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            code: initialValues.code ?? "",
            discountType: initialValues.discountType,
            discountValue: initialValues.discountValue,
            minOrderValue: initialValues.minOrderValue ?? "",
            maxDiscount: initialValues.maxDiscount ?? "",
            startDate: toDateInputValue(initialValues.startDate),
            endDate: toDateInputValue(initialValues.endDate),
            productIds: getProductIds(initialValues),
            status: initialValues.status,
          }
        : defaultValues,
    );
  }, [initialValues, open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section aria-modal="true" className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl" role="dialog">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thiet lap giam gia, thoi gian ap dung va danh sach san pham trong promotion.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ten khuyen mai" error={errors.name?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("name")} />
            </Field>
            <Field label="Code noi bo" error={errors.code?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" placeholder="SUMMER-SALE" {...register("code")} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Loai giam" error={errors.discountType?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("discountType")}>
                <option value="PERCENT">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
            </Field>
            <Field label="Gia tri giam" error={errors.discountValue?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("discountValue")} />
            </Field>
            <Field label="Don toi thieu" error={errors.minOrderValue?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("minOrderValue")} />
            </Field>
            <Field label="Giam toi da" error={errors.maxDiscount?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("maxDiscount")} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Ngay bat dau" error={errors.startDate?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="date" {...register("startDate")} />
            </Field>
            <Field label="Ngay ket thuc" error={errors.endDate?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="date" {...register("endDate")} />
            </Field>
            <Field label="Trang thai" error={errors.status?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          </div>

          <Field label="San pham ap dung" error={errors.productIds?.message}>
            <select className="min-h-40 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" multiple {...register("productIds")}>
              {products.map((product) => {
                const productId = getEntityId(product);
                if (!productId) return null;
                return (
                  <option key={productId} value={productId}>
                    {product.name} - {product.sku}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-muted-foreground">Giu Ctrl/Command de chon nhieu san pham. Bo trong neu promotion ap dung toan catalog.</p>
          </Field>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu khuyen mai
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

function getProductIds(promotion: Promotion) {
  if (promotion.productIds?.length) return promotion.productIds;

  return (promotion.products ?? []).map((item) => (typeof item === "string" ? item : getEntityId(item))).filter(Boolean);
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function toDateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}
