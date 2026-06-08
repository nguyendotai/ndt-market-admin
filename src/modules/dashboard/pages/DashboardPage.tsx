import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  PackageCheck,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";

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

const orders = [
  { id: "NDT-10243", customer: "Nguyen Minh Anh", total: "845,000", status: "Dang soan hang" },
  { id: "NDT-10242", customer: "Tran Quoc Viet", total: "326,000", status: "Cho giao" },
  { id: "NDT-10241", customer: "Pham Thanh Ha", total: "1,240,000", status: "Da thanh toan" },
  { id: "NDT-10240", customer: "Le Hoang Nam", total: "219,000", status: "Moi tao" },
];

const lowStock = [
  { name: "Sua tuoi Vinamilk 1L", stock: 8 },
  { name: "Trung ga ta hop 10 qua", stock: 12 },
  { name: "Rau cai ngot 500g", stock: 15 },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Xin chao, Admin</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Bang dieu khien sieu thi online
        </h1>
      </section>

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
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-base font-semibold">Don hang gan day</h2>
          </div>
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="grid gap-3 p-5 sm:grid-cols-[120px_1fr_120px_140px] sm:items-center">
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-sm font-medium">{order.total} d</p>
                <span className="w-fit rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  );
}

