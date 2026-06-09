import { AdminLayout as AdminLayoutShell } from "@/components/layout/admin-layout";
import { AuthGuard } from "@/modules/auth/components/AuthGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AuthGuard>
  );
}
