"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { PlanKey } from "@/lib/plan";

interface PlanCardProps {
  plan: PlanKey;
  emoji: string;
  price: number;
  tagline: string;
  features: { text: string; included: boolean }[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  current?: boolean;
}

export function PlanCard({
  plan,
  emoji,
  price,
  tagline,
  features,
  ctaLabel,
  ctaHref,
  highlight = false,
  current = false,
}: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl p-6 ${
        highlight
          ? "glass-strong bg-hero-gradient border-2 border-primary/40 shadow-2xl shadow-primary/10"
          : "glass"
      } ${current ? "ring-2 ring-success/40" : ""}`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full btn-primary text-[11px] font-semibold">
            ⭐ Mais escolhido
          </span>
        </div>
      )}
      {current && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-[11px] font-semibold border border-success/30">
            ✓ Seu plano atual
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{emoji}</span>
        <h3 className="font-display text-lg font-bold">
          {plan === "FREE" ? "Free" : plan === "PRO" ? "Pro" : "Premium"}
        </h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4 min-h-[32px]">
        {tagline}
      </p>

      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-display font-bold">
          {price === 0 ? "R$ 0" : formatCurrency(price)}
        </span>
        {price > 0 && (
          <span className="text-sm text-muted-foreground">/mês</span>
        )}
      </div>

      <Link href={ctaHref} className="block">
        <Button
          variant={highlight ? "primary" : "outline"}
          className="w-full"
          size="lg"
        >
          {ctaLabel}
        </Button>
      </Link>

      <ul className="mt-6 space-y-2.5">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-sm ${
              f.included ? "text-foreground" : "text-muted-foreground/60"
            }`}
          >
            <span
              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                f.included
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground/50"
              }`}
            >
              {f.included ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <X size={11} strokeWidth={3} />
              )}
            </span>
            {f.text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
