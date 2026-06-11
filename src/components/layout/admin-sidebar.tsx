"use client";

import {
  BadgeCheck,
  Boxes,
  CreditCard,
  Image,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  ReceiptText,
  Settings,
  ShoppingBasket,
  Star,
  Store,
  TicketPercent,
  Users,
  Warehouse,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { adminMenu } from "@/configs/menu";
import { cn } from "@/lib/utils";
import { canAccessMenuItem } from "@/modules/auth";
import { useAppSelector } from "@/store/hooks";

const iconMap = {
  BadgeCheck,
  Boxes,
  CreditCard,
  Image,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  ReceiptText,
  Settings,
  Star,
  Store,
  TicketPercent,
  Users,
  Warehouse,
};

type AdminSidebarProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
};

export function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onCollapseChange,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const visibleMenu = adminMenu.filter((item) => canAccessMenuItem(user, item));

  const sidebarContent = (
    <>
      <div className={cn("flex h-16 items-center gap-3 border-b border-sidebar-border px-5", collapsed && "justify-center px-3")}>
        <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20">
          <ShoppingBasket className="size-5" />
        </div>
        <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
          <p className="text-sm font-semibold leading-none">NDT Market</p>
          <p className="mt-1 text-xs text-muted-foreground">Admin dashboard</p>
        </div>
        <Button
          aria-label="Dong menu mobile"
          className="lg:hidden"
          size="icon"
          variant="ghost"
          onClick={() => onMobileOpenChange?.(false)}
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto px-3 py-4">
        <Button
          aria-label={collapsed ? "Mo rong sidebar" : "Thu gon sidebar"}
          className="mb-3 hidden w-full justify-start gap-3 lg:flex"
          size="sm"
          variant="ghost"
          onClick={() => onCollapseChange?.(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          <span className={cn(collapsed && "sr-only")}>{collapsed ? "Mở rộng" : "Thu gọn"}</span>
        </Button>
        {visibleMenu.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.module}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0",
                isActive &&
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/15 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              )}
              title={collapsed ? item.title : undefined}
              onClick={() => onMobileOpenChange?.(false)}
            >
              <Icon className="size-4" />
              <span className={cn(collapsed && "sr-only")}>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:block",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Dong sidebar"
            className="absolute inset-0 bg-black/45"
            type="button"
            onClick={() => onMobileOpenChange?.(false)}
          />
          <aside className="relative h-full w-72 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
