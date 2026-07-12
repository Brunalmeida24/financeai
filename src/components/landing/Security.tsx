import { TrustBadge } from "@/components/ui/TrustBadge";

const items = [
  {
    emoji: "🔒",
    title: "Criptografia em trânsito e em repouso",
    description:
      "Tudo é trafegado via HTTPS. No banco, as senhas vão com bcrypt e os dados sensíveis com criptografia do Supabase.",
  },
  {
    emoji: "🛡️",
    title: "Conformidade com a LGPD",
    description:
      "Você é dono dos seus dados. Pedimos só o necessário e te explicamos por quê.",
  },
  {
    emoji: "🇧🇷",
    title: "Servidores no Brasil",
    description:
      "Seus dados ficam no Supabase em região sul-americana. Latência baixa, lei brasileira.",
  },
  {
    emoji: "🙅",
    title: "Sem cartão pra começar",
    description:
      "Plano Free de verdade, sem precisar cadastrar cartão. Você só paga se quiser mais.",
  },
  {
    emoji: "🚫",
    title: "Nada de spam, nada de venda de dados",
    description:
      "Seu telefone só é usado se você pedir suporte. Jamais repassamos para terceiros.",
  },
  {
    emoji: "🧯",
    title: "Botão de pânico + logout remoto",
    description:
      "Saia de todos os dispositivos com um clique. Bloqueie a conta se perder o celular.",
  },
];

export function Security() {
  return (
    <section id="security" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">
            Segurança
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Pensado para você se sentir{" "}
            <span className="text-gradient">seguro</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Dados financeiros são sensíveis. Por isso a segurança vem antes
            do visual — não depois.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((i) => (
            <TrustBadge
              key={i.title}
              emoji={i.emoji}
              title={i.title}
              description={i.description}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
