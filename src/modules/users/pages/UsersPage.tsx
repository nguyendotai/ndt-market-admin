"use client";

import { Eye, Loader2, Search, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, Pagination, StatusBadge, TableSkeleton } from "@/components/common";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User, UserRole, UserStatus } from "@/modules/users";
import { userService } from "@/services/user.service";
import type { ApiMeta } from "@/services/api-response";

const USER_ROLES: Array<UserRole | "all"> = ["all", "CUSTOMER", "STAFF", "ADMIN", "SHIPPER", "SUPER_ADMIN"];
const USER_STATUSES: Array<UserStatus | "all"> = ["all", "ACTIVE", "BLOCKED"];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<ApiMeta | undefined>();
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [pendingStatusUser, setPendingStatusUser] = useState<User | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: User; role: UserRole } | null>(null);
  const limit = 10;

  async function loadUsers() {
    setLoading(true);

    try {
      const response = await userService.listUsers({
        keyword: keyword.trim() || undefined,
        role,
        status,
        page,
        limit,
      });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadUsers();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadUsers intentionally reads current filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, role, status, page]);

  const visibleUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return users.filter((user) => {
      const searchBlob = [getUserName(user), user.email, user.phone].join(" ").toLowerCase();
      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || getUserStatus(user) === status;
      const matchesKeyword = !normalizedKeyword || searchBlob.includes(normalizedKeyword);

      return matchesRole && matchesStatus && matchesKeyword;
    });
  }, [keyword, role, status, users]);

  const totalPages = Number(meta?.totalPages ?? 0);
  const hasNextPage = totalPages ? page < totalPages : users.length >= limit;

  async function handleToggleBlock() {
    if (!pendingStatusUser) return;
    const user = pendingStatusUser;
    const userId = getEntityId(user);
    const nextStatus: UserStatus = getUserStatus(user) === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    setMutatingId(userId);

    try {
      await userService.updateUserStatus(userId, nextStatus);
      toast.success(nextStatus === "BLOCKED" ? "Da block user" : "Da unblock user");
      setPendingStatusUser(null);
      await loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMutatingId(null);
    }
  }

  async function handleChangeRole() {
    if (!pendingRoleChange) return;
    const { user, role: nextRole } = pendingRoleChange;
    const userId = getEntityId(user);
    setMutatingId(userId);

    try {
      await userService.updateUserRole(userId, nextRole, nextRole === "CUSTOMER" ? undefined : user.permissions);
      toast.success("Da cap nhat role user");
      setPendingRoleChange(null);
      await loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMutatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly khach hang va nhan vien, loc nhanh theo role, status va cap nhat quyen truy cap."
        icon={Users}
        title="Quan ly nguoi dung"
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4">
            <CardTitle>Danh sach users</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_180px_180px]">
              <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search name, email, phone"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={role} onChange={(value) => { setRole(value as UserRole | "all"); setPage(1); }}>
                {USER_ROLES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca role" : item}</option>)}
              </Select>
              <Select value={status} onChange={(value) => { setStatus(value as UserStatus | "all"); setPage(1); }}>
                {USER_STATUSES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca status" : item}</option>)}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton columns={8} rows={7} />
          ) : (
            <Table className="min-w-[1120px]">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diem/Tier</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Ngay tao</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={8}>
                      Khong tim thay user phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleUsers.map((user) => {
                    const userId = getEntityId(user);
                    const isMutating = mutatingId === userId;

                    return (
                      <TableRow key={userId}>
                        <TableCell className="w-[280px]">
                          <div className="flex items-center gap-3">
                            <Avatar user={user} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{getUserName(user)}</p>
                              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[150px] text-muted-foreground">{user.phone || "-"}</TableCell>
                        <TableCell className="w-[180px]">
                          <select
                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                            disabled={isMutating}
                            value={user.role}
                            onChange={(event) => setPendingRoleChange({ user, role: event.target.value as UserRole })}
                          >
                            {USER_ROLES.filter((item) => item !== "all").map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                        </TableCell>
                        <TableCell className="w-[130px]">
                          <UserStatusBadge status={getUserStatus(user)} />
                        </TableCell>
                        <TableCell className="w-[150px]">
                          <p className="font-mono text-sm font-semibold">{getUserPoints(user)}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{user.membershipTier ?? "STANDARD"}</p>
                        </TableCell>
                        <TableCell className="w-[170px] text-xs text-muted-foreground">
                          {(user.permissions ?? []).length ? `${user.permissions?.length} permissions` : "-"}
                        </TableCell>
                        <TableCell className="w-[150px] text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="w-[230px]">
                          <div className="flex justify-end gap-2">
                            <Link
                              aria-label="Xem user"
                              className={buttonVariants({ size: "icon", variant: "outline" })}
                              href={`/admin/users/${userId}`}
                            >
                              <Eye className="size-4" />
                            </Link>
                            <Button
                              disabled={isMutating}
                              size="sm"
                              variant={getUserStatus(user) === "BLOCKED" ? "outline" : "destructive"}
                              onClick={() => setPendingStatusUser(user)}
                            >
                              {isMutating ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                              {getUserStatus(user) === "BLOCKED" ? "Unblock" : "Block"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Pagination
        hasNextPage={hasNextPage}
        loading={loading}
        page={page}
        totalPages={totalPages || undefined}
        onPageChange={setPage}
      />

      <ConfirmDialog
        description={`Ban co chac muon ${getUserStatus(pendingStatusUser ?? {}) === "BLOCKED" ? "unblock" : "block"} user "${pendingStatusUser ? getUserName(pendingStatusUser) : ""}"?`}
        open={Boolean(pendingStatusUser)}
        title="Cap nhat trang thai user"
        confirmText="Xac nhan"
        onConfirm={handleToggleBlock}
        onOpenChange={(open) => {
          if (!open) setPendingStatusUser(null);
        }}
      />

      <ConfirmDialog
        description={`Ban co chac muon doi role user "${pendingRoleChange ? getUserName(pendingRoleChange.user) : ""}" sang ${pendingRoleChange?.role ?? ""}?`}
        open={Boolean(pendingRoleChange)}
        title="Doi role user"
        confirmText="Doi role"
        onConfirm={handleChangeRole}
        onOpenChange={(open) => {
          if (!open) setPendingRoleChange(null);
        }}
      />
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  );
}

function Avatar({ user }: { user: User }) {
  if (user.avatar) {
    return <div aria-label={getUserName(user)} className="size-10 shrink-0 rounded-lg bg-cover bg-center" role="img" style={{ backgroundImage: `url(${user.avatar})` }} />;
  }

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-semibold text-primary">
      {getUserName(user).charAt(0).toUpperCase() || <UserCog className="size-4" />}
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

function getUserStatus(user: Partial<User>): UserStatus {
  if (user.status) return user.status;
  return user.isActive === false ? "BLOCKED" : "ACTIVE";
}

function getUserPoints(user: User) {
  return user.totalPoints ?? user.loyaltyPoints ?? user.points ?? 0;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
