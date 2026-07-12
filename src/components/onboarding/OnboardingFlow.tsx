"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/onboarding/Confetti";

const steps = [
  {
    key: "welcome",
    emoji: "👋",
    title: "Bem-vindo ao FinanceAI!",
    description:
      "Seu copiloto financeiro pessoal. Vamos te mostrar tudo em 4 passos rápidos.",
    cta: "Vamos lá 🚀",
  },
  {
    key: "profile",
    emoji: "🪪",
    title: "Conte um pouco sobre você",
    description:
      "Telefone, cidade e tipo de trabalho. Usamos só pra personalizar — você controla o que compartilha.",
    cta: "Continuar",
  },
  {
    key: "first-expense",
    emoji: "💸",
    title: "Vamos registrar seu primeiro gasto",
    description:
      "Adicionar um gasto real é o jeito mais rápido de sentir o app funcionando.",
    cta: "Adicionar",
  },
  {
    key: "tour",
    emoji: "🗺️",
    title: "Tour rápido do dashboard",
    description:
      "Em 1 minuto te mostro onde fica cada coisa — Score, Metas, IA e os seus dados seguros.",
    cta: "Começar tour",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (step === 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [step]);

  async function finish() {
    await fetch("/api/user/onboarding-complete", { method: "POST" });
    router.push("/dashboard");
    router.refresh();
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <Confetti trigger={showConfetti} />

      <div className="w-full max-w-lg">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? "w-10 bg-primary"
                  : i < step
                  ? "w-6 bg-primary/50"
                  : "w-6 bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass-strong rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-4 animate-float" aria-hidden>
              {current.emoji}
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              {current.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {current.description}
            </p>

            {current.key === "profile" && <ProfileForm />}

            {current.key === "first-expense" && <ExpenseForm />}

            {current.key === "tour" && <TourTips />}

            <div className="flex items-center justify-between gap-2 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isLast ? finish() : router.push("/dashboard"))}
              >
                Pular
              </Button>
              <Button
                onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
                size="lg"
              >
                {isLast ? "Ir pro dashboard ✨" : current.cta}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProfileForm() {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/user/phone", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
    } catch {
      // best-effort: seguimos
    }
    setSaving(false);
  }

  return (
    <div className="space-y-2 text-left">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={save}
        placeholder="📱 Seu telefone (opcional)"
        className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
      />
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="📍 Sua cidade (opcional)"
        className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
      />
      <p className="text-[11px] text-muted-foreground">
        🔒 Usamos só pra personalizar. Não compartilhamos.
      </p>
      {saving && (
        <p className="text-[11px] text-primary">Salvando...</p>
      )}
    </div>
  );
}

function ExpenseForm() {
  const [title, setTitle] = useState("Almoço");
  const [amount, setAmount] = useState("25");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function add() {
    setSaving(true);
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category: "FOOD",
          date: new Date().toISOString().split("T")[0],
          paymentMethod: "PIX",
          isRecurring: false,
        }),
      });
      setDone(true);
    } catch {
      // best-effort
    }
    setSaving(false);
  }

  if (done) {
    return (
      <div className="rounded-xl bg-success/10 border border-success/30 p-3 text-sm text-success">
        ✅ Gasto registrado! Você pode adicionar mais no dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-2 text-left">
      <div className="grid grid-cols-3 gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Descrição"
          className="col-span-2 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="R$"
          className="px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
        />
      </div>
      <Button onClick={add} loading={saving} size="sm" className="w-full">
        💸 Adicionar gasto
      </Button>
    </div>
  );
}

function TourTips() {
  const tips = [
    { e: "⭐", t: "Score financeiro: quanto mais alto, melhor sua saúde." },
    { e: "🎯", t: "Metas: sonhe grande, acompanhe pequeno." },
    { e: "🤖", t: "IA Copiloto: pergunte qualquer coisa sobre suas finanças." },
    { e: "🔒", t: "Seus dados ficam seguros, só você acessa." },
  ];
  return (
    <div className="space-y-2 text-left">
      {tips.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border p-2.5"
        >
          <span className="text-2xl">{t.e}</span>
          <span className="text-sm">{t.t}</span>
        </div>
      ))}
    </div>
  );
}
