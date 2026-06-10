import { AdminLayout as AdminLayoutShell } from "@/components/layout/admin-layout";
import { AdminRouteGuard } from "@/modules/auth/components/AdminRouteGuard";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AdminLayoutShell>
        <AdminRouteGuard>{children}</AdminRouteGuard>
      </AdminLayoutShell>
    </AuthGuard>
  );
}
