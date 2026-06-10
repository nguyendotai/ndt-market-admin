"use client";

import { ArrowLeft, Loader2, PackageCheck, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";
import type { Order, OrderItem, OrderStatusHistory } from "@/modules/orders";
import { orderService } from "@/services/order.service";

type OrderDetailPageProps = {
  orderId: string;
};

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);

  async function loadOrder() {
    setLoading(true);

    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      setStatus(response.data.status);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOrder();
    }, 0);

    return () => window.clearTimeout(timer);
    // loadOrder intentionally runs when orderId changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const timeline = useMemo(() => order?.statusHistory ?? order?.timeline ?? [], [order]);

  async function handleUpdateStatus() {
    if (!order) return;

    setSubmitting(true);

    try {
      const response = await orderService.updateOrderStatus(getEntityId(order), status);
      setOrder(response.data);
      setStatus(response.data.status);
      setConfirmStatusOpen(false);
      toast.success("Cap nhat trang thai don hang thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-96 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="rounded-lg border p-8 text-center text-muted-foreground">Khong tim thay don hang.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Chi tiet don hang ${order.orderCode}`}
        icon={PackageCheck}
        title={order.orderCode}
        actions={
          <Button variant="outline">
            <Link className="inline-flex items-center gap-2" href="/admin/orders">
              <ArrowLeft className="size-4" />
              Quay lai
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Cap nhat trang thai</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
            <StatusBadge label={order.deliveryType ?? "-"} variant="neutral" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
              value={status}
              onChange={(event) => setStatus(event.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <Button disabled={submitting || status === order.status} onClick={() => setConfirmStatusOpen(true)}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Luu trang thai
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="Thong tin khach hang">
          <Info label="Ten khach hang" value={getCustomerName(order)} />
          <Info label="So dien thoai" value={getCustomerPhone(order)} />
          <Info label="Email" value={getCustomerEmail(order)} />
        </InfoCard>

        <InfoCard title="Dia chi giao hang">
          <Info label="Nguoi nhan" value={order.shippingAddress?.fullName ?? getCustomerName(order)} />
          <Info label="Dien thoai" value={order.shippingAddress?.phone ?? getCustomerPhone(order)} />
          <Info label="Dia chi" value={getShippingAddress(order)} />
        </InfoCard>

        <InfoCard title="Tong tien">
          <Info label="Tam tinh" value={formatCurrency(order.subtotal ?? getItemsTotal(order.items ?? []))} />
          <Info label="Phi ship" value={formatCurrency(order.shippingFee ?? 0)} />
          <Info label="Giam gia" value={formatCurrency(order.discountAmount ?? 0)} />
          <Info label="Tong thanh toan" value={formatCurrency(getOrderTotal(order))} strong />
        </InfoCard>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">San pham trong don</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow>
                <TableHead>San pham</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>SKU/Barcode</TableHead>
                <TableHead>So luong</TableHead>
                <TableHead>Don gia</TableHead>
                <TableHead>Thanh tien</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(order.items ?? []).length === 0 ? (
                <TableRow>
                  <TableCell className="py-12 text-center text-muted-foreground" colSpan={6}>Don hang chua co san pham.</TableCell>
                </TableRow>
              ) : (
                order.items?.map((item) => (
                  <TableRow key={getItemKey(item)}>
                    <TableCell className="font-medium">{getItemProductName(item)}</TableCell>
                    <TableCell>{getItemVariantName(item)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{getItemSku(item)} / {getItemBarcode(item)}</TableCell>
                    <TableCell className="font-mono">{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.salePrice ?? item.price)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(getItemTotal(item))}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Payment info">
          <Info label="Trang thai" value={order.payment?.status ?? order.paymentStatus} />
          <Info label="Phuong thuc" value={order.payment?.method ?? "-"} />
          <Info label="Provider" value={order.payment?.provider ?? "-"} />
          <Info label="Transaction ID" value={order.payment?.transactionId ?? "-"} />
          <Info label="Paid at" value={formatDate(order.payment?.paidAt)} />
        </InfoCard>

        <InfoCard title="Shipment info">
          <Info label="Delivery type" value={order.shipment?.deliveryType ?? order.deliveryType ?? "-"} />
          <Info label="Carrier" value={order.shipment?.carrier ?? "-"} />
          <Info label="Tracking code" value={order.shipment?.trackingCode ?? "-"} />
          <Info label="Shipped at" value={formatDate(order.shipment?.shippedAt)} />
          <Info label="Delivered at" value={formatDate(order.shipment?.deliveredAt)} />
          <Info label="Note" value={order.shipment?.note ?? "-"} />
        </InfoCard>
      </section>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Timeline lich su trang thai</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {timeline.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Chua co timeline trang thai tu backend.
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={getTimelineKey(item)} className="grid gap-2 border-l-2 border-primary/40 pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={item.status} />
                    <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="text-sm">{item.note || "Cap nhat trang thai don hang"}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        description={`Ban co chac muon cap nhat don "${order.orderCode}" tu ${order.status} sang ${status}?`}
        open={confirmStatusOpen}
        title="Cap nhat trang thai don hang"
        confirmText="Cap nhat"
        onConfirm={handleUpdateStatus}
        onOpenChange={(open) => {
          if (!open && !submitting) setConfirmStatusOpen(false);
        }}
      />
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-5">{children}</CardContent>
    </Card>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={strong ? "text-base font-semibold" : "text-sm font-medium"}>{value}</p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant = status === "COMPLETED" ? "success" : status === "CANCELLED" || status === "REFUNDED" ? "danger" : status === "PENDING" ? "warning" : "info";
  return <StatusBadge label={status} variant={variant} />;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const variant = status === "PAID" ? "success" : status === "FAILED" || status === "CANCELLED" ? "danger" : status === "REFUNDED" ? "info" : "warning";
  return <StatusBadge label={status} variant={variant} />;
}

function getCustomerName(order: Order) {
  if (order.customer && typeof order.customer !== "string") return order.customer.fullName ?? order.customer.name ?? order.customerName ?? "-";
  return order.customerName ?? "-";
}

function getCustomerPhone(order: Order) {
  if (order.customer && typeof order.customer !== "string") return order.customer.phone ?? order.phone ?? "-";
  return order.phone ?? "-";
}

function getCustomerEmail(order: Order) {
  if (order.customer && typeof order.customer !== "string") return order.customer.email ?? order.email ?? "-";
  return order.email ?? "-";
}

function getShippingAddress(order: Order) {
  const address = order.shippingAddress;
  if (!address) return "-";
  return [address.address, address.ward, address.district, address.province].filter(Boolean).join(", ");
}

function getItemProductName(item: OrderItem) {
  if (item.product && typeof item.product !== "string") return item.product.name;
  return item.productName ?? "-";
}

function getItemVariantName(item: OrderItem) {
  if (item.variant && typeof item.variant !== "string") return item.variant.name;
  return item.variantName ?? "-";
}

function getItemSku(item: OrderItem) {
  if (item.product && typeof item.product !== "string") return item.product.sku ?? "-";
  return item.sku ?? "-";
}

function getItemBarcode(item: OrderItem) {
  if (item.variant && typeof item.variant !== "string") return item.variant.barcode ?? "-";
  return item.barcode ?? "-";
}

function getItemTotal(item: OrderItem) {
  return item.lineTotal ?? item.total ?? (item.salePrice ?? item.price) * item.quantity;
}

function getItemsTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
}

function getOrderTotal(order: Order) {
  return order.totalAmount ?? order.total ?? 0;
}

function getItemKey(item: OrderItem) {
  return item.id ?? item._id ?? `${getItemProductName(item)}-${getItemVariantName(item)}`;
}

function getTimelineKey(item: OrderStatusHistory) {
  return item.id ?? item._id ?? `${item.status}-${item.createdAt ?? ""}`;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
