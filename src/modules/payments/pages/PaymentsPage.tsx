"use client";

import { CheckCircle2, RotateCcw, Search, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, Pagination, StatusBadge, TableSkeleton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PaymentStatus } from "@/constants/paymentStatus";
import type { Payment, PaymentMethod } from "@/modules/payments";
import { paymentService } from "@/services/payment.service";
import type { ApiMeta } from "@/services/api-response";

const PAYMENT_METHODS: Array<PaymentMethod | "all"> = [
  "all",
  "BANK_TRANSFER",
  "COD",
  "MOMO",
  "VNPAY",
  "ZALOPAY",
  "CREDIT_CARD",
];

const PAYMENT_STATUSES: Array<PaymentStatus | "all"> = [
  "all",
  "PENDING",
  "UNPAID",
  "PAID",
  "REFUNDED",
  "FAILED",
  "CANCELLED",
];

type PendingAction = {
  type: "confirm" | "refund";
  payment: Payment;
} | null;

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<ApiMeta | undefined>();
  const [keyword, setKeyword] = useState("");
  const [method, setMethod] = useState<PaymentMethod | "all">("all");
  const [status, setStatus] = useState<PaymentStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const limit = 10;

  async function loadPayments() {
    setLoading(true);

    try {
      const params = {
        keyword: keyword.trim() || undefined,
        method,
        status,
        page,
        limit,
      };

      try {
        const response = await paymentService.listPayments(params);
        setPayments(response.data);
        setMeta(response.meta);
        setUsingFallback(false);
      } catch (error) {
        if (!shouldFallbackToOrders(error)) {
          throw error;
        }

        const fallbackResponse = await paymentService.listPaymentsFromOrders(params);
        setPayments(fallbackResponse.data);
        setMeta(fallbackResponse.meta);
        setUsingFallback(true);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPayments();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadPayments intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, method, status, page]);

  const visiblePayments = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesMethod = method === "all" || payment.method === method;
      const matchesStatus = status === "all" || payment.status === status;
      const searchBlob = [payment.orderCode, payment.transactionCode, payment.transactionId]
        .join(" ")
        .toLowerCase();

      return matchesMethod && matchesStatus && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
    });
  }, [payments, keyword, method, status]);

  const totalPages = Number(meta?.totalPages ?? 0);
  const hasNextPage = totalPages ? page < totalPages : payments.length >= limit;

  async function handleAction() {
    if (!pendingAction) return;

    setSubmitting(true);

    try {
      const paymentId = getPaymentActionId(pendingAction.payment);

      if (pendingAction.type === "confirm") {
        await paymentService.confirmPayment(paymentId);
        toast.success("Xac nhan thanh toan thanh cong");
      } else {
        await paymentService.refundPayment(paymentId);
        toast.success("Refund payment thanh cong");
      }

      setPendingAction(null);
      await loadPayments();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Theo doi giao dich thanh toan, xac nhan chuyen khoan va refund khi can."
        icon={WalletCards}
        title="Quan ly thanh toan"
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="whitespace-nowrap">Danh sach payment</CardTitle>
              {usingFallback ? (
                <StatusBadge label="Fallback tu orders" variant="warning" />
              ) : null}
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_180px_180px]">
              <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Order code hoac transaction code"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={method} onChange={(value) => { setMethod(value); setPage(1); }}>
                {PAYMENT_METHODS.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca method" : item}</option>)}
              </Select>
              <Select value={status} onChange={(value) => { setStatus(value as PaymentStatus | "all"); setPage(1); }}>
                {PAYMENT_STATUSES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca status" : item}</option>)}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton columns={7} rows={7} />
          ) : (
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Order code</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction code</TableHead>
                  <TableHead>Paid at</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={7}>
                      Khong tim thay payment phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visiblePayments.map((payment) => {
                    const canConfirm = payment.method === "BANK_TRANSFER" && payment.status !== "PAID";
                    const canRefund = payment.status === "PAID";

                    return (
                      <TableRow key={getPaymentKey(payment)}>
                        <TableCell className="w-[170px] font-mono font-semibold">{payment.orderCode}</TableCell>
                        <TableCell className="w-[150px]">{payment.method}</TableCell>
                        <TableCell className="w-[150px] font-semibold">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="w-[140px]"><PaymentStatusBadge status={payment.status} /></TableCell>
                        <TableCell className="w-[220px] font-mono text-xs text-muted-foreground">
                          {payment.transactionCode ?? payment.transactionId ?? "-"}
                        </TableCell>
                        <TableCell className="w-[150px] text-muted-foreground">{formatDate(payment.paidAt ?? undefined)}</TableCell>
                        <TableCell className="w-[190px]">
                          <div className="flex justify-end gap-2">
                            <Button
                              className="gap-2"
                              disabled={!canConfirm || usingFallback}
                              size="sm"
                              variant="outline"
                              onClick={() => setPendingAction({ type: "confirm", payment })}
                            >
                              <CheckCircle2 className="size-3.5" />
                              Confirm
                            </Button>
                            <Button
                              className="gap-2"
                              disabled={!canRefund || usingFallback}
                              size="sm"
                              variant="destructive"
                              onClick={() => setPendingAction({ type: "refund", payment })}
                            >
                              <RotateCcw className="size-3.5" />
                              Refund
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
        description={getConfirmDescription(pendingAction)}
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "confirm" ? "Xac nhan thanh toan" : "Refund payment"}
        confirmText={pendingAction?.type === "confirm" ? "Xac nhan" : "Refund"}
        onConfirm={handleAction}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setPendingAction(null);
          }
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

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const variant = status === "PAID" ? "success" : status === "FAILED" || status === "CANCELLED" ? "danger" : status === "REFUNDED" ? "info" : "warning";
  return <StatusBadge label={status} variant={variant} />;
}

function shouldFallbackToOrders(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return false;
  }

  const statusCode = Number((error as { status?: number }).status);
  return statusCode === 404 || statusCode === 405;
}

function getPaymentActionId(payment: Payment) {
  return payment.id ?? payment._id ?? payment.transactionCode ?? payment.transactionId ?? payment.orderCode;
}

function getPaymentKey(payment: Payment) {
  return payment.id ?? payment._id ?? `${payment.orderCode}-${payment.transactionCode ?? payment.transactionId ?? payment.method}`;
}

function getConfirmDescription(action: PendingAction) {
  if (!action) return "";

  if (action.type === "confirm") {
    return `Xac nhan da nhan thanh toan BANK_TRANSFER cho don "${action.payment.orderCode}"?`;
  }

  return `Refund payment cua don "${action.payment.orderCode}"? Hanh dong nay can duoc backend xu ly giao dich.`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
