import { cn } from "@/lib/utils";

type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
  className?: string;
};

const variants: Record<StatusBadgeVariant, string> = {
  success: "bg-primary/15 text-primary ring-primary/25",
  warning: "bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  danger: "bg-destructive/15 text-destructive ring-destructive/25",
  info: "bg-sky-500/15 text-sky-700 ring-sky-500/25 dark:text-sky-300",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({
  label,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit items-center rounded-md px-2.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

