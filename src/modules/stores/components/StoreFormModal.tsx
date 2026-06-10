"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  storeFormSchema,
  type Store,
  type StoreFormInput,
  type StoreFormValues,
} from "@/modules/stores";

type StoreFormModalProps = {
  open: boolean;
  title: string;
  initialValues?: Store | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: StoreFormValues) => void;
};

const defaultValues: StoreFormInput = {
  name: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  latitude: "",
  longitude: "",
  openingHours: "",
  status: "ACTIVE",
};

export function StoreFormModal({
  open,
  title,
  initialValues,
  submitting = false,
  onClose,
  onSubmit,
}: StoreFormModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<StoreFormInput, unknown, StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      initialValues
        ? {
            name: initialValues.name,
            phone: initialValues.phone ?? "",
            province: initialValues.province,
            district: initialValues.district,
            ward: initialValues.ward,
            address: initialValues.address,
            latitude: initialValues.latitude ?? "",
            longitude: initialValues.longitude ?? "",
            openingHours: initialValues.openingHours ?? "",
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
      <section
        aria-modal="true"
        className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl"
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quan ly thong tin lien he, dia chi, toa do va trang thai hoat dong cua chi nhanh.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ten cua hang" error={errors.name?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="NDT Market Quan 1"
                {...register("name")}
              />
            </Field>

            <Field label="So dien thoai" error={errors.phone?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="0901234567"
                {...register("phone")}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Tinh/Thanh" error={errors.province?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="TP. Ho Chi Minh"
                {...register("province")}
              />
            </Field>

            <Field label="Quan/Huyen" error={errors.district?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Quan 1"
                {...register("district")}
              />
            </Field>

            <Field label="Phuong/Xa" error={errors.ward?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Ben Nghe"
                {...register("ward")}
              />
            </Field>
          </div>

          <Field label="Dia chi chi tiet" error={errors.address?.message}>
            <input
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="123 Le Loi"
              {...register("address")}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Latitude" error={errors.latitude?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="10.7769"
                step="any"
                type="number"
                {...register("latitude")}
              />
            </Field>

            <Field label="Longitude" error={errors.longitude?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="106.7009"
                step="any"
                type="number"
                {...register("longitude")}
              />
            </Field>

            <Field label="Trang thai" error={errors.status?.message}>
              <select
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                {...register("status")}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          </div>

          <Field label="Gio mo cua" error={errors.openingHours?.message}>
            <input
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder="08:00 - 22:00"
              {...register("openingHours")}
            />
          </Field>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Huy
            </Button>
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu cua hang
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
