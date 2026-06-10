import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
};

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function TableSkeleton({ columns = 6, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <LoadingSkeleton key={columnIndex} className="h-8" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-5 w-96 max-w-full" />
        </div>
        <LoadingSkeleton className="h-9 w-32" />
      </div>
      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <LoadingSkeleton className="h-10 w-full max-w-3xl" />
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
}
