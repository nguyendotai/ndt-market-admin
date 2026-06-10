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
  { title: "Tổng quan", href: "/admin/dashboard", icon: "LayoutDashboard", module: "dashboard" },
  { title: "Người dùng", href: "/admin/users", icon: "Users", module: "users", requiredPermissions: ["user.view"] },
  { title: "Danh mục", href: "/admin/categories", icon: "Boxes", module: "categories", requiredPermissions: ["category.view"] },
  { title: "Thương hiệu", href: "/admin/brands", icon: "BadgeCheck", module: "brands", requiredPermissions: ["brand.view"] },
  { title: "Sản phẩm", href: "/admin/products", icon: "Package", module: "products", requiredPermissions: ["product.view"] },
  { title: "Cửa hàng", href: "/admin/stores", icon: "Store", module: "stores", requiredPermissions: ["store.view"] },
  { title: "Tồn kho", href: "/admin/inventories", icon: "Warehouse", module: "inventories", requiredPermissions: ["inventory.view"] },
  { title: "Đơn hàng", href: "/admin/orders", icon: "ReceiptText", module: "orders", requiredPermissions: ["order.view"] },
  { title: "Thanh toán", href: "/admin/payments", icon: "CreditCard", module: "payments", requiredPermissions: ["payment.view"] },
  { title: "Khuyến mãi", href: "/admin/promotions", icon: "Megaphone", module: "promotions", requiredPermissions: ["promotion.view"] },
  { title: "Mã giảm giá", href: "/admin/coupons", icon: "TicketPercent", module: "coupons", requiredPermissions: ["coupon.view"] },
  { title: "Đánh giá", href: "/admin/reviews", icon: "Star", module: "reviews", requiredPermissions: ["review.view"] },
  { title: "Banner", href: "/admin/banners", icon: "Image", module: "banners", requiredPermissions: ["banner.view"] },
  { title: "Bài viết", href: "/admin/articles", icon: "Newspaper", module: "articles", requiredPermissions: ["article.view"] },
  { title: "Cài đặt", href: "/admin/settings", icon: "Settings", module: "settings", requiredRoles: ["SUPER_ADMIN"] },
];
