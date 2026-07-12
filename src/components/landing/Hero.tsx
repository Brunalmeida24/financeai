"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "transações analisadas", value: "12.4k+", emoji: "💸" },
  { label: "score médio dos usuários", value: "+18 pts", emoji: "📈" },
  { label: "satisfação", value: "4.9/5", emoji: "⭐" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
            <span>🔒 Criptografia + LGPD desde o primeiro dia</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Suas finanças, no
            <span className="text-gradient"> piloto automático </span>
            com IA.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            O FinanceAI é seu copiloto financeiro pessoal — registra gastos,
            entende seus hábitos, calcula seu score e te dá conselhos
            práticos. Tudo em um app bonito, dinâmico e seguro.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                🚀 Começar grátis
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Ver planos →
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Sem cartão de crédito. Cancele quando quiser. 🇧🇷 Feito para o
            Brasil.
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xl font-display font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Preview flutuante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="glass-strong rounded-3xl p-2 shadow-2xl shadow-black/40">
            <div className="rounded-2xl bg-gradient-to-br from-card to-background p-6 sm:p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Saldo do mês
                  </div>
                  <div className="text-3xl sm:text-4xl font-display font-bold text-gradient">
                    R$ 3.847,62
                  </div>
                </div>
                <div className="text-4xl animate-float">💰</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { e: "📈", l: "Receitas", v: "R$ 6.200" },
                  { e: "💸", l: "Gastos", v: "R$ 2.352" },
                  { e: "🎯", l: "Meta férias", v: "68%" },
                  { e: "⭐", l: "Score", v: "82/100" },
                ].map((k) => (
                  <div
                    key={k.l}
                    className="rounded-xl bg-secondary/50 p-3 border border-border"
                  >
                    <div className="text-xl mb-1">{k.e}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {k.l}
                    </div>
                    <div className="text-sm font-semibold mt-0.5">{k.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
