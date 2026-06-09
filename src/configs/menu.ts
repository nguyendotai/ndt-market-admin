export type AdminMenuItem = {
  title: string;
  href: string;
  icon: string;
  module: string;
};

export const adminMenu: AdminMenuItem[] = [
  { title: "Tổng quann", href: "/admin/dashboard", icon: "LayoutDashboard", module: "dashboard" },
  { title: "Người dùng", href: "/admin/users", icon: "Users", module: "users" },
  { title: "Danh mục", href: "/admin/categories", icon: "Boxes", module: "categories" },
  { title: "Thương hiệu", href: "/admin/brands", icon: "BadgeCheck", module: "brands" },
  { title: "Sản phẩm", href: "/admin/products", icon: "Package", module: "products" },
  { title: "Cửa hàng", href: "/admin/stores", icon: "Store", module: "stores" },
  { title: "Tồn kho", href: "/admin/inventories", icon: "Warehouse", module: "inventories" },
  { title: "Đơn hàng", href: "/admin/orders", icon: "ReceiptText", module: "orders" },
  { title: "Thanh toán", href: "/admin/payments", icon: "CreditCard", module: "payments" },
  { title: "Khuyến mãi", href: "/admin/promotions", icon: "Megaphone", module: "promotions" },
  { title: "Mã giảm giá", href: "/admin/coupons", icon: "TicketPercent", module: "coupons" },
  { title: "Đánh giá", href: "/admin/reviews", icon: "Star", module: "reviews" },
  { title: "Banner", href: "/admin/banners", icon: "Image", module: "banners" },
  { title: "Bài viết", href: "/admin/articles", icon: "Newspaper", module: "articles" },
  { title: "Cài đặt", href: "/admin/settings", icon: "Settings", module: "settings" },
];
