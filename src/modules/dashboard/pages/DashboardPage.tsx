import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  Download,
  LayoutDashboard,
  PackageCheck,
  Plus,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";

import { DataTable, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Doanh thu hom nay",
    value: "128.5 tr",
    delta: "+12.4%",
    trend: "up",
    icon: Wallet,
  },
  {
    label: "Don hang moi",
    value: "342",
    delta: "+8.2%",
    trend: "up",
    icon: ReceiptText,
  },
  {
    label: "Khach hang",
    value: "18,420",
    delta: "+3.1%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Can bo sung kho",
    value: "27",
    delta: "-4 SKU",
    trend: "down",
    icon: CircleAlert,
  },
];

const orders: OrderRow[] = [
  { id: "NDT-10243", customer: "Nguyen Minh Anh", total: "845,000 d", status: "packing" },
  { id: "NDT-10242", customer: "Tran Quoc Viet", total: "326,000 d", status: "shipping" },
  { id: "NDT-10241", customer: "Pham Thanh Ha", total: "1,240,000 d", status: "paid" },
  { id: "NDT-10240", customer: "Le Hoang Nam", total: "219,000 d", status: "pending" },
];

const lowStock = [
  { name: "Sua tuoi Vinamilk 1L", stock: 8 },
  { name: "Trung ga ta hop 10 qua", stock: 12 },
  { name: "Rau cai ngot 500g", stock: 15 },
];

type OrderRow = {
  id: string;
  customer: string;
  total: string;
  status: "packing" | "shipping" | "paid" | "pending";
};

const orderStatusMap = {
  packing: { label: "Dang soan hang", variant: "warning" },
  shipping: { label: "Cho giao", variant: "info" },
  paid: { label: "Da thanh toan", variant: "success" },
  pending: { label: "Moi tao", variant: "neutral" },
} as const;

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Theo doi doanh thu, don hang, khach hang va ton kho theo thoi gian thuc."
        icon={LayoutDashboard}
        title="Bang dieu khien sieu thi online"
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
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="size-3.5 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-amber-600" />
                )}
                {stat.delta}
              </span>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DataTable<OrderRow>
          columns={[
            { key: "id", header: "Ma don", cell: (row) => <span className="font-medium">{row.id}</span> },
            { key: "customer", header: "Khach hang" },
            { key: "total", header: "Tong tien", cell: (row) => <span className="font-medium">{row.total}</span> },
            {
              key: "status",
              header: "Trang thai",
              cell: (row) => {
                const status = orderStatusMap[row.status];
                return <StatusBadge label={status.label} variant={status.variant} />;
              },
            },
          ]}
          data={orders}
          emptyTitle="Chua co don hang"
          getRowKey={(row) => row.id}
        />

        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-amber-500/15 text-amber-600">
              <PackageCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Can nhap them</h2>
              <p className="text-sm text-muted-foreground">Uu tien trong hom nay</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {lowStock.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-md border p-3">
                <p className="text-sm font-medium">{item.name}</p>
                <span className="text-sm text-muted-foreground">{item.stock} con</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DataTable<OrderRow>
          columns={[
            { key: "id", header: "Ma don" },
            { key: "customer", header: "Khach hang" },
          ]}
          data={[]}
          getRowKey={(row) => row.id}
          loading
        />
        <DataTable<OrderRow>
          columns={[
            { key: "id", header: "Ma don" },
            { key: "customer", header: "Khach hang" },
          ]}
          data={[]}
          emptyTitle="Chua co khuyen mai"
          emptyDescription="Tao chuong trinh khuyen mai de hien thi tai day."
          getRowKey={(row) => row.id}
        />
        <DataTable<OrderRow>
          columns={[
            { key: "id", header: "Ma don" },
            { key: "customer", header: "Khach hang" },
          ]}
          data={[]}
          error="May chu dang ban, vui long thu lai sau vai giay."
          getRowKey={(row) => row.id}
        />
      </section>
    </div>
  );
}
