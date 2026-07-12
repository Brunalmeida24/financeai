import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted";

const variants: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground border border-border",
  primary: "bg-primary/15 text-primary border border-primary/30",
  success: "bg-success/15 text-success border border-success/30",
  warning: "bg-warning/15 text-warning border border-warning/30",
  destructive:
    "bg-destructive/15 text-destructive border border-destructive/30",
  info: "bg-info/15 text-info border border-info/30",
  muted: "bg-muted text-muted-foreground border border-border",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
