import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { TrustBadge } from "@/components/ui/TrustBadge";

const PLANS = {
  pro: {
    key: "PRO" as const,
    label: "Pro",
    emoji: "✨",
    price: 9.9,
    description: "IA, score, investimentos, export e muito mais.",
  },
  premium: {
    key: "PREMIUM" as const,
    label: "Premium",
    emoji: "👑",
    price: 19.9,
    description: "Tudo do Pro + IA ilimitada, multi-conta e consultoria.",
  },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const sp = await searchParams;
    redirect(`/login?next=/checkout?plan=${sp?.plan ?? "pro"}`);
  }
  const sp = await searchParams;
  const planKey = sp?.plan === "premium" ? "premium" : "pro";
  const plan = PLANS[planKey];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-5xl mb-3">{plan.emoji}</div>
            <h1 className="font-display text-3xl font-bold">
              Quase lá! Finalize sua assinatura
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Você está assinando o plano{" "}
              <strong className="text-foreground">{plan.label}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <CheckoutForm planKey={plan.key} planLabel={plan.label} price={plan.price} />
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
                  Resumo
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>
                    {plan.emoji} Plano {plan.label}
                  </span>
                  <span className="font-semibold">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {plan.description}
                </div>
                <hr className="my-4 border-border" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total hoje</span>
                  <span className="text-gradient text-lg">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Cobrado mensalmente. Cancele quando quiser.
                </div>
              </div>

              <TrustBadge
                emoji="🔒"
                title="Pagamento 100% seguro"
                description="Mercado Pago e Stripe. Seus dados nunca tocam nosso servidor."
              />
              <TrustBadge
                emoji="🛡️"
                title="Garantia de 7 dias"
                description="Não gostou? Devolvemos sem perguntas."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
