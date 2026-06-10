import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading-skeleton";
import { cn } from "@/lib/utils";

type DataTableColumn<T> = {
  key: keyof T | string;
  header: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string;
  loading?: boolean;
  error?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export function DataTable<T extends object>({
  columns,
  data,
  getRowKey,
  loading = false,
  error,
  emptyTitle = "Chua co du lieu",
  emptyDescription = "Du lieu se hien thi tai day khi he thong co ban ghi phu hop.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-5 py-3", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <TableSkeleton columns={Math.min(columns.length, 6)} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <StateMessage
                    description={error}
                    icon={<AlertCircle className="size-5" />}
                    title="Khong tai duoc du lieu"
                  />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <StateMessage
                    description={emptyDescription}
                    title={emptyTitle}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={getRowKey(row, index)} className="transition-colors hover:bg-muted/35">
                  {columns.map((column) => (
                    <td key={String(column.key)} className={cn("px-5 py-4 align-middle", column.className)}>
                      {column.cell
                        ? column.cell(row)
                        : String((row as Record<string, unknown>)[String(column.key)] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StateMessage({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return <EmptyState description={description} icon={icon} title={title} />;
}
