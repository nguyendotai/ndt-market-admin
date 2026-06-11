"use client";

import { Edit, Eye, ImageIcon, Package, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, Pagination, StatusBadge, TableSkeleton } from "@/components/common";
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
  const [inStock, setInStock] = useState(false);
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
          inStock: inStock || undefined,
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
  }, [keyword, category, brand, status, sort, inStock, page]);

  const visibleProducts = useMemo(() => products, [products]);

  async function handleDelete() {
    if (!deletingProduct) {
      return;
    }

    try {
      await productService.deleteProduct(getEntityId(deletingProduct));
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

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4">
            <CardTitle className="whitespace-nowrap">Danh sach san pham</CardTitle>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(150px,1fr)_minmax(140px,0.9fr)_minmax(150px,0.9fr)_minmax(140px,0.85fr)_minmax(180px,1fr)_minmax(100px,0.65fr)_minmax(100px,0.7fr)]">
              <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-2 2xl:col-span-1">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none" placeholder="Search keyword" value={keyword} onChange={(event) => { setKeyword(event.target.value); setPage(1); }} />
              </div>
              <Select value={category} onChange={(value) => { setCategory(value); setPage(1); }}>
                <option value="all">Tat ca danh muc</option>
                {categories.map((item) => {
                  const itemId = getEntityId(item);
                  if (!itemId) return null;
                  return <option key={itemId} value={itemId}>{item.name}</option>;
                })}
              </Select>
              <Select value={brand} onChange={(value) => { setBrand(value); setPage(1); }}>
                <option value="all">Tat ca brand</option>
                {brands.map((item) => {
                  const itemId = getEntityId(item);
                  if (!itemId) return null;
                  return <option key={itemId} value={itemId}>{item.name}</option>;
                })}
              </Select>
              <Select value={status} onChange={(value) => { setStatus(value as StatusFilter); setPage(1); }}>
                <option value="all">Tat ca status</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </Select>
              <Select value={sort} onChange={(value) => setSort(value as SortValue)}>
                <option value="newest">Moi nhat</option>
                <option value="price_asc">Gia tang dan</option>
                <option value="price_desc">Gia giam dan</option>
                <option value="best_selling">Ban chay</option>
                <option value="rating">Danh gia cao</option>
              </Select>
              <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium">
                <input
                  checked={inStock}
                  className="size-4 accent-primary"
                  type="checkbox"
                  onChange={(event) => {
                    setInStock(event.target.checked);
                    setPage(1);
                  }}
                />
                <span className="whitespace-nowrap">Con hang</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton columns={7} rows={7} />
          ) : (
            <Table className="min-w-[1080px]">
              <TableHeader>
                <TableRow>
                  <TableHead>San pham</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Danh muc</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Ban/Danh gia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={7}>Khong tim thay san pham phu hop.</TableCell>
                  </TableRow>
                ) : (
                  visibleProducts.map((product) => {
                    const productId = getEntityId(product);
                    const productSlug = product.slug || productId;

                    return (
                    <TableRow key={productId}>
                      <TableCell className="w-[300px]">
                        <div className="flex items-center gap-3">
                          <ProductThumb product={product} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{product.name}</p>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[130px] font-mono text-xs">{product.sku || "-"}</TableCell>
                      <TableCell className="w-[210px]">{getRefName(product.category)}</TableCell>
                      <TableCell className="w-[160px]">{getRefName(product.brand)}</TableCell>
                      <TableCell className="w-[170px] whitespace-nowrap text-sm text-muted-foreground">
                        {product.soldCount ?? 0} da ban / {product.ratingAverage ?? 0} ({product.ratingCount ?? 0})
                      </TableCell>
                      <TableCell className="w-[130px]"><StatusBadge label={product.status} variant={product.status === "ACTIVE" ? "success" : product.status === "DRAFT" ? "warning" : "neutral"} /></TableCell>
                      <TableCell className="w-[150px]">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline">
                            <Link aria-label="Xem san pham" href={`/admin/products/${productSlug}`}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="outline">
                            <Link aria-label="Sua san pham" href={`/admin/products/${productSlug}/edit`}>
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <Button aria-label="Xoa san pham" size="icon" variant="destructive" onClick={() => setDeletingProduct(product)}>
                            <Trash2 className="size-4" />
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

      <Pagination
        hasNextPage={products.length >= limit}
        loading={loading}
        page={page}
        onPageChange={setPage}
      />

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

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Da co loi xay ra";
}
