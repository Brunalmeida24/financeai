import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glass?: boolean;
  hover?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 shadow-lg shadow-black/10",
          glass ? "glass" : "bg-card border border-border",
          hover &&
            "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-between gap-2 mb-3", className)}
    {...props}
  />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-sm font-semibold text-foreground font-display",
      className
    )}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-xs text-muted-foreground mt-0.5", className)}
    {...props}
  />
);
