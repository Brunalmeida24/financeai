"use client";

import { motion } from "framer-motion";

const features = [
  {
    emoji: "🤖",
    title: "Copiloto IA 24h",
    description:
      "Pergunte, planeje, descubra. A IA entende seu contexto financeiro e responde em português claro.",
  },
  {
    emoji: "📊",
    title: "Dashboard vivo",
    description:
      "Score financeiro, gastos por categoria, tendências. Tudo em um painel que respira.",
  },
  {
    emoji: "💸",
    title: "Gastos e receitas",
    description:
      "Registre em segundos, classifique por emoji, filtre por mês, forma de pagamento, recorrência.",
  },
  {
    emoji: "🎯",
    title: "Metas com progresso",
    description:
      "Viagem, emergência, carro. Acompanhe o quanto já guardou e quanto falta — com motivação diária.",
  },
  {
    emoji: "📈",
    title: "Investimentos",
    description:
      "Tesouro, CDB, FIIs, cripto. Veja a rentabilidade e o patrimônio num lugar só.",
  },
  {
    emoji: "❤️",
    title: "Saúde financeira",
    description:
      "Sinalizamos quando algo está fora do padrão. Você vê o problema antes de virar bola de neve.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">
            Recursos
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Tudo que você precisa,{" "}
            <span className="text-gradient">sem complicação</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pensado para quem quer clareza, não planilhas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-display font-semibold text-base mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
