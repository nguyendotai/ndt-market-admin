import { Bell, ChevronDown, Search } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:max-w-lg">
        <Search className="size-4 shrink-0" />
        <span className="truncate">Tim don hang, san pham, khach hang</span>
      </div>

      <Button aria-label="Thong bao" size="icon" variant="outline">
        <Bell className="size-4" />
      </Button>
      <ThemeToggle />
      <details className="group relative hidden sm:block">
        <summary className="flex h-8 cursor-pointer list-none items-center gap-2 rounded-lg border bg-background px-2 text-sm font-medium transition-colors hover:bg-muted">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span>Admin</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-md">
          <Link className="block rounded-md px-3 py-2 hover:bg-accent" href="/admin/settings">
            Tai khoan
          </Link>
          <Link className="block rounded-md px-3 py-2 hover:bg-accent" href="/login">
            Dang xuat
          </Link>
        </div>
      </details>
    </header>
  );
}
