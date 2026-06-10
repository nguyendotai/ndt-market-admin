"use client";

import { Edit, Loader2, MapPin, Plus, Search, Store, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StoreFormModal } from "@/modules/stores/components/StoreFormModal";
import type { Store as StoreItem, StoreFormPayload, StoreFormValues, StoreStatus } from "@/modules/stores";
import { storeService } from "@/services/store.service";

type StatusFilter = StoreStatus | "all";

export function StoresPage() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null);
  const [deletingStore, setDeletingStore] = useState<StoreItem | null>(null);
  const [togglingStore, setTogglingStore] = useState<StoreItem | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadStores() {
    setLoading(true);

    try {
      const response = await storeService.listStores({
        search: search.trim() || undefined,
        status,
      });
      setStores(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadStores();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadStores intentionally reads the current filter state from this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const visibleStores = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return stores.filter((store) => {
      const matchesSearch =
        !keyword ||
        store.name.toLowerCase().includes(keyword) ||
        getFullAddress(store).toLowerCase().includes(keyword) ||
        (store.phone ?? "").toLowerCase().includes(keyword);
      const matchesStatus = status === "all" || store.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [stores, search, status]);

  async function handleSubmit(values: StoreFormValues) {
    setSubmitting(true);

    const payload: StoreFormPayload = {
      name: values.name,
      phone: emptyToUndefined(values.phone),
      province: values.province,
      district: values.district,
      ward: values.ward,
      address: values.address,
      latitude: normalizeOptionalNumber(values.latitude),
      longitude: normalizeOptionalNumber(values.longitude),
      openingHours: emptyToUndefined(values.openingHours),
      status: values.status,
    };

    try {
      if (editingStore) {
        await storeService.updateStore(getEntityId(editingStore), payload);
        toast.success("Cap nhat cua hang thanh cong");
      } else {
        await storeService.createStore(payload);
        toast.success("Tao cua hang thanh cong");
      }

      setFormOpen(false);
      setEditingStore(null);
      await loadStores();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingStore) {
      return;
    }

    try {
      await storeService.deleteStore(getEntityId(deletingStore));
      toast.success("Da xoa cua hang");
      setDeletingStore(null);
      await loadStores();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleToggleStatus() {
    if (!togglingStore) return;
    const nextStatus: StoreStatus = togglingStore.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await storeService.updateStore(getEntityId(togglingStore), { status: nextStatus });
      toast.success(nextStatus === "ACTIVE" ? "Da bat cua hang" : "Da tat cua hang");
      setTogglingStore(null);
      await loadStores();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly chi nhanh, dia chi giao hang, toa do ban do va trang thai hoat dong."
        icon={Store}
        title="Quan ly cua hang"
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setEditingStore(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Tao cua hang
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach chi nhanh</CardTitle>
            <div className="grid gap-2 md:grid-cols-[minmax(260px,360px)_160px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search theo ten, dia chi"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <select
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">Tat ca status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="mb-3 size-6 animate-spin text-primary" />
                <p className="font-medium">Dang tai cua hang</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cua hang</TableHead>
                  <TableHead>Dia chi</TableHead>
                  <TableHead>Toa do</TableHead>
                  <TableHead>Gio mo cua</TableHead>
                  <TableHead>Trang thai</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleStores.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={6}>
                      Khong tim thay cua hang phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleStores.map((store) => (
                    <TableRow key={getEntityId(store)}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">{store.phone || "Chua co so dien thoai"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="flex gap-2 text-sm">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{getFullAddress(store)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {formatCoordinate(store)}
                      </TableCell>
                      <TableCell>{store.openingHours || "-"}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => setTogglingStore(store)}>
                          <StatusBadge
                            label={store.status}
                            variant={store.status === "ACTIVE" ? "success" : "neutral"}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            aria-label="Sua cua hang"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setEditingStore(store);
                              setFormOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            aria-label="Xoa cua hang"
                            size="icon"
                            variant="destructive"
                            onClick={() => setDeletingStore(store)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <StoreFormModal
        initialValues={editingStore}
        open={formOpen}
        submitting={submitting}
        title={editingStore ? "Sua cua hang" : "Tao cua hang"}
        onClose={() => {
          setFormOpen(false);
          setEditingStore(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa cua hang "${deletingStore?.name ?? ""}"? Hanh dong nay khong the hoan tac.`}
        open={Boolean(deletingStore)}
        title="Xoa cua hang"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingStore(null);
          }
        }}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${togglingStore?.status === "ACTIVE" ? "tat" : "bat"} cua hang "${togglingStore?.name ?? ""}"?`}
        open={Boolean(togglingStore)}
        title="Cap nhat trang thai cua hang"
        confirmText="Xac nhan"
        onConfirm={handleToggleStatus}
        onOpenChange={(open) => {
          if (!open) setTogglingStore(null);
        }}
      />
    </div>
  );
}

function getFullAddress(store: StoreItem) {
  return [store.address, store.ward, store.district, store.province].filter(Boolean).join(", ");
}

function formatCoordinate(store: StoreItem) {
  if (store.latitude == null || store.longitude == null) {
    return "-";
  }

  return `${store.latitude}, ${store.longitude}`;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function emptyToUndefined(value?: string | number | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue ? stringValue : undefined;
}

function normalizeOptionalNumber(value: StoreFormValues["latitude"]) {
  if (value === "" || value == null) {
    return undefined;
  }

  return Number(value);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
