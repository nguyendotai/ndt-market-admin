"use client";

import { ArrowLeft, Loader2, MapPin, Save, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User, UserAddress, UserOrderSummary, UserRole, UserStatus } from "@/modules/users";
import { userService } from "@/services/user.service";

const USER_ROLES: UserRole[] = ["CUSTOMER", "STAFF", "ADMIN", "SHIPPER", "SUPER_ADMIN"];

type UserDetailPageProps = {
  userId: string;
};

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [permissionsInput, setPermissionsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [confirmRoleOpen, setConfirmRoleOpen] = useState(false);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);

  async function loadUser() {
    setLoading(true);

    try {
      const response = await userService.getUserById(userId);
      setUser(response.data);
      setRole(response.data.role);
      setPermissionsInput((response.data.permissions ?? []).join("\n"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadUser();
    }, 0);

    return () => window.clearTimeout(timer);
    // loadUser intentionally runs when userId changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addresses = useMemo(() => user?.addresses ?? [], [user]);
  const orders = useMemo(() => user?.orders ?? user?.orderHistory ?? [], [user]);

  async function handleUpdateRole() {
    if (!user) return;
    setSubmittingRole(true);

    try {
      const permissions = role === "CUSTOMER" ? undefined : parsePermissions(permissionsInput);
      const response = await userService.updateUserRole(getEntityId(user), role, permissions);
      setUser(response.data);
      setRole(response.data.role);
      setPermissionsInput((response.data.permissions ?? []).join("\n"));
      setConfirmRoleOpen(false);
      toast.success("Da cap nhat role user");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmittingRole(false);
    }
  }

  async function handleToggleBlock() {
    if (!user) return;
    const nextStatus: UserStatus = getUserStatus(user) === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    setSubmittingStatus(true);

    try {
      const response = await userService.updateUserStatus(getEntityId(user), nextStatus);
      setUser(response.data);
      setRole(response.data.role);
      setPermissionsInput((response.data.permissions ?? []).join("\n"));
      setConfirmStatusOpen(false);
      toast.success(nextStatus === "BLOCKED" ? "Da block user" : "Da unblock user");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmittingStatus(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-96 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return <div className="rounded-lg border p-8 text-center text-muted-foreground">Khong tim thay user.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Thong tin khach hang/nhan vien, dia chi, lich su don hang va diem tich luy."
        icon={UserRound}
        title={getUserName(user)}
        actions={
          <Button variant="outline">
            <Link className="inline-flex items-center gap-2" href="/admin/users">
              <ArrowLeft className="size-4" />
              Quay lai
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Quan tri user</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={user.role} variant={user.role === "CUSTOMER" ? "neutral" : "info"} />
            <UserStatusBadge status={getUserStatus(user)} />
            <StatusBadge label={user.membershipTier ?? "STANDARD"} variant="success" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {USER_ROLES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <Button disabled={submittingRole || role === user.role} onClick={() => setConfirmRoleOpen(true)}>
              {submittingRole ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Luu role
            </Button>
            <Button disabled={submittingStatus} variant={getUserStatus(user) === "BLOCKED" ? "outline" : "destructive"} onClick={() => setConfirmStatusOpen(true)}>
              {submittingStatus ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              {getUserStatus(user) === "BLOCKED" ? "Unblock" : "Block"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Permissions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-5">
          <textarea
            className="min-h-32 rounded-lg border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-3 focus:ring-ring/30"
            disabled={role === "CUSTOMER"}
            placeholder="catalog.manage&#10;orders.manage&#10;customers.manage"
            value={permissionsInput}
            onChange={(event) => setPermissionsInput(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Moi dong la mot permission key. Khi doi role ve CUSTOMER, backend se tu clear permissions.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="Thong tin user">
          <Info label="Ho ten" value={getUserName(user)} />
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone || "-"} />
          <Info label="Ngay tao" value={formatDateTime(user.createdAt)} />
        </InfoCard>

        <InfoCard title="Diem tich luy">
          <Info label="Loyalty points" value={String(getUserPoints(user))} strong />
          <Info label="Membership tier" value={user.membershipTier ?? "STANDARD"} />
          <Info label="Tong don hang" value={String(orders.length)} />
        </InfoCard>

        <InfoCard title="Trang thai">
          <Info label="Role hien tai" value={user.role} />
          <Info label="Status" value={getUserStatus(user)} />
          <Info label="User ID" value={getEntityId(user)} />
        </InfoCard>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4" />
            Danh sach dia chi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Nguoi nhan</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Dia chi</TableHead>
                <TableHead>Mac dinh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.length === 0 ? (
                <TableRow>
                  <TableCell className="py-12 text-center text-muted-foreground" colSpan={4}>User chua co dia chi.</TableCell>
                </TableRow>
              ) : (
                addresses.map((address) => (
                  <TableRow key={getAddressKey(address)}>
                    <TableCell className="font-medium">{address.fullName ?? getUserName(user)}</TableCell>
                    <TableCell className="text-muted-foreground">{address.phone ?? user.phone ?? "-"}</TableCell>
                    <TableCell>{formatAddress(address)}</TableCell>
                    <TableCell>{address.isDefault ? <StatusBadge label="DEFAULT" variant="success" /> : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4" />
            Lich su don hang
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ngay tao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell className="py-12 text-center text-muted-foreground" colSpan={5}>Chua co lich su don hang.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={getOrderKey(order)}>
                    <TableCell className="font-mono font-semibold">{order.orderCode ?? getOrderKey(order)}</TableCell>
                    <TableCell><StatusBadge label={order.status ?? "-"} variant={order.status === "COMPLETED" ? "success" : "neutral"} /></TableCell>
                    <TableCell><StatusBadge label={order.paymentStatus ?? "-"} variant={order.paymentStatus === "PAID" ? "success" : "warning"} /></TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.totalAmount ?? order.total ?? 0)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(order.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        description={`Ban co chac muon doi role user "${getUserName(user)}" tu ${user.role} sang ${role}?`}
        open={confirmRoleOpen}
        title="Doi role user"
        confirmText="Doi role"
        onConfirm={handleUpdateRole}
        onOpenChange={(open) => {
          if (!open && !submittingRole) setConfirmRoleOpen(false);
        }}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${getUserStatus(user) === "BLOCKED" ? "unblock" : "block"} user "${getUserName(user)}"?`}
        open={confirmStatusOpen}
        title="Cap nhat trang thai user"
        confirmText="Xac nhan"
        onConfirm={handleToggleBlock}
        onOpenChange={(open) => {
          if (!open && !submittingStatus) setConfirmStatusOpen(false);
        }}
      />
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-5">{children}</CardContent>
    </Card>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={strong ? "text-base font-semibold" : "break-words text-sm font-medium"}>{value}</p>
    </div>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const variant = status === "ACTIVE" ? "success" : status === "BLOCKED" ? "danger" : "neutral";
  return <StatusBadge label={status} variant={variant} />;
}

function getUserName(user: User) {
  return user.fullName ?? user.name ?? user.email;
}

function getUserStatus(user: User): UserStatus {
  if (user.status) return user.status;
  return user.isActive === false ? "BLOCKED" : "ACTIVE";
}

function getUserPoints(user: User) {
  return user.totalPoints ?? user.loyaltyPoints ?? user.points ?? 0;
}

function parsePermissions(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function getAddressKey(address: UserAddress) {
  return address.id ?? address._id ?? formatAddress(address);
}

function getOrderKey(order: UserOrderSummary) {
  return order.id ?? order._id ?? order.orderCode ?? "";
}

function formatAddress(address: UserAddress) {
  return [address.address, address.ward, address.district, address.province].filter(Boolean).join(", ") || "-";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
