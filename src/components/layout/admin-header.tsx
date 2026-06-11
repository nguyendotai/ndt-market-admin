 "use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/common";
import { adminMenu } from "@/configs/menu";
import { canAccessMenuItem } from "@/modules/auth";
import { useAppSelector } from "@/store/hooks";

type AdminHeaderProps = {
  onOpenSidebar?: () => void;
};

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const [keyword, setKeyword] = useState("");
  const [focused, setFocused] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const results = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return [];

    return adminMenu
      .filter((item) => canAccessMenuItem(user, item))
      .filter((item) => [item.title, item.module].join(" ").toLowerCase().includes(normalizedKeyword))
      .slice(0, 6);
  }, [keyword, user]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-xl md:px-6">
      <Button aria-label="Mo sidebar" className="lg:hidden" size="icon" variant="outline" onClick={onOpenSidebar}>
        <Menu className="size-4" />
      </Button>

      <div className="relative min-w-0 flex-1 md:max-w-xl">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
        <Search className="size-4 shrink-0" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Tim module, san pham, don hang, user"
            value={keyword}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onChange={(event) => setKeyword(event.target.value)}
            onFocus={() => setFocused(true)}
          />
        </div>
        {focused && keyword.trim() ? (
          <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-xl">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">Không tìm thấy module phù hợp.</div>
            ) : (
              <div className="p-1">
                {results.map((item) => (
                  <Link
                    key={item.module}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    href={item.href}
                    onClick={() => {
                      setFocused(false);
                      setKeyword("");
                    }}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.href}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <Button aria-label="Thong bao" size="icon" variant="outline">
        <Bell className="size-4" />
      </Button>
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}
