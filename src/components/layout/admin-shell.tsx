import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <AdminSidebar />

      <div className="lg:pl-68">
        <AdminHeader />
        <main className="min-h-[calc(100dvh-4rem)] px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
