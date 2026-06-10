import { normalizeBackendResponse } from "@/services/api-response";

export type DashboardMetric = {
  todayRevenue: number;
  todayOrders: number;
  totalCustomers: number;
  totalProducts: number;
};

export type DashboardOrder = {
  id: string;
  customerName: string;
  total: number;
  status: "PENDING" | "PREPARING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

export type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
};

export type RevenueChartPoint = {
  date: string;
  revenue: number;
};

export type OrderStatusChartPoint = {
  status: string;
  count: number;
};

export type DashboardOverview = {
  metrics: DashboardMetric;
  latestOrders: DashboardOrder[];
  lowStockProducts: LowStockProduct[];
  revenueLast7Days: RevenueChartPoint[];
  ordersByStatus: OrderStatusChartPoint[];
};

const mockDashboardOverview: DashboardOverview = {
  metrics: {
    todayRevenue: 128_500_000,
    todayOrders: 342,
    totalCustomers: 18_420,
    totalProducts: 6_842,
  },
  latestOrders: [
    { id: "NDT-10243", customerName: "Nguyen Minh Anh", total: 845_000, status: "PREPARING", createdAt: "2026-06-09 10:24" },
    { id: "NDT-10242", customerName: "Tran Quoc Viet", total: 326_000, status: "SHIPPING", createdAt: "2026-06-09 10:02" },
    { id: "NDT-10241", customerName: "Pham Thanh Ha", total: 1_240_000, status: "COMPLETED", createdAt: "2026-06-09 09:51" },
    { id: "NDT-10240", customerName: "Le Hoang Nam", total: 219_000, status: "PENDING", createdAt: "2026-06-09 09:38" },
    { id: "NDT-10239", customerName: "Do Nhu Quynh", total: 512_000, status: "CANCELLED", createdAt: "2026-06-09 09:21" },
  ],
  lowStockProducts: [
    { id: "P-1001", name: "Sua tuoi Vinamilk 1L", sku: "MILK-VNM-1L", stock: 8, threshold: 20 },
    { id: "P-1002", name: "Trung ga ta hop 10 qua", sku: "EGG-TA-10", stock: 12, threshold: 30 },
    { id: "P-1003", name: "Rau cai ngot 500g", sku: "VEG-CAI-500", stock: 15, threshold: 25 },
    { id: "P-1004", name: "Thit ba roi CP 500g", sku: "PORK-CP-500", stock: 6, threshold: 18 },
  ],
  revenueLast7Days: [
    { date: "03/06", revenue: 86_000_000 },
    { date: "04/06", revenue: 91_500_000 },
    { date: "05/06", revenue: 104_200_000 },
    { date: "06/06", revenue: 98_800_000 },
    { date: "07/06", revenue: 116_400_000 },
    { date: "08/06", revenue: 121_700_000 },
    { date: "09/06", revenue: 128_500_000 },
  ],
  ordersByStatus: [
    { status: "Moi tao", count: 46 },
    { status: "Dang soan", count: 82 },
    { status: "Dang giao", count: 67 },
    { status: "Hoan tat", count: 139 },
    { status: "Da huy", count: 8 },
  ],
};

export const dashboardService = {
  async getOverview() {
    // TODO: Replace mock data with real API when backend exposes dashboard statistics.
    // Suggested endpoint: GET /dashboard/overview returning { success, message, data, meta }.
    return normalizeBackendResponse<DashboardOverview>({
      success: true,
      message: "Mock dashboard overview",
      data: mockDashboardOverview,
    }).data;
  },
};
