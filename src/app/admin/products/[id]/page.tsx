import { ProductDetailPage } from "@/modules/products/pages/ProductDetailPage";

type AdminProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;
  return <ProductDetailPage productId={id} />;
}

