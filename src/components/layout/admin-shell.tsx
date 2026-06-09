import { AdminLayout } from "@/components/layout/admin-layout";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
