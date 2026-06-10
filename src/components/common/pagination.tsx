import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages?: number;
  hasNextPage?: boolean;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  loading = false,
  onPageChange,
}: PaginationProps) {
  const canGoPrevious = page > 1 && !loading;
  const canGoNext = !loading && (totalPages ? page < totalPages : Boolean(hasNextPage));

  return (
    <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Pagination">
      <p className="text-sm text-muted-foreground">
        Trang {page}{totalPages ? ` / ${totalPages}` : ""}
      </p>
      <div className="flex gap-2">
        <Button disabled={!canGoPrevious} variant="outline" onClick={() => onPageChange(Math.max(page - 1, 1))}>
          <ChevronLeft className="size-4" />
          Truoc
        </Button>
        <Button disabled={!canGoNext} variant="outline" onClick={() => onPageChange(page + 1)}>
          Sau
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
