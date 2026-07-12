import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PlanCard } from "@/components/pricing/PlanCard";
import { FAQ } from "@/components/pricing/FAQ";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { planLabel } from "@/lib/plan";

export const metadata = {
  title: "Preços — FinanceAI",
  description:
    "Comece grátis, evolua quando quiser. Plano Pro por R$ 9,90 e Premium por R$ 19,90.",
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const currentPlan = session?.user?.plan ?? "FREE";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="pt-16 pb-10 sm:pt-24 sm:pb-16 bg-hero-gradient">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-5">
              💎 Planos simples, sem letras miúdas
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Escolha o plano que <span className="text-gradient">cabe</span>{" "}
              na sua fase
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Você está atualmente no{" "}
              <strong className="text-foreground">
                {planLabel(currentPlan)}
              </strong>
              . Faça upgrade a qualquer momento — cancele quando quiser.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard
                plan="FREE"
                emoji="🌱"
                price={0}
                tagline="Para começar a organizar sua vida financeira."
                current={currentPlan === "FREE"}
                ctaLabel="Começar grátis"
                ctaHref="/register"
                features={[
                  { text: "Dashboard básico", included: true },
                  { text: "Até 50 gastos por mês", included: true },
                  { text: "Metas (até 2 ativas)", included: true },
                  { text: "Copiloto IA", included: false },
                  { text: "Score financeiro", included: false },
                  { text: "Investimentos", included: false },
                ]}
              />
              <PlanCard
                plan="PRO"
                emoji="✨"
                price={9.9}
                tagline="Para quem quer IA, score e investimentos sem limites."
                highlight
                current={currentPlan === "PRO"}
                ctaLabel="Assinar Pro"
                ctaHref="/checkout?plan=pro"
                features={[
                  { text: "Tudo do Free, sem limites", included: true },
                  { text: "Copiloto IA (100 chats/mês)", included: true },
                  { text: "Score financeiro detalhado", included: true },
                  { text: "Carteira de investimentos", included: true },
                  { text: "Alertas inteligentes", included: true },
                  { text: "Exportar CSV", included: true },
                ]}
              />
              <PlanCard
                plan="PREMIUM"
                emoji="👑"
                price={19.9}
                tagline="Para quem quer o copiloto no modo turbo."
                current={currentPlan === "PREMIUM"}
                ctaLabel="Assinar Premium"
                ctaHref="/checkout?plan=premium"
                features={[
                  { text: "Tudo do Pro, sem limites", included: true },
                  { text: "IA ilimitada + consultoria", included: true },
                  { text: "Múltiplas contas", included: true },
                  { text: "Suporte prioritário", included: true },
                  { text: "Insights exclusivos", included: true },
                  { text: "Acesso antecipado a recursos", included: true },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TrustBadge
                emoji="🔒"
                title="Pagamento seguro"
                description="Mercado Pago e Stripe (em breve)."
              />
              <TrustBadge
                emoji="🚫"
                title="Cancele quando quiser"
                description="Sem multa, sem ligação, sem letra miúda."
              />
              <TrustBadge
                emoji="💜"
                title="Garantia 7 dias"
                description="Não gostou? Devolvemos seu dinheiro."
              />
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
