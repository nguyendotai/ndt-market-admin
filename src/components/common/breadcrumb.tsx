"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminMenu } from "@/configs/menu";
import { cn } from "@/lib/utils";

type BreadcrumbProps = {
  className?: string;
};

const labelMap = new Map([
  ["admin", "Admin"],
  ...adminMenu.map((item) => [item.module, item.title] as const),
]);

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
    >
      <Link
        aria-label="Trang chu"
        className="inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        href="/admin"
      >
        <Home className="size-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = labelMap.get(segment) ?? segment;

        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link className="rounded-md px-1.5 py-1 hover:bg-accent hover:text-accent-foreground" href={href}>
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

