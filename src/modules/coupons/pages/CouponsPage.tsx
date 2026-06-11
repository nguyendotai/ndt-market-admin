"use client";

import { Copy, Edit, Loader2, Plus, Search, TicketPercent, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CouponFormModal } from "@/modules/coupons/components/CouponFormModal";
import type { Coupon, CouponFormPayload, CouponFormValues, CouponStatus } from "@/modules/coupons";
import { couponService } from "@/services/coupon.service";

type StatusFilter = CouponStatus | "all";

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadCoupons() {
    setLoading(true);

    try {
      const response = await couponService.listCoupons({
        keyword: keyword.trim() || undefined,
        status,
      });
      setCoupons(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCoupons();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadCoupons intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status]);

  const visibleCoupons = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesStatus = status === "all" || coupon.status === status;
      const searchBlob = [coupon.code, coupon.name].join(" ").toLowerCase();
      return matchesStatus && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
    });
  }, [coupons, keyword, status]);

  async function handleSubmit(values: CouponFormValues) {
    setSubmitting(true);

    const payload: CouponFormPayload = {
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderValue: normalizeOptionalNumber(values.minOrderValue),
      maxDiscount: normalizeOptionalNumber(values.maxDiscount),
      expiredAt: toIsoDate(values.expiredAt),
      usageLimit: normalizeOptionalNumber(values.usageLimit),
      userLimit: normalizeOptionalNumber(values.userLimit),
      status: values.status,
    };

    try {
      if (editingCoupon) {
        await couponService.updateCoupon(getEntityId(editingCoupon), payload);
        toast.success("Cap nhat coupon thanh cong");
      } else {
        await couponService.createCoupon(payload);
        toast.success("Tao coupon thanh cong");
      }

      setFormOpen(false);
      setEditingCoupon(null);
      await loadCoupons();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingCoupon) return;

    try {
      await couponService.deleteCoupon(getEntityId(deletingCoupon));
      toast.success("Da xoa coupon");
      setDeletingCoupon(null);
      await loadCoupons();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Da copy ${code}`);
    } catch {
      toast.error("Khong the copy coupon code");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly ma giam gia, han su dung, gioi han usage va trang thai kich hoat."
        icon={TicketPercent}
        title="Quan ly ma giam gia"
        actions={
          <Button className="gap-2" onClick={() => { setEditingCoupon(null); setFormOpen(true); }}>
            <Plus className="size-4" />
            Tao coupon
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach coupon</CardTitle>
            <div className="grid gap-2 sm:grid-cols-[minmax(260px,360px)_160px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search code/ten" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
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
            <Table className="min-w-[1040px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Dieu kien</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>User limit</TableHead>
                  <TableHead>Het han</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCoupons.length === 0 ? (
                  <TableRow><TableCell className="py-12 text-center text-muted-foreground" colSpan={8}>Khong tim thay coupon phu hop.</TableCell></TableRow>
                ) : visibleCoupons.map((coupon) => (
                  <TableRow key={getEntityId(coupon)}>
                    <TableCell className="w-[220px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{coupon.code}</span>
                        <Button aria-label="Copy coupon code" size="icon-xs" variant="ghost" onClick={() => handleCopyCode(coupon.code)}>
                          <Copy className="size-3.5" />
                        </Button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{coupon.name || "-"}</p>
                    </TableCell>
                    <TableCell>{formatDiscount(coupon.discountType, coupon.discountValue)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Min {formatCurrency(coupon.minOrderValue ?? 0)} / Max {formatCurrency(coupon.maxDiscount ?? 0)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{coupon.usedCount ?? 0} / {coupon.usageLimit ?? "∞"}</TableCell>
                    <TableCell className="font-mono text-sm">{coupon.userLimit ?? "∞"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(coupon.expiredAt)}</TableCell>
                    <TableCell>
                      <CouponStateBadge coupon={coupon} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button aria-label="Sua coupon" size="icon" variant="outline" onClick={() => { setEditingCoupon(coupon); setFormOpen(true); }}><Edit className="size-4" /></Button>
                        <Button aria-label="Xoa coupon" size="icon" variant="destructive" onClick={() => setDeletingCoupon(coupon)}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CouponFormModal
        initialValues={editingCoupon}
        open={formOpen}
        submitting={submitting}
        title={editingCoupon ? "Sua coupon" : "Tao coupon"}
        onClose={() => { setFormOpen(false); setEditingCoupon(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa coupon "${deletingCoupon?.code ?? ""}"?`}
        open={Boolean(deletingCoupon)}
        title="Xoa coupon"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => { if (!open) setDeletingCoupon(null); }}
      />
    </div>
  );
}

function CouponStateBadge({ coupon }: { coupon: Coupon }) {
  if (isExpired(coupon.expiredAt)) {
    return <StatusBadge label="EXPIRED" variant="danger" />;
  }

  return <StatusBadge label={coupon.status} variant={coupon.status === "ACTIVE" ? "success" : "neutral"} />;
}

function isExpired(value: string) {
  return new Date(value).getTime() < startOfToday();
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function normalizeOptionalNumber(value: CouponFormValues["minOrderValue"]) {
  if (value === "" || value == null) return undefined;
  return Number(value);
}

function formatDiscount(type: string, value: number) {
  return type === "PERCENT" ? `${value}%` : formatCurrency(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value));
}

function toIsoDate(value: string) {
  if (!value) return value;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
