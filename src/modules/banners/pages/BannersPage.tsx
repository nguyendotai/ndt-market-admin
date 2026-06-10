"use client";

import { Edit, Image, ImageIcon, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BannerFormModal } from "@/modules/banners/components/BannerFormModal";
import type { Banner, BannerFormPayload, BannerFormValues, BannerPosition, BannerStatus } from "@/modules/banners";
import { bannerService } from "@/services/banner.service";

type StatusFilter = BannerStatus | "all";
type PositionFilter = BannerPosition | "all";

const POSITION_OPTIONS = [
  "all",
  "HOME_HERO",
  "HOME_TOP",
  "HOME_MIDDLE",
  "HOME_BOTTOM",
  "CATEGORY_TOP",
  "PRODUCT_DETAIL",
] as const;

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [togglingBanner, setTogglingBanner] = useState<Banner | null>(null);
  const [keyword, setKeyword] = useState("");
  const [position, setPosition] = useState<PositionFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadBanners() {
    setLoading(true);

    try {
      const response = await bannerService.listBanners({
        keyword: keyword.trim() || undefined,
        position,
        status,
      });
      setBanners(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadBanners();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadBanners intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, position, status]);

  const visibleBanners = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return banners
      .filter((banner) => {
        const matchesPosition = position === "all" || banner.position === position;
        const matchesStatus = status === "all" || banner.status === status;
        const searchBlob = [banner.title, banner.position, banner.linkUrl].join(" ").toLowerCase();
        return matchesPosition && matchesStatus && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [banners, keyword, position, status]);

  async function handleSubmit(values: BannerFormValues) {
    setSubmitting(true);

    const payload: BannerFormPayload = {
      title: values.title,
      imageUrl: values.imageUrl,
      linkUrl: emptyToUndefined(values.linkUrl),
      position: values.position,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      sortOrder: values.sortOrder,
    };

    try {
      if (editingBanner) {
        await bannerService.updateBanner(getEntityId(editingBanner), payload);
        toast.success("Cap nhat banner thanh cong");
      } else {
        await bannerService.createBanner(payload);
        toast.success("Tao banner thanh cong");
      }

      setFormOpen(false);
      setEditingBanner(null);
      await loadBanners();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingBanner) return;

    try {
      await bannerService.deleteBanner(getEntityId(deletingBanner));
      toast.success("Da xoa banner");
      setDeletingBanner(null);
      await loadBanners();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleToggleStatus() {
    if (!togglingBanner) return;
    const nextStatus: BannerStatus = togglingBanner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await bannerService.updateBanner(getEntityId(togglingBanner), { status: nextStatus });
      toast.success(nextStatus === "ACTIVE" ? "Da bat banner" : "Da tat banner");
      setTogglingBanner(null);
      await loadBanners();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly banner hien thi theo vi tri, thoi gian hieu luc va thu tu sap xep."
        icon={Image}
        title="Quan ly banner"
        actions={
          <Button className="gap-2" onClick={() => { setEditingBanner(null); setFormOpen(true); }}>
            <Plus className="size-4" />
            Tao banner
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach banner</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(260px,360px)_170px_150px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 xl:col-span-1">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search title/link/position" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </div>
              <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" value={position} onChange={(event) => setPosition(event.target.value as PositionFilter)}>
                {POSITION_OPTIONS.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca position" : item}</option>)}
              </select>
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
            <Table className="min-w-[1080px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Banner</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Date range</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleBanners.length === 0 ? (
                  <TableRow><TableCell className="py-12 text-center text-muted-foreground" colSpan={7}>Khong tim thay banner phu hop.</TableCell></TableRow>
                ) : visibleBanners.map((banner) => (
                  <TableRow key={getEntityId(banner)}>
                    <TableCell className="w-[180px]">
                      <div className="flex aspect-[16/9] w-36 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        {banner.imageUrl ? (
                          <div aria-label={banner.title} className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                        ) : (
                          <ImageIcon className="size-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[260px]">
                      <p className="font-medium">{banner.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{banner.linkUrl || "Khong co link"}</p>
                    </TableCell>
                    <TableCell className="w-[170px] font-mono text-xs">{banner.position}</TableCell>
                    <TableCell className="w-[220px] text-sm text-muted-foreground">{formatDate(banner.startDate)} - {formatDate(banner.endDate)}</TableCell>
                    <TableCell className="w-[90px] font-mono">{banner.sortOrder}</TableCell>
                    <TableCell className="w-[130px]">
                      <button type="button" onClick={() => setTogglingBanner(banner)}>
                        <StatusBadge label={banner.status} variant={banner.status === "ACTIVE" ? "success" : "neutral"} />
                      </button>
                    </TableCell>
                    <TableCell className="w-[130px]">
                      <div className="flex justify-end gap-2">
                        <Button aria-label="Sua banner" size="icon" variant="outline" onClick={() => { setEditingBanner(banner); setFormOpen(true); }}><Edit className="size-4" /></Button>
                        <Button aria-label="Xoa banner" size="icon" variant="destructive" onClick={() => setDeletingBanner(banner)}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BannerFormModal
        initialValues={editingBanner}
        open={formOpen}
        submitting={submitting}
        title={editingBanner ? "Sua banner" : "Tao banner"}
        onClose={() => { setFormOpen(false); setEditingBanner(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa banner "${deletingBanner?.title ?? ""}"?`}
        open={Boolean(deletingBanner)}
        title="Xoa banner"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => { if (!open) setDeletingBanner(null); }}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${togglingBanner?.status === "ACTIVE" ? "tat" : "bat"} banner "${togglingBanner?.title ?? ""}"?`}
        open={Boolean(togglingBanner)}
        title="Cap nhat trang thai banner"
        confirmText="Xac nhan"
        onConfirm={handleToggleStatus}
        onOpenChange={(open) => { if (!open) setTogglingBanner(null); }}
      />
    </div>
  );
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
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
