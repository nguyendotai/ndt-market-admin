import { ProductFormPage } from "@/modules/products/pages/ProductFormPage";

type AdminProductEditPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { slug } = await params;
  return <ProductFormPage productSlug={slug} />;
}
