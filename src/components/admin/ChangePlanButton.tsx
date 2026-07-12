"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PlanBadge } from "@/components/ui/PlanBadge";

export function ChangePlanButton({
  userId,
  currentPlan,
  isOwner,
}: {
  userId: string;
  currentPlan: "FREE" | "PRO" | "PREMIUM";
  isOwner: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  async function change(plan: "FREE" | "PRO" | "PREMIUM") {
    setPending(plan);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    setPending(null);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <PlanBadge plan={currentPlan} />
      {!isOwner && (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Alterar plano
        </Button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-5 w-full max-w-sm">
            <h3 className="font-display font-semibold mb-3">Alterar plano</h3>
            <div className="space-y-2">
              {(["FREE", "PRO", "PREMIUM"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => change(p)}
                  disabled={pending !== null}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    p === currentPlan
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:bg-secondary/70"
                  }`}
                >
                  <span className="font-medium">{p}</span>
                  {pending === p ? "..." : p === currentPlan ? "✓ atual" : "Selecionar"}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
