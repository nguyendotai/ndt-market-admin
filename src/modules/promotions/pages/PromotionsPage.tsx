"use client";

import { Edit, Loader2, Megaphone, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/modules/products";
import { PromotionFormModal } from "@/modules/promotions/components/PromotionFormModal";
import type { Promotion, PromotionFormPayload, PromotionFormValues, PromotionStatus } from "@/modules/promotions";
import { productService } from "@/services/product.service";
import { promotionService } from "@/services/promotion.service";

type StatusFilter = PromotionStatus | "all";

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  const [togglingPromotion, setTogglingPromotion] = useState<Promotion | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [promotionResponse, productResponse] = await Promise.all([
        promotionService.listPromotions({
          keyword: keyword.trim() || undefined,
          status,
        }),
        productService.listProducts({ limit: 200 }),
      ]);
      setPromotions(promotionResponse.data);
      setProducts(productResponse.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadData intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status]);

  const visiblePromotions = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return promotions.filter((promotion) => {
      const matchesStatus = status === "all" || promotion.status === status;
      const searchBlob = [promotion.name, promotion.code].join(" ").toLowerCase();
      return matchesStatus && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
    });
  }, [promotions, keyword, status]);

  async function handleSubmit(values: PromotionFormValues) {
    setSubmitting(true);

    const payload: PromotionFormPayload = {
      name: values.name,
      code: emptyToUndefined(values.code),
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderValue: normalizeOptionalNumber(values.minOrderValue),
      maxDiscount: normalizeOptionalNumber(values.maxDiscount),
      startDate: values.startDate,
      endDate: values.endDate,
      productIds: values.productIds,
      status: values.status,
    };

    try {
      if (editingPromotion) {
        await promotionService.updatePromotion(getEntityId(editingPromotion), payload);
        toast.success("Cap nhat khuyen mai thanh cong");
      } else {
        await promotionService.createPromotion(payload);
        toast.success("Tao khuyen mai thanh cong");
      }

      setFormOpen(false);
      setEditingPromotion(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingPromotion) return;

    try {
      await promotionService.deletePromotion(getEntityId(deletingPromotion));
      toast.success("Da xoa khuyen mai");
      setDeletingPromotion(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleToggleStatus() {
    if (!togglingPromotion) return;
    const nextStatus: PromotionStatus = togglingPromotion.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await promotionService.updatePromotion(getEntityId(togglingPromotion), { status: nextStatus });
      toast.success(nextStatus === "ACTIVE" ? "Da bat khuyen mai" : "Da tat khuyen mai");
      setTogglingPromotion(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly chuong trinh khuyen mai, san pham ap dung va khoang thoi gian hieu luc."
        icon={Megaphone}
        title="Quan ly khuyen mai"
        actions={
          <Button className="gap-2" onClick={() => { setEditingPromotion(null); setFormOpen(true); }}>
            <Plus className="size-4" />
            Tao khuyen mai
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach promotion</CardTitle>
            <div className="grid gap-2 sm:grid-cols-[minmax(260px,360px)_160px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search ten/code" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </div>
              <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
                <option value="all">Tat ca status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
          ) : (
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Ten</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Dieu kien</TableHead>
                  <TableHead>Thoi gian</TableHead>
                  <TableHead>San pham</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePromotions.length === 0 ? (
                  <TableRow><TableCell className="py-12 text-center text-muted-foreground" colSpan={7}>Khong tim thay khuyen mai phu hop.</TableCell></TableRow>
                ) : visiblePromotions.map((promotion) => (
                  <TableRow key={getEntityId(promotion)}>
                    <TableCell className="w-[220px]">
                      <p className="font-medium">{promotion.name}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{promotion.code || "-"}</p>
                    </TableCell>
                    <TableCell>{formatDiscount(promotion.discountType, promotion.discountValue)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Min {formatCurrency(promotion.minOrderValue ?? 0)} / Max {formatCurrency(promotion.maxDiscount ?? 0)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</TableCell>
                    <TableCell>{getProductCount(promotion)} san pham</TableCell>
                    <TableCell>
                      <button type="button" onClick={() => setTogglingPromotion(promotion)}>
                        <StatusBadge label={promotion.status} variant={promotion.status === "ACTIVE" ? "success" : "neutral"} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button aria-label="Sua khuyen mai" size="icon" variant="outline" onClick={() => { setEditingPromotion(promotion); setFormOpen(true); }}><Edit className="size-4" /></Button>
                        <Button aria-label="Xoa khuyen mai" size="icon" variant="destructive" onClick={() => setDeletingPromotion(promotion)}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PromotionFormModal
        initialValues={editingPromotion}
        open={formOpen}
        products={products}
        submitting={submitting}
        title={editingPromotion ? "Sua khuyen mai" : "Tao khuyen mai"}
        onClose={() => { setFormOpen(false); setEditingPromotion(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa khuyen mai "${deletingPromotion?.name ?? ""}"?`}
        open={Boolean(deletingPromotion)}
        title="Xoa khuyen mai"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => { if (!open) setDeletingPromotion(null); }}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${togglingPromotion?.status === "ACTIVE" ? "tat" : "bat"} khuyen mai "${togglingPromotion?.name ?? ""}"?`}
        open={Boolean(togglingPromotion)}
        title="Cap nhat trang thai khuyen mai"
        confirmText="Xac nhan"
        onConfirm={handleToggleStatus}
        onOpenChange={(open) => { if (!open) setTogglingPromotion(null); }}
      />
    </div>
  );
}

function getProductCount(promotion: Promotion) {
  return promotion.productIds?.length ?? promotion.products?.length ?? 0;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeOptionalNumber(value: PromotionFormValues["minOrderValue"]) {
  if (value === "" || value == null) return undefined;
  return Number(value);
}

function formatDiscount(type: string, value: number) {
  return type === "PERCENTAGE" ? `${value}%` : formatCurrency(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
