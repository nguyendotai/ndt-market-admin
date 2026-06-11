"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  couponFormSchema,
  type Coupon,
  type CouponFormInput,
  type CouponFormValues,
} from "@/modules/coupons";

type CouponFormModalProps = {
  open: boolean;
  title: string;
  initialValues?: Coupon | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CouponFormValues) => void;
};

const defaultValues: CouponFormInput = {
  code: "",
  name: "",
  discountType: "PERCENT",
  discountValue: 0,
  minOrderValue: "",
  maxDiscount: "",
  expiredAt: "",
  usageLimit: "",
  userLimit: "",
  status: "ACTIVE",
};

export function CouponFormModal({
  open,
  title,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: CouponFormModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            code: initialValues.code,
            name: initialValues.name ?? "",
            discountType: initialValues.discountType,
            discountValue: initialValues.discountValue,
            minOrderValue: initialValues.minOrderValue ?? "",
            maxDiscount: initialValues.maxDiscount ?? "",
            expiredAt: toDateInputValue(initialValues.expiredAt),
            usageLimit: initialValues.usageLimit ?? "",
            userLimit: initialValues.userLimit ?? "",
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
              Thiet lap coupon code, dieu kien su dung, han dung va gioi han luot dung.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Coupon code" error={errors.code?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 font-mono text-sm uppercase outline-none focus:ring-3 focus:ring-ring/30" placeholder="NDTSALE" {...register("code")} />
            </Field>
            <Field label="Ten coupon" error={errors.name?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("name")} />
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

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Het han" error={errors.expiredAt?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="date" {...register("expiredAt")} />
            </Field>
            <Field label="Usage limit" error={errors.usageLimit?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("usageLimit")} />
            </Field>
            <Field label="User limit" error={errors.userLimit?.message}>
              <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...register("userLimit")} />
            </Field>
            <Field label="Trang thai" error={errors.status?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...register("status")}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu coupon
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
