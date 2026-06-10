"use client";

import { History, Loader2, PackagePlus, Search, SlidersHorizontal, Warehouse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InventoryAdjustModal } from "@/modules/inventories/components/InventoryAdjustModal";
import { InventoryImportModal } from "@/modules/inventories/components/InventoryImportModal";
import type {
  InventoryAdjustPayload,
  InventoryAdjustValues,
  InventoryImportPayload,
  InventoryImportValues,
  InventoryItem,
  StockMovement,
} from "@/modules/inventories";
import type { Store as StoreItem } from "@/modules/stores";
import { inventoryService } from "@/services/inventory.service";
import { storeService } from "@/services/store.service";

export function InventoriesPage() {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
  const [store, setStore] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movementLoading, setMovementLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [inventoryResponse, storeResponse] = await Promise.all([
        inventoryService.listInventories({
          keyword: keyword.trim() || undefined,
          store: store === "all" ? undefined : store,
        }),
        storeService.listStores(),
      ]);

      setInventories(inventoryResponse.data);
      setStores(storeResponse.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function loadMovements(inventoryId?: string) {
    setMovementLoading(true);

    try {
      const response = await inventoryService.listMovements({ inventoryId });
      setMovements(response.data);
    } catch {
      setMovements([]);
    } finally {
      setMovementLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadData intentionally reads the current filter state from this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, store]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadMovements(selectedInventory ? getEntityId(selectedInventory) : undefined);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [selectedInventory]);

  const visibleInventories = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return inventories.filter((inventory) => {
      const matchesStore = store === "all" || getRefId(inventory.store, inventory.storeId) === store;
      const searchBlob = [
        getProductName(inventory),
        getProductSku(inventory),
        getVariantName(inventory),
        getVariantBarcode(inventory),
        getStoreName(inventory),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStore && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
    });
  }, [inventories, keyword, store]);

  async function handleImport(values: InventoryImportValues) {
    setSubmitting(true);

    const payload: InventoryImportPayload = {
      inventoryId: values.inventoryId,
      quantity: values.quantity,
      note: emptyToUndefined(values.note),
    };

    try {
      await inventoryService.importStock(payload);
      toast.success("Nhap kho thanh cong");
      setImportOpen(false);
      setSelectedInventory(null);
      await loadData();
      await loadMovements(values.inventoryId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdjust(values: InventoryAdjustValues) {
    setSubmitting(true);

    const payload: InventoryAdjustPayload = {
      inventoryId: values.inventoryId,
      quantity: values.quantity,
      note: emptyToUndefined(values.note),
    };

    try {
      await inventoryService.adjustStock(payload);
      toast.success("Dieu chinh kho thanh cong");
      setAdjustOpen(false);
      setSelectedInventory(null);
      await loadData();
      await loadMovements(values.inventoryId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Theo doi ton kho theo san pham, variant va chi nhanh; canh bao LOW_STOCK khi hang san sang ban con tu 5 tro xuong."
        icon={Warehouse}
        title="Quan ly ton kho"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2"
              variant="outline"
              onClick={() => {
                setSelectedInventory(null);
                setAdjustOpen(true);
              }}
            >
              <SlidersHorizontal className="size-4" />
              Dieu chinh kho
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedInventory(null);
                setImportOpen(true);
              }}
            >
              <PackagePlus className="size-4" />
              Nhap kho
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle className="whitespace-nowrap">Bang ton kho</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(280px,380px)_220px]">
              <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search ten san pham, SKU, barcode"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                value={store}
                onChange={(event) => setStore(event.target.value)}
              >
                <option value="all">Tat ca cua hang</option>
                {stores.map((item) => {
                  const itemId = getEntityId(item);
                  if (!itemId) return null;
                  return (
                    <option key={itemId} value={itemId}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="mb-3 size-6 animate-spin text-primary" />
                <p className="font-medium">Dang tai ton kho</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-[1060px]">
              <TableHeader>
                <TableRow>
                  <TableHead>San pham</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Canh bao</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInventories.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={8}>
                      Khong tim thay ton kho phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleInventories.map((inventory) => {
                    const availableQuantity = getAvailableQuantity(inventory);
                    const isLowStock = availableQuantity <= 5;

                    return (
                      <TableRow key={getEntityId(inventory)}>
                        <TableCell className="w-[280px]">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{getProductName(inventory)}</p>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{getProductSku(inventory)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="w-[190px]">
                          <div>
                            <p className="font-medium">{getVariantName(inventory)}</p>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{getVariantBarcode(inventory)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="w-[180px]">{getStoreName(inventory)}</TableCell>
                        <TableCell className="w-[120px] font-mono">{inventory.quantity}</TableCell>
                        <TableCell className="w-[120px] font-mono">{inventory.reservedQuantity}</TableCell>
                        <TableCell className="w-[130px] font-mono font-semibold">{availableQuantity}</TableCell>
                        <TableCell className="w-[140px]">
                          <StatusBadge
                            label={isLowStock ? "LOW_STOCK" : "IN_STOCK"}
                            variant={isLowStock ? "warning" : "success"}
                          />
                        </TableCell>
                        <TableCell className="w-[190px]">
                          <div className="flex justify-end gap-2">
                            <Button
                              className="gap-2"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInventory(inventory);
                                setImportOpen(true);
                              }}
                            >
                              <PackagePlus className="size-3.5" />
                              Nhap
                            </Button>
                            <Button
                              className="gap-2"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInventory(inventory);
                                setAdjustOpen(true);
                              }}
                            >
                              <SlidersHorizontal className="size-3.5" />
                              Sua
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-primary" />
            Lich su stock movement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {movementLoading ? (
            <div className="grid min-h-40 place-items-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : movements.length === 0 ? (
            <div className="grid min-h-40 place-items-center px-4 text-center text-sm text-muted-foreground">
              Backend chua cung cap API lich su stock movement hoac chua co du lieu.
            </div>
          ) : (
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Loai</TableHead>
                  <TableHead>So luong</TableHead>
                  <TableHead>Ghi chu</TableHead>
                  <TableHead>Thoi gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={getEntityId(movement)}>
                    <TableCell>
                      <StatusBadge label={movement.type} variant={movement.type === "IMPORT" ? "success" : "info"} />
                    </TableCell>
                    <TableCell className="font-mono">{movement.quantity}</TableCell>
                    <TableCell>{movement.note || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(movement.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InventoryImportModal
        initialInventory={selectedInventory}
        inventories={inventories}
        open={importOpen}
        submitting={submitting}
        onClose={() => {
          setImportOpen(false);
          setSelectedInventory(null);
        }}
        onSubmit={handleImport}
      />

      <InventoryAdjustModal
        initialInventory={selectedInventory}
        inventories={inventories}
        open={adjustOpen}
        submitting={submitting}
        onClose={() => {
          setAdjustOpen(false);
          setSelectedInventory(null);
        }}
        onSubmit={handleAdjust}
      />
    </div>
  );
}

function getAvailableQuantity(inventory: InventoryItem) {
  return inventory.availableQuantity ?? inventory.quantity - inventory.reservedQuantity;
}

function getProductName(inventory: InventoryItem) {
  if (!inventory.product || typeof inventory.product === "string") return inventory.productId ?? "-";
  return inventory.product.name;
}

function getProductSku(inventory: InventoryItem) {
  if (!inventory.product || typeof inventory.product === "string") return inventory.productId ?? "-";
  return inventory.product.sku ?? "-";
}

function getVariantName(inventory: InventoryItem) {
  if (!inventory.variant || typeof inventory.variant === "string") return inventory.variantId ?? "-";
  return inventory.variant.name;
}

function getVariantBarcode(inventory: InventoryItem) {
  if (!inventory.variant || typeof inventory.variant === "string") return inventory.variantId ?? "-";
  return inventory.variant.barcode ?? "-";
}

function getStoreName(inventory: InventoryItem) {
  if (!inventory.store || typeof inventory.store === "string") return inventory.storeId ?? "-";
  return inventory.store.name;
}

function getRefId(value: InventoryItem["store"], fallback?: string) {
  if (!value) return fallback ?? "";
  if (typeof value === "string") return value;
  return getEntityId(value);
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
