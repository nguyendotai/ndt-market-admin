import {
  Boxes,
  Download,
  LayoutDashboard,
  Package,
  Plus,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";

import { PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardCharts } from "@/modules/dashboard/components/DashboardCharts";
import { dashboardService, type DashboardOrder } from "@/services/dashboard.service";

const orderStatusMap = {
  PENDING: { label: "Moi tao", variant: "neutral" },
  PREPARING: { label: "Dang soan", variant: "warning" },
  SHIPPING: { label: "Dang giao", variant: "info" },
  COMPLETED: { label: "Hoan tat", variant: "success" },
  CANCELLED: { label: "Da huy", variant: "danger" },
} as const;

export async function DashboardPage() {
  const overview = await dashboardService.getOverview();

  const metrics = [
    {
      label: "Tong doanh thu hom nay",
      value: formatCurrency(overview.metrics.todayRevenue),
      helper: "Cap nhat theo don hoan tat",
      icon: Wallet,
    },
    {
      label: "Tong don hang hom nay",
      value: formatNumber(overview.metrics.todayOrders),
      helper: "Tat ca trang thai",
      icon: ReceiptText,
    },
    {
      label: "Tong khach hang",
      value: formatNumber(overview.metrics.totalCustomers),
      helper: "Tai khoan dang ky",
      icon: Users,
    },
    {
      label: "Tong san pham",
      value: formatNumber(overview.metrics.totalProducts),
      helper: "SKU dang quan ly",
      icon: Boxes,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        description="Theo doi doanh thu, don hang, khach hang, san pham va ton kho cua sieu thi online."
        icon={LayoutDashboard}
        title="Dashboard Overview"
        actions={
          <>
            <Button className="gap-2" variant="outline">
              <Download className="size-4" />
              Xuat bao cao
            </Button>
            <Button className="gap-2">
              <Plus className="size-4" />
              Tao don hang
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <metric.icon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardCharts
        revenueData={overview.revenueLast7Days}
        statusData={overview.ordersByStatus}
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Don hang moi nhat</CardTitle>
            <CardDescription>Nhung don hang vua duoc tao hoac cap nhat gan day.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ma don</TableHead>
                  <TableHead>Khach hang</TableHead>
                  <TableHead>Tong tien</TableHead>
                  <TableHead>Trang thai</TableHead>
                  <TableHead>Thoi gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge order={order} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                <Package className="size-5" />
              </div>
              <div>
                <CardTitle>San pham sap het hang</CardTitle>
                <CardDescription>Can uu tien nhap kho trong hom nay.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.lowStockProducts.map((product) => (
              <div key={product.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  <StatusBadge label={`${product.stock} con`} variant="warning" />
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${Math.min((product.stock / product.threshold) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function OrderStatusBadge({ order }: { order: DashboardOrder }) {
  const status = orderStatusMap[order.status];
  return <StatusBadge label={status.label} variant={status.variant} />;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}
