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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminMenu } from "@/configs/menu";
import { cn } from "@/lib/utils";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20">
          <ShoppingBasket className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">NDT Market</p>
          <p className="mt-1 text-xs text-muted-foreground">Admin dashboard</p>
        </div>
      </div>

      <nav className="h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto px-3 py-4">
        {adminMenu.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.module}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/15 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
