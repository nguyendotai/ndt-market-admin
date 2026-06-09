import { Breadcrumb } from "@/components/common";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <AdminSidebar />

      <div className="lg:pl-72">
        <AdminHeader />
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

