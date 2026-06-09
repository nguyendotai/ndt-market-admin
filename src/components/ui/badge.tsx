import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary ring-primary/25",
        secondary: "bg-secondary text-secondary-foreground ring-border",
        destructive: "bg-destructive/15 text-destructive ring-destructive/25",
        outline: "text-foreground ring-border",
        warning: "bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300",
        info: "bg-sky-500/15 text-sky-700 ring-sky-500/25 dark:text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
  );
}

export { Badge, badgeVariants };

