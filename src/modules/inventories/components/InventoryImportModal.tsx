"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  inventoryImportSchema,
  type InventoryImportInput,
  type InventoryImportValues,
  type InventoryItem,
} from "@/modules/inventories";

type InventoryImportModalProps = {
  open: boolean;
  inventories: InventoryItem[];
  initialInventory?: InventoryItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: InventoryImportValues) => void;
};

const defaultValues: InventoryImportInput = {
  inventoryId: "",
  quantity: 1,
  note: "",
};

export function InventoryImportModal({
  open,
  inventories,
  initialInventory,
  submitting = false,
  onClose,
  onSubmit,
}: InventoryImportModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<InventoryImportInput, unknown, InventoryImportValues>({
    resolver: zodResolver(inventoryImportSchema),
    defaultValues,
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      inventoryId: initialInventory ? getEntityId(initialInventory) : "",
    });
  }, [initialInventory, open, reset]);

  if (!open) {
    return null;
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
            <h2 className="text-lg font-semibold">Nhap kho</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cong them so luong vao ton kho hien tai va ghi nhan stock movement.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Dong ton kho" error={errors.inventoryId?.message}>
            <select
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              {...register("inventoryId")}
            >
              <option value="">Chon san pham / chi nhanh</option>
              {inventories.map((inventory) => (
                <option key={getEntityId(inventory)} value={getEntityId(inventory)}>
                  {getInventoryLabel(inventory)}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="So luong nhap" error={errors.quantity?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                min={1}
                type="number"
                {...register("quantity")}
              />
            </Field>

            <Field label="Ghi chu" error={errors.note?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Nhap tu nha cung cap"
                {...register("note")}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Huy
            </Button>
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Luu nhap kho
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

function getInventoryLabel(inventory: InventoryItem) {
  return `${getProductName(inventory)} - ${getVariantName(inventory)} - ${getStoreName(inventory)}`;
}

function getProductName(inventory: InventoryItem) {
  if (!inventory.product || typeof inventory.product === "string") return inventory.productId ?? "-";
  return inventory.product.name;
}

function getVariantName(inventory: InventoryItem) {
  if (!inventory.variant || typeof inventory.variant === "string") return inventory.variantId ?? "-";
  return inventory.variant.name;
}

function getStoreName(inventory: InventoryItem) {
  if (!inventory.store || typeof inventory.store === "string") return inventory.storeId ?? "-";
  return inventory.store.name;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}
