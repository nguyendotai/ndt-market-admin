"use client";

import { BadgeCheck, Edit, ImageIcon, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BrandFormModal } from "@/modules/brands/components/BrandFormModal";
import type { Brand, BrandFormPayload, BrandFormValues } from "@/modules/brands";
import { brandService } from "@/services/brand.service";

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [togglingBrand, setTogglingBrand] = useState<Brand | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadBrands() {
    setLoading(true);

    try {
      const response = await brandService.listBrands();
      setBrands(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadBrands();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const visibleBrands = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(keyword) ||
        brand.slug.toLowerCase().includes(keyword) ||
        (brand.description ?? "").toLowerCase().includes(keyword),
    );
  }, [brands, search]);

  async function handleSubmit(values: BrandFormValues) {
    setSubmitting(true);

    const payload: BrandFormPayload = {
      name: values.name,
      slug: values.slug,
      logo: values.logo || null,
      description: values.description || null,
      isActive: values.isActive,
    };

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, payload);
        toast.success("Cap nhat thuong hieu thanh cong");
      } else {
        await brandService.createBrand(payload);
        toast.success("Tao thuong hieu thanh cong");
      }

      setFormOpen(false);
      setEditingBrand(null);
      await loadBrands();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingBrand) {
      return;
    }

    try {
      await brandService.deleteBrand(deletingBrand.id);
      toast.success("Da xoa thuong hieu");
      setDeletingBrand(null);
      await loadBrands();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleToggleActive() {
    if (!togglingBrand) return;

    try {
      await brandService.updateBrand(togglingBrand.id, {
        isActive: !togglingBrand.isActive,
      });
      toast.success(togglingBrand.isActive ? "Da tat thuong hieu" : "Da bat thuong hieu");
      setTogglingBrand(null);
      await loadBrands();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly thuong hieu, logo, slug, mo ta va trang thai hien thi public."
        icon={BadgeCheck}
        title="Quan ly thuong hieu"
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setEditingBrand(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Tao thuong hieu
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Danh sach brand</CardTitle>
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
              <Search className="size-4" />
              <input
                className="w-full bg-transparent outline-none sm:w-72"
                placeholder="Search theo ten, slug, mo ta"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="mb-3 size-6 animate-spin text-primary" />
                <p className="font-medium">Dang tai thuong hieu</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thuong hieu</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Mo ta</TableHead>
                  <TableHead>Trang thai</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleBrands.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={5}>
                      Khong tim thay thuong hieu phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleBrands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                            {brand.logo ? (
                              <div
                                aria-label={brand.name}
                                className="h-full w-full bg-contain bg-center bg-no-repeat"
                                role="img"
                                style={{ backgroundImage: `url(${brand.logo})` }}
                              />
                            ) : (
                              <ImageIcon className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="font-medium">{brand.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{brand.slug}</TableCell>
                      <TableCell className="max-w-md text-muted-foreground">
                        <p className="line-clamp-2">{brand.description || "Chua co mo ta"}</p>
                      </TableCell>
                      <TableCell>
                        <button type="button" onClick={() => setTogglingBrand(brand)}>
                          <StatusBadge
                            label={brand.isActive ? "Active" : "Inactive"}
                            variant={brand.isActive ? "success" : "neutral"}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            aria-label="Sua thuong hieu"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setEditingBrand(brand);
                              setFormOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            aria-label="Xoa thuong hieu"
                            size="icon"
                            variant="destructive"
                            onClick={() => setDeletingBrand(brand)}
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

      <BrandFormModal
        initialValues={editingBrand}
        open={formOpen}
        submitting={submitting}
        title={editingBrand ? "Sua brand" : "Tao brand"}
        onClose={() => {
          setFormOpen(false);
          setEditingBrand(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        description={`Ban co chac muon xoa thuong hieu "${deletingBrand?.name ?? ""}"? Hanh dong nay khong the hoan tac.`}
        open={Boolean(deletingBrand)}
        title="Xoa thuong hieu"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingBrand(null);
          }
        }}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${togglingBrand?.isActive ? "tat" : "bat"} thuong hieu "${togglingBrand?.name ?? ""}"?`}
        open={Boolean(togglingBrand)}
        title="Cap nhat trang thai thuong hieu"
        confirmText="Xac nhan"
        onConfirm={handleToggleActive}
        onOpenChange={(open) => {
          if (!open) setTogglingBrand(null);
        }}
      />
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
