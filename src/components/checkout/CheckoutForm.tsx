"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface CheckoutFormProps {
  planKey: "PRO" | "PREMIUM";
  planLabel: string;
  price: number;
}

/**
 * Checkout simulado — estrutura pronta pra plugar Mercado Pago / Stripe.
 * Quando o provider for plugado, a gente só troca o handler do submit.
 */
export function CheckoutForm({ planKey, planLabel, price }: CheckoutFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível processar");
        setLoading(false);
        return;
      }
      router.push(`/dashboard?upgraded=${planKey.toLowerCase()}`);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div>
        <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
          Forma de pagamento
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { v: "pix", l: "Pix", e: "⚡" },
            { v: "card", l: "Cartão", e: "💳" },
          ].map((m) => (
            <button
              key={m.v}
              type="button"
              onClick={() => setMethod(m.v as any)}
              className={`p-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
                method === m.v
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/70"
              }`}
            >
              <span>{m.e}</span>
              {m.l}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Integração com Mercado Pago e Stripe chegando em breve. Por
          enquanto, esta é uma simulação para você experimentar.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground font-medium mb-1">
          📝 Resumo do pedido
        </div>
        Você está contratando o plano <strong>{planLabel}</strong> por{" "}
        <strong>R$ {price.toFixed(2).replace(".", ",")}/mês</strong>. Cancele
        quando quiser, sem multa.
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        loading={loading}
        className="w-full"
      >
        {loading ? "Processando..." : `✨ Confirmar assinatura`}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        Ao continuar, você concorda com nossos Termos de Uso e Política de
        Privacidade.
      </p>
    </form>
  );
}
