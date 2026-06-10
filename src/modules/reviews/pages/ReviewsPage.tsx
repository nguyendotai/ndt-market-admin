"use client";

import { CheckCircle2, Eye, MessageSquareText, Search, Star, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog, PageHeader, Pagination, StatusBadge, TableSkeleton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Review, ReviewStatus } from "@/modules/reviews";
import { reviewService } from "@/services/review.service";
import type { ApiMeta } from "@/services/api-response";

const REVIEW_STATUSES: Array<ReviewStatus | "all"> = ["all", "PENDING", "APPROVED", "REJECTED"];
const RATING_FILTERS: Array<number | "all"> = ["all", 5, 4, 3, 2, 1];

type PendingAction = {
  review: Review;
  status: ReviewStatus;
} | null;

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<ApiMeta | undefined>();
  const [keyword, setKeyword] = useState("");
  const [rating, setRating] = useState<number | "all">("all");
  const [status, setStatus] = useState<ReviewStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const limit = 10;

  async function loadReviews() {
    setLoading(true);

    try {
      const response = await reviewService.listReviews({
        keyword: keyword.trim() || undefined,
        rating,
        status,
        page,
        limit,
      });
      setReviews(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadReviews();
    }, 250);

    return () => window.clearTimeout(timer);
    // loadReviews intentionally reads current filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, rating, status, page]);

  const visibleReviews = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesRating = rating === "all" || review.rating === rating;
      const matchesStatus = status === "all" || review.status === status;
      const searchBlob = [getProductName(review), getProductSku(review), getUserName(review), getUserEmail(review)]
        .join(" ")
        .toLowerCase();

      return matchesRating && matchesStatus && (!normalizedKeyword || searchBlob.includes(normalizedKeyword));
    });
  }, [reviews, keyword, rating, status]);

  const totalPages = Number(meta?.totalPages ?? 0);
  const hasNextPage = totalPages ? page < totalPages : reviews.length >= limit;

  async function handleUpdateStatus() {
    if (!pendingAction) return;

    setSubmitting(true);

    try {
      await reviewService.updateReviewStatus(getEntityId(pendingAction.review), pendingAction.status);
      toast.success(pendingAction.status === "APPROVED" ? "Da approve review" : "Da reject review");
      setPendingAction(null);
      await loadReviews();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Duyet danh gia san pham, loc theo rating/status va xem noi dung comment chi tiet."
        icon={MessageSquareText}
        title="Quan ly danh gia"
      />

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-col gap-4">
            <CardTitle className="whitespace-nowrap">Danh sach review</CardTitle>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_150px_170px]">
              <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
                <Search className="size-4" />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search san pham hoac user"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={String(rating)} onChange={(value) => { setRating(value === "all" ? "all" : Number(value)); setPage(1); }}>
                {RATING_FILTERS.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca rating" : `${item} sao`}</option>)}
              </Select>
              <Select value={status} onChange={(value) => { setStatus(value as ReviewStatus | "all"); setPage(1); }}>
                {REVIEW_STATUSES.map((item) => <option key={item} value={item}>{item === "all" ? "Tat ca status" : item}</option>)}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton columns={7} rows={7} />
          ) : (
            <Table className="min-w-[1040px]">
              <TableHeader>
                <TableRow>
                  <TableHead>San pham</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ngay tao</TableHead>
                  <TableHead className="text-right">Thao tac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleReviews.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-muted-foreground" colSpan={7}>
                      Khong tim thay review phu hop.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleReviews.map((review) => (
                    <TableRow key={getEntityId(review)}>
                      <TableCell className="w-[240px]">
                        <p className="font-medium">{getProductName(review)}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{getProductSku(review)}</p>
                      </TableCell>
                      <TableCell className="w-[210px]">
                        <p className="font-medium">{getUserName(review)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{getUserEmail(review)}</p>
                      </TableCell>
                      <TableCell className="w-[140px]"><RatingStars rating={review.rating} /></TableCell>
                      <TableCell className="w-[280px]">
                        <p className="line-clamp-2 text-sm text-muted-foreground">{getReviewComment(review)}</p>
                      </TableCell>
                      <TableCell className="w-[130px]"><ReviewStatusBadge status={review.status} /></TableCell>
                      <TableCell className="w-[150px] text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
                      <TableCell className="w-[210px]">
                        <div className="flex justify-end gap-2">
                          <Button aria-label="Xem comment" size="icon" variant="outline" onClick={() => setSelectedReview(review)}>
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            aria-label="Approve review"
                            disabled={review.status === "APPROVED"}
                            size="icon"
                            variant="outline"
                            onClick={() => setPendingAction({ review, status: "APPROVED" })}
                          >
                            <CheckCircle2 className="size-4" />
                          </Button>
                          <Button
                            aria-label="Reject review"
                            disabled={review.status === "REJECTED"}
                            size="icon"
                            variant="destructive"
                            onClick={() => setPendingAction({ review, status: "REJECTED" })}
                          >
                            <XCircle className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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

      <ReviewCommentDialog review={selectedReview} onClose={() => setSelectedReview(null)} />

      <ConfirmDialog
        description={getActionDescription(pendingAction)}
        open={Boolean(pendingAction)}
        title={pendingAction?.status === "APPROVED" ? "Approve review" : "Reject review"}
        confirmText={pendingAction?.status === "APPROVED" ? "Approve" : "Reject"}
        onConfirm={handleUpdateStatus}
        onOpenChange={(open) => {
          if (!open && !submitting) setPendingAction(null);
        }}
      />
    </div>
  );
}

function ReviewCommentDialog({ review, onClose }: { review: Review | null; onClose: () => void }) {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section aria-modal="true" className="w-full max-w-2xl rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl" role="dialog">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Chi tiet comment</h2>
            <p className="mt-1 text-sm text-muted-foreground">{getProductName(review)} - {getUserName(review)}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onClose}>Dong</Button>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <RatingStars rating={review.rating} />
          <ReviewStatusBadge status={review.status} />
          <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap rounded-lg border bg-background p-4 text-sm leading-6">
          {getReviewComment(review)}
        </p>
      </section>
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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} sao`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={index < rating ? "size-4 fill-amber-400 text-amber-400" : "size-4 text-muted-foreground/40"}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
    </div>
  );
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const variant = status === "APPROVED" ? "success" : status === "REJECTED" ? "danger" : "warning";
  return <StatusBadge label={status} variant={variant} />;
}

function getProductName(review: Review) {
  if (review.product && typeof review.product !== "string") return review.product.name ?? "-";
  return review.productId ?? "-";
}

function getProductSku(review: Review) {
  if (review.product && typeof review.product !== "string") return review.product.sku ?? "-";
  return "-";
}

function getUserName(review: Review) {
  const user = review.user ?? review.customer;
  if (user && typeof user !== "string") return user.fullName ?? user.name ?? "-";
  return review.userId ?? review.customerId ?? "-";
}

function getUserEmail(review: Review) {
  const user = review.user ?? review.customer;
  if (user && typeof user !== "string") return user.email ?? user.phone ?? "-";
  return "-";
}

function getReviewComment(review: Review) {
  return review.comment ?? review.content ?? "-";
}

function getActionDescription(action: PendingAction) {
  if (!action) return "";

  const verb = action.status === "APPROVED" ? "approve" : "reject";
  return `Ban co chac muon ${verb} review cua "${getUserName(action.review)}" cho san pham "${getProductName(action.review)}"?`;
}

function getEntityId(value: { id?: string; _id?: string }) {
  return value.id ?? value._id ?? "";
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
