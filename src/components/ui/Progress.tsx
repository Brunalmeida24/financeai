"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  tone?: "primary" | "success" | "warning";
}

export function Progress({ value, className, tone = "primary" }: ProgressProps) {
  const tones = {
    primary: "from-primary to-info",
    success: "from-success to-primary",
    warning: "from-warning to-primary",
  };
  return (
    <div
      className={cn(
        "h-2 rounded-full bg-secondary/70 overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r rounded-full transition-all duration-700",
          tones[tone]
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
