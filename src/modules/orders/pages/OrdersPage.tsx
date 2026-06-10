"use client";

import { Eye, PackageCheck, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Pagination, StatusBadge, TableSkeleton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";
import type { DeliveryType, Order } from "@/modules/orders";
import { orderService } from "@/services/order.service";
import type { ApiMeta } from "@/services/api-response";

const ORDER_STATUSES: Array<OrderStatus | "all"> = [
  "all",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const PAYMENT_STATUSES: Array<PaymentStatus | "all"> = [
  "all",
  "PENDING",
  "UNPAID",
  "PAID",
  "REFUNDED",
  "FAILED",
  "CANCELLED",
];

const DELIVERY_TYPES: Array<DeliveryType | "all"> = ["all", "DELIVERY", "PICKUP", "EXPRESS", "STANDARD"];

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<ApiMeta | undefined>();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [deliveryType, setDeliveryType] = useState<DeliveryType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  async function loadOrders() {
    setLoading(true);

    try {
      const response = await orderService.listOrders({
        keyword: keyword.trim() || undefined,
        status,
        paymentStatus,
        deliveryType,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit,
      });
      setOrders(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOrders();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadOrders intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status, paymentStatus, deliveryType, dateFrom, dateTo, page]);

  const visibleOrders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const searchBlob = [order.orderCode, getCustomerName(order), getCustomerPhone(order)]
        .join(" ")
        .toLowerCase();

      return !normalizedKeyword || searchBlob.includes(normalizedKeyword);
    });
  }, [orders, keyword]);

  const totalPages = Number(meta?.totalPages ?? 0);
  const hasNextPage = totalPages ? page < totalPages : orders.length >= limit;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Theo doi don hang, loc theo trang thai, thanh toan, hinh thuc giao va khoang ngay."
        icon={PackageCheck}
        title="Quan ly don hang"
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4">
            <CardTitle className="whitespace-nowrap">Danh sach don hang</CardTitle>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[minmax(240px,1.4fr)_minmax(150px,0.9fr)_minmax(160px,0.9fr)_minmax(150px,0.9fr)_minmax(140px,0.8fr)_minmax(140px,0.8fr)]">
              <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-2 2xl:col-span-1">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Order code, phone, customer"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={status} onChange={(value) => { setStatus(value as OrderStatus | "all"); setPage(1); }}>
                {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca status" : item}</option>)}
              </Select>
              <Select value={paymentStatus} onChange={(value) => { setPaymentStatus(value as PaymentStatus | "all"); setPage(1); }}>
                {PAYMENT_STATUSES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca payment" : item}</option>)}
              </Select>
              <Select value={deliveryType} onChange={(value) => { setDeliveryType(value); setPage(1); }}>
                {DELIVERY_TYPES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca delivery" : item}</option>)}
              </Select>
              <input
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
              />
              <input
                className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton columns={8} rows={7} />
          ) : (
            <Table className="min-w-[1080px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Don hang</TableHead>
                  <TableHead>Khach hang</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Tong tien</TableHead>
                  <TableHead>Ngay tao</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={8}>
                      Khong tim thay don hang phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleOrders.map((order) => (
                    <TableRow key={getEntityId(order)}>
                      <TableCell className="w-[180px]">
                        <p className="font-mono text-sm font-semibold">{order.orderCode}</p>
                        <p className="mt-1 text-xs text-muted-foreground">#{getEntityId(order)}</p>
                      </TableCell>
                      <TableCell className="w-[230px]">
                        <p className="font-medium">{getCustomerName(order)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{getCustomerPhone(order)}</p>
                      </TableCell>
                      <TableCell className="w-[130px]">{order.deliveryType ?? "-"}</TableCell>
                      <TableCell className="w-[150px]"><OrderStatusBadge status={order.status} /></TableCell>
                      <TableCell className="w-[150px]"><PaymentStatusBadge status={order.paymentStatus} /></TableCell>
                      <TableCell className="w-[150px] font-semibold">{formatCurrency(getOrderTotal(order))}</TableCell>
                      <TableCell className="w-[150px] text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="w-[110px]">
                        <div className="flex justify-end">
                          <Button size="icon" variant="outline">
                            <Link aria-label="Xem don hang" href={`/admin/orders/${getEntityId(order)}`}>
                              <Eye className="size-4" />
                            </Link>
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

      <Pagination
        hasNextPage={hasNextPage}
        loading={loading}
        page={page}
        totalPages={totalPages || undefined}
        onPageChange={setPage}
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

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant = status === "COMPLETED" ? "success" : status === "CANCELLED" || status === "REFUNDED" ? "danger" : status === "PENDING" ? "warning" : "info";
  return <StatusBadge label={status} variant={variant} />;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const variant = status === "PAID" ? "success" : status === "FAILED" || status === "CANCELLED" ? "danger" : status === "REFUNDED" ? "info" : "warning";
  return <StatusBadge label={status} variant={variant} />;
}

function getCustomerName(order: Order) {
  if (order.customer && typeof order.customer !== "string") {
    return order.customer.fullName ?? order.customer.name ?? order.customerName ?? "-";
  }

  return order.customerName ?? "-";
}

function getCustomerPhone(order: Order) {
  if (order.customer && typeof order.customer !== "string") {
    return order.customer.phone ?? order.phone ?? "-";
  }

  return order.phone ?? "-";
}

function getOrderTotal(order: Order) {
  return order.totalAmount ?? order.total ?? 0;
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
