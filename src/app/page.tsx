import { AdminShell } from "@/components/layout/admin-shell";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export default function Home() {
  return (
    <AdminShell>
      <DashboardPage />
    </AdminShell>
  );
}
