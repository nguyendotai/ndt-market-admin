import { OrderDetailPage } from "@/modules/orders/pages/OrderDetailPage";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
