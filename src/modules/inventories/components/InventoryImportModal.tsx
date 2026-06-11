"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  inventoryImportSchema,
  type InventoryImportInput,
  type InventoryImportValues,
  type InventoryItem,
} from "@/modules/inventories";
import type { Product } from "@/modules/products";
import type { Store } from "@/modules/stores";

type InventoryImportModalProps = {
  open: boolean;
  inventories: InventoryItem[];
  products: Product[];
  stores: Store[];
  initialInventory?: InventoryItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: InventoryImportValues) => void;
};

const defaultValues: InventoryImportInput = {
  inventoryId: "",
  productId: "",
  quantity: 1,
  storeId: "",
  variantId: "",
  reason: "",
};

export function InventoryImportModal({
  open,
  inventories,
  products,
  stores,
  initialInventory,
  submitting = false,
  onClose,
  onSubmit,
}: InventoryImportModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<InventoryImportInput, unknown, InventoryImportValues>({
    resolver: zodResolver(inventoryImportSchema),
    defaultValues,
  });

  const storeId = useWatch({ control, name: "storeId" });
  const productId = useWatch({ control, name: "productId" });
  const variantId = useWatch({ control, name: "variantId" });

  const selectedProduct = useMemo(
    () => products.find((product) => getEntityId(product) === productId),
    [productId, products],
  );
  const variants = selectedProduct?.variants ?? [];
  const matchedInventory = useMemo(
    () =>
      inventories.find(
        (inventory) =>
          getRefId(inventory.store, inventory.storeId) === storeId &&
          getRefId(inventory.product, inventory.productId) === productId &&
          getRefId(inventory.variant, inventory.variantId) === variantId,
      ),
    [inventories, productId, storeId, variantId],
  );

  useEffect(() => {
    reset({
      ...defaultValues,
      inventoryId: initialInventory ? getEntityId(initialInventory) : "",
      productId: initialInventory ? getRefId(initialInventory.product, initialInventory.productId) : "",
      storeId: initialInventory ? getRefId(initialInventory.store, initialInventory.storeId) : "",
      variantId: initialInventory ? getRefId(initialInventory.variant, initialInventory.variantId) : "",
    });
  }, [initialInventory, open, reset]);

  useEffect(() => {
    setValue("inventoryId", matchedInventory ? getEntityId(matchedInventory) : "", { shouldValidate: true });
  }, [matchedInventory, setValue]);

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
              Chon chi nhanh, san pham va bien the. Backend se tu tao inventory neu chua co.
            </p>
          </div>
          <Button aria-label="Dong" size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Chi nhanh" error={errors.storeId?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30" {...register("storeId")}>
                <option value="">Chon chi nhanh</option>
                {stores.map((store) => {
                  const id = getEntityId(store);
                  return id ? <option key={id} value={id}>{store.name}</option> : null;
                })}
              </select>
            </Field>

            <Field label="San pham" error={errors.productId?.message}>
              <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30" {...register("productId")}>
                <option value="">Chon san pham</option>
                {products.map((product) => {
                  const id = getEntityId(product);
                  return id ? <option key={id} value={id}>{product.name} - {product.sku || product.slug}</option> : null;
                })}
              </select>
            </Field>

            <Field label="Bien the" error={errors.variantId?.message}>
              <select
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:bg-muted"
                disabled={!productId}
                {...register("variantId")}
              >
                <option value="">{productId ? "Chon bien the" : "Chon san pham truoc"}</option>
                {variants.map((variant) => {
                  const id = getEntityId(variant);
                  return id ? <option key={id} value={id}>{variant.name} - {variant.barcode || "No barcode"}</option> : null;
                })}
              </select>
            </Field>

            <Field label="Dong ton kho">
              <input
                className="h-10 rounded-lg border bg-muted px-3 text-sm text-muted-foreground outline-none"
                readOnly
                value={matchedInventory ? getInventoryLabel(matchedInventory) : "Chua co dong ton kho"}
              />
              <input type="hidden" {...register("inventoryId")} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="So luong nhap" error={errors.quantity?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                min={1}
                type="number"
                {...register("quantity")}
              />
            </Field>

            <Field label="Ly do" error={errors.reason?.message}>
              <input
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                placeholder="Nhap hang dau ngay"
                {...register("reason")}
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

function getRefId(value: InventoryItem["product"] | InventoryItem["variant"] | InventoryItem["store"], fallback?: string) {
  if (!value) return fallback ?? "";
  if (typeof value === "string") return value;
  return getEntityId(value);
}
