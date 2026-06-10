import { ProductDetailPage } from "@/modules/products/pages/ProductDetailPage";

type AdminProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailPage productSlug={slug} />;
}
