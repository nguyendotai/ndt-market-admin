import { ProductFormPage } from "@/modules/products/pages/ProductFormPage";

type AdminProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  return <ProductFormPage productId={id} />;
}

