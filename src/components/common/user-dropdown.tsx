"use client";

import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ACCESS_TOKEN_STORAGE_KEY, authService } from "@/modules/auth";
import { clearAuth } from "@/store/slices";
import { useAppDispatch } from "@/store/hooks";

export function UserDropdown() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    await authService.logout();
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    dispatch(clearAuth());
    toast.success("Dang xuat thanh cong");
    router.replace("/login");
  }

  return (
    <details className="group relative hidden sm:block">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border bg-background px-2 text-sm font-medium transition-colors hover:bg-muted">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          A
        </span>
        <span>Admin</span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-md">
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent" href="/admin/settings">
          <UserRound className="size-4" />
          Tai khoan
        </Link>
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent" href="/admin/settings">
          <Settings className="size-4" />
          Cai dat
        </Link>
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-destructive hover:bg-destructive/10"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Dang xuat
        </button>
      </div>
    </details>
  );
}
