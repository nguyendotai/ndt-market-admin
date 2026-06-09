import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <section className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="flex min-w-0 gap-3">
        {Icon ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="size-5" />
          </div>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </section>
  );
}

