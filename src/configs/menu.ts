export type AdminMenuItem = {
  title: string;
  href: string;
  icon: string;
  module: string;
};

export const adminMenu: AdminMenuItem[] = [
  { title: "Tong quan", href: "/admin", icon: "LayoutDashboard", module: "dashboard" },
  { title: "Nguoi dung", href: "/admin/users", icon: "Users", module: "users" },
  { title: "Danh muc", href: "/admin/categories", icon: "Boxes", module: "categories" },
  { title: "Thuong hieu", href: "/admin/brands", icon: "BadgeCheck", module: "brands" },
  { title: "San pham", href: "/admin/products", icon: "Package", module: "products" },
  { title: "Cua hang", href: "/admin/stores", icon: "Store", module: "stores" },
  { title: "Ton kho", href: "/admin/inventories", icon: "Warehouse", module: "inventories" },
  { title: "Don hang", href: "/admin/orders", icon: "ReceiptText", module: "orders" },
  { title: "Thanh toan", href: "/admin/payments", icon: "CreditCard", module: "payments" },
  { title: "Khuyen mai", href: "/admin/promotions", icon: "Megaphone", module: "promotions" },
  { title: "Ma giam gia", href: "/admin/coupons", icon: "TicketPercent", module: "coupons" },
  { title: "Danh gia", href: "/admin/reviews", icon: "Star", module: "reviews" },
  { title: "Banner", href: "/admin/banners", icon: "Image", module: "banners" },
  { title: "Bai viet", href: "/admin/articles", icon: "Newspaper", module: "articles" },
  { title: "Cai dat", href: "/admin/settings", icon: "Settings", module: "settings" },
];

