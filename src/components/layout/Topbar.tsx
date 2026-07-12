"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Eye, EyeOff, Sparkles, ShieldCheck, LogOut } from "lucide-react";
import { PlanBadge } from "@/components/ui/PlanBadge";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    plan?: string | null;
    role?: string | null;
  };
  balanceVisible: boolean;
  onToggleBalance: () => void;
}

export function Topbar({ user, balanceVisible, onToggleBalance }: TopbarProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <header className="glass-strong border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
      <div>
        <div className="font-display text-base sm:text-lg font-semibold text-foreground">
          {greeting}, {user.name?.split(" ")[0] ?? "por aqui"}! 👋
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleBalance}
          className="w-9 h-9 rounded-lg btn-ghost flex items-center justify-center"
          title={balanceVisible ? "Ocultar saldos" : "Mostrar saldos"}
        >
          {balanceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {user.role === "OWNER" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-success border border-success/30 text-[11px] font-semibold">
            <ShieldCheck size={12} />
            OWNER
          </span>
        ) : user.plan === "FREE" ? (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full btn-primary text-[11px] font-semibold hover:scale-105 transition"
          >
            <Sparkles size={12} />
            Fazer upgrade
          </Link>
        ) : (
          <PlanBadge plan={user.plan} />
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden sm:inline-flex w-9 h-9 rounded-lg btn-ghost items-center justify-center"
          title="Sair"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
