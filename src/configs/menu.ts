import type { UserRole } from "@/modules/users";

export type AdminMenuItem = {
  title: string;
  href: string;
  icon: string;
  module: string;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
};

export const adminMenu: AdminMenuItem[] = [
  { title: "Tong quan", href: "/admin/dashboard", icon: "LayoutDashboard", module: "dashboard" },
  { title: "Nguoi dung", href: "/admin/users", icon: "Users", module: "users", requiredPermissions: ["user.view"] },
  { title: "Danh muc", href: "/admin/categories", icon: "Boxes", module: "categories", requiredPermissions: ["category.view"] },
  { title: "Thuong hieu", href: "/admin/brands", icon: "BadgeCheck", module: "brands", requiredPermissions: ["brand.view"] },
  { title: "San pham", href: "/admin/products", icon: "Package", module: "products", requiredPermissions: ["product.view"] },
  { title: "Cua hang", href: "/admin/stores", icon: "Store", module: "stores", requiredPermissions: ["store.view"] },
  { title: "Ton kho", href: "/admin/inventories", icon: "Warehouse", module: "inventories", requiredPermissions: ["inventory.view"] },
  { title: "Don hang", href: "/admin/orders", icon: "ReceiptText", module: "orders", requiredPermissions: ["order.view"] },
  { title: "Thanh toan", href: "/admin/payments", icon: "CreditCard", module: "payments", requiredPermissions: ["payment.view"] },
  { title: "Khuyen mai", href: "/admin/promotions", icon: "Megaphone", module: "promotions", requiredPermissions: ["promotion.view"] },
  { title: "Ma giam gia", href: "/admin/coupons", icon: "TicketPercent", module: "coupons", requiredPermissions: ["coupon.view"] },
  { title: "Danh gia", href: "/admin/reviews", icon: "Star", module: "reviews", requiredPermissions: ["review.view"] },
  { title: "Banner", href: "/admin/banners", icon: "Image", module: "banners", requiredPermissions: ["cms.manage"] },
  { title: "Bai viet", href: "/admin/articles", icon: "Newspaper", module: "articles", requiredPermissions: ["cms.manage"] },
  { title: "Cai dat", href: "/admin/settings", icon: "Settings", module: "settings", requiredRoles: ["SUPER_ADMIN"] },
];
