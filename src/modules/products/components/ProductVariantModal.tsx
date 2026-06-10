"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  productVariantFormSchema,
  type ProductVariant,
  type ProductVariantFormInput,
  type ProductVariantFormValues,
} from "@/modules/products";

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
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProductVariantFormInput, unknown, ProductVariantFormValues>({
    resolver: zodResolver(productVariantFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            barcode: initialValues.barcode ?? "",
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

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section className="w-full max-w-2xl rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {initialValues ? "Sua variant" : "Them variant"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quan ly gia, barcode, khoi luong va trang thai ban.
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
            </select>
          </Field>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Huy</Button>
            <Button disabled={submitting} type="submit">
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
