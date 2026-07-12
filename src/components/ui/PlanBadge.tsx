import { Badge } from "./Badge";
import type { PlanKey } from "@/lib/plan";

const config: Record<
  PlanKey,
  { label: string; emoji: string; variant: "muted" | "primary" | "success" }
> = {
  FREE: { label: "Free", emoji: "🌱", variant: "muted" },
  PRO: { label: "Pro", emoji: "✨", variant: "primary" },
  PREMIUM: { label: "Premium", emoji: "👑", variant: "success" },
};

export function PlanBadge({ plan }: { plan: string | null | undefined }) {
  const key = (plan === "PRO" || plan === "PREMIUM" ? plan : "FREE") as PlanKey;
  const c = config[key];
  return (
    <Badge variant={c.variant} className="text-[10px]">
      <span aria-hidden>{c.emoji}</span>
      {c.label}
    </Badge>
  );
}
