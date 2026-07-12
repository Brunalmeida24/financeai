import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface StatsCardProps {
  emoji: string;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "primary" | "success" | "info" | "muted" | "warning";
}

const toneClasses: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  primary: "from-primary/20 to-primary/0 border-primary/30",
  success: "from-success/20 to-success/0 border-success/30",
  info: "from-info/20 to-info/0 border-info/30",
  warning: "from-warning/20 to-warning/0 border-warning/30",
  muted: "from-muted/40 to-muted/0 border-border",
};

export function StatsCard({
  emoji,
  label,
  value,
  hint,
  tone = "primary",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-4",
        toneClasses[tone]
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl" aria-hidden>
          {emoji}
        </span>
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-display font-bold truncate">
        {typeof value === "number" && value > 9999
          ? formatCurrency(value).replace("R$", "R$ ")
          : value}
      </div>
      {hint && (
        <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>
      )}
    </div>
  );
}
