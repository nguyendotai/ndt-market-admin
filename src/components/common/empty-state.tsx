import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title = "Chua co du lieu",
  description = "Du lieu se hien thi tai day khi he thong co ban ghi phu hop.",
  icon = <Inbox className="size-5" />,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-sm flex-col items-center text-center", className)}>
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
