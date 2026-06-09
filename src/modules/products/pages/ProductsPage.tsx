"use client";

import { Edit, Eye, ImageIcon, Loader2, Package, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Brand } from "@/modules/brands";
import type { Category } from "@/modules/categories";
import type { Product, ProductStatus } from "@/modules/products";
import { brandService } from "@/services/brand.service";
import { categoryService } from "@/services/category.service";
import { productService, type ProductListParams } from "@/services/product.service";

type StatusFilter = ProductStatus | "all";
type SortValue = NonNullable<ProductListParams["sort"]>;

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  async function loadData() {
    setLoading(true);

    try {
      const [productsResponse, categoryResponse, brandResponse] = await Promise.all([
        productService.listProducts({
          keyword: keyword || undefined,
          category: category === "all" ? undefined : category,
          brand: brand === "all" ? undefined : brand,
          status,
          sort,
          page,
          limit,
        }),
        categoryService.getCategoryTree(),
        brandService.listBrands(),
      ]);

      setProducts(productsResponse.data);
      setCategories(flattenCategories(categoryResponse.data));
      setBrands(brandResponse.data);
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
    // loadData intentionally reads the current filter state from this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, brand, status, sort, page]);

  const visibleProducts = useMemo(() => products, [products]);

  async function handleDelete() {
    if (!deletingProduct) {
      return;
    }

    try {
      await productService.deleteProduct(deletingProduct.id);
      toast.success("Da xoa san pham");
      setDeletingProduct(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly catalog san pham, filter nhanh theo danh muc, thuong hieu, trang thai va thu tu sap xep."
        icon={Package}
        title="Quan ly san pham"
        actions={
          <Button className="gap-2">
            <Link className="inline-flex items-center gap-2" href="/admin/products/create">
              <Plus className="size-4" />
              Tao san pham
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle>Danh sach san pham</CardTitle>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[260px_180px_180px_150px_170px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search keyword" value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} />
              </div>
              <Select value={category} onChange={(value) => { setCategory(value); setPage(1); }}>
                <option value="all">Tat ca danh muc</option>
                {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Select>
              <Select value={brand} onChange={(value) => { setBrand(value); setPage(1); }}>
                <option value="all">Tat ca brand</option>
                {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Select>
              <Select value={status} onChange={(value) => { setStatus(value as StatusFilter); setPage(1); }}>
                <option value="all">Tat ca status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </Select>
              <Select value={sort} onChange={(value) => setSort(value as SortValue)}>
                <option value="newest">Moi nhat</option>
                <option value="price_asc">Gia tang dan</option>
                <option value="price_desc">Gia giam dan</option>
                <option value="best_seller">Ban chay</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="grid min-h-80 place-items-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>San pham</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Danh muc</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={6}>Khong tim thay san pham phu hop.</TableCell>
                  </TableRow>
                ) : (
                  visibleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProductThumb product={product} />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{product.shortDescription || "Chua co mo ta ngan"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell>{getRefName(product.category)}</TableCell>
                      <TableCell>{getRefName(product.brand)}</TableCell>
                      <TableCell><StatusBadge label={product.status} variant={product.status === "active" ? "success" : product.status === "draft" ? "warning" : "neutral"} /></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline">
                            <Link aria-label="Xem san pham" href={`/admin/products/${product.id}`}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="outline">
                            <Link aria-label="Sua san pham" href={`/admin/products/${product.id}/edit`}>
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <Button aria-label="Xoa san pham" size="icon" variant="destructive" onClick={() => setDeletingProduct(product)}>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Trang {page}</p>
        <div className="flex gap-2">
          <Button disabled={page === 1} variant="outline" onClick={() => setPage((value) => Math.max(value - 1, 1))}>Truoc</Button>
          <Button disabled={products.length < limit} variant="outline" onClick={() => setPage((value) => value + 1)}>Sau</Button>
        </div>
      </div>

      <ConfirmDialog
        description={`Ban co chac muon xoa san pham "${deletingProduct?.name ?? ""}"?`}
        open={Boolean(deletingProduct)}
        title="Xoa san pham"
        confirmText="Xoa"
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
      />
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  );
}

function ProductThumb({ product }: { product: Product }) {
  const thumbnail = product.images?.find((image) => image.isThumbnail) ?? product.images?.[0];

  return (
    <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border bg-muted">
      {thumbnail?.imageUrl ? (
        <div aria-label={product.name} className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${thumbnail.imageUrl})` }} />
      ) : (
        <ImageIcon className="size-4 text-muted-foreground" />
      )}
    </div>
  );
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children ?? [])]);
}

function getRefName(value: Product["category"] | Product["brand"]) {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return value.name;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
