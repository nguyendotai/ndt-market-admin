import {
  BadgeDollarSign,
  Boxes,
  ChartColumn,
  LayoutDashboard,
  Package,
  ReceiptText,
  Search,
  ShoppingBasket,
  Users,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Tong quan", icon: LayoutDashboard, active: true },
  { name: "Don hang", icon: ReceiptText },
  { name: "San pham", icon: Package },
  { name: "Danh muc", icon: Boxes },
  { name: "Khach hang", icon: Users },
  { name: "Bao cao", icon: ChartColumn },
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShoppingBasket className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Market Admin</p>
            <p className="mt-1 text-xs text-muted-foreground">Online grocery</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                item.active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex flex-1 items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:max-w-md">
            <Search className="size-4" />
            <span>Tim don hang, san pham, khach hang</span>
          </div>
          <Button className="hidden gap-2 sm:inline-flex">
            <BadgeDollarSign className="size-4" />
            Tao khuyen mai
          </Button>
          <ThemeToggle />
        </header>
        <main className="px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
