"use client";

import { ArrowLeft, Edit, ImageIcon, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/modules/products";
import { productService } from "@/services/product.service";

type ProductDetailPageProps = {
  productSlug: string;
};

export function ProductDetailPage({ productSlug }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await productService.getProductBySlug(productSlug);
        setProduct(response.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [productSlug]);

  if (loading) {
    return <div className="grid min-h-96 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return <div className="rounded-lg border p-8 text-center text-muted-foreground">Khong tim thay san pham.</div>;
  }

  const productEditSlug = product.slug || productSlug;

  return (
    <div className="space-y-6">
      <PageHeader
        description={product.shortDescription ?? "Chi tiet san pham"}
        icon={Package}
        title={product.name}
        actions={
          <>
            <Button variant="outline"><Link className="inline-flex items-center gap-2" href="/admin/products"><ArrowLeft className="size-4" />Quay lai</Link></Button>
            <Button><Link className="inline-flex items-center gap-2" href={`/admin/products/${productEditSlug}/edit`}><Edit className="size-4" />Sua</Link></Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Anh san pham va thumbnail.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(product.images ?? []).length === 0 ? (
              <div className="grid h-64 place-items-center rounded-lg border bg-muted"><ImageIcon className="size-8 text-muted-foreground" /></div>
            ) : (
              product.images?.map((image) => (
                <div key={getEntityId(image)} className="overflow-hidden rounded-lg border">
                  <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${image.imageUrl})` }} />
                  <div className="p-3">
                    <StatusBadge label={image.isThumbnail ? "Thumbnail" : `Sort ${image.sortOrder}`} variant={image.isThumbnail ? "success" : "neutral"} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thong tin san pham</CardTitle>
            <CardDescription>SKU, status, origin, tags va noi dung.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Info label="SKU" value={product.sku || "-"} />
            <Info label="Slug" value={product.slug} />
            <Info label="Status" value={product.status} />
            <Info label="Danh muc" value={getRefName(product.category)} />
            <Info label="Thuong hieu" value={getRefName(product.brand)} />
            <Info label="Don vi" value={product.unit ?? "-"} />
            <Info label="Xuat xu" value={product.origin ?? "-"} />
            <Info label="Tags" value={(product.tags ?? []).join(", ") || "-"} />
            <Info label="Da ban" value={String(product.soldCount ?? 0)} />
            <Info label="Danh gia" value={`${product.ratingAverage ?? 0} (${product.ratingCount ?? 0} luot)`} />
            <Info label="Mo ta" value={product.description ?? "-"} />
            <Info label="Thanh phan" value={product.ingredients ?? "-"} />
            <Info label="Bao quan" value={product.storageInstruction ?? "-"} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader><CardTitle>Variants</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Anh</TableHead><TableHead>Ten</TableHead><TableHead>Barcode</TableHead><TableHead>Gia</TableHead><TableHead>Sale</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {(product.variants ?? []).map((variant) => (
                <TableRow key={getEntityId(variant)}>
                  <TableCell>
                    <div className="flex size-11 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                      {variant.imageUrl ? (
                        <div aria-label={variant.name} className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${variant.imageUrl})` }} />
                      ) : (
                        <ImageIcon className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell className="font-mono text-xs">{variant.barcode || "-"}</TableCell>
                  <TableCell>{formatCurrency(variant.price)}</TableCell>
                  <TableCell>{variant.salePrice ? formatCurrency(variant.salePrice) : "-"}</TableCell>
                  <TableCell><StatusBadge label={variant.status} variant={getVariantStatusBadgeVariant(variant.status)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div>;
}

function getRefName(value: Product["category"] | Product["brand"]) {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return value.name;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function getVariantStatusBadgeVariant(status: NonNullable<Product["variants"]>[number]["status"]) {
  if (status === "ACTIVE") return "success";
  if (status === "OUT_OF_STOCK") return "warning";
  return "neutral";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
