"use client";

import { useState } from "react";

import { Breadcrumb } from "@/components/common";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCollapseChange={setSidebarCollapsed}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className={cn("transition-[padding] duration-200 lg:pl-72", sidebarCollapsed && "lg:pl-20")}>
        <AdminHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="min-h-[calc(100dvh-4rem)] px-4 py-6 md:px-6">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
