import { Bell, Search } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/common";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-xl md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm md:max-w-xl">
        <Search className="size-4 shrink-0" />
        <span className="truncate">Tim don hang, san pham, khach hang</span>
      </div>

      <Button aria-label="Thong bao" size="icon" variant="outline">
        <Bell className="size-4" />
      </Button>
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}
