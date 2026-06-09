"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  OrderStatusChartPoint,
  RevenueChartPoint,
} from "@/services/dashboard.service";

type DashboardChartsProps = {
  revenueData: RevenueChartPoint[];
  statusData: OrderStatusChartPoint[];
};

export function DashboardCharts({ revenueData, statusData }: DashboardChartsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Doanh thu 7 ngay</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tong doanh thu theo ngay gan nhat.</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={revenueData} margin={{ left: 0, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="date" tickLine={false} />
              <YAxis
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}tr`}
                tickLine={false}
                width={44}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Doanh thu"]}
                labelClassName="text-foreground"
              />
              <Area
                dataKey="revenue"
                fill="url(#revenueGradient)"
                stroke="var(--primary)"
                strokeWidth={2.5}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Don hang theo trang thai</h2>
          <p className="mt-1 text-sm text-muted-foreground">Phan bo trang thai don hang hom nay.</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={statusData} layout="vertical" margin={{ left: 8, right: 12 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} />
              <XAxis axisLine={false} tickLine={false} type="number" />
              <YAxis
                axisLine={false}
                dataKey="status"
                tickLine={false}
                type="category"
                width={80}
              />
              <Tooltip formatter={(value) => [Number(value ?? 0), "Don hang"]} />
              <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
