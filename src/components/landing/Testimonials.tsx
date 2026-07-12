"use client";

import { motion } from "framer-motion";

const items = [
  {
    name: "Camila",
    role: "Designer, São Paulo",
    text: "Parei de anotar gastos no caderno e meu score subiu 12 pontos em 2 meses. A IA me disse pra eu cancelar uma assinatura que eu nem lembrava mais. 💸",
    emoji: "🌸",
  },
  {
    name: "Rafael",
    role: "Dev, Belo Horizonte",
    text: "O que mais me ganhou foi o visual — não parece planilha. Parece app de banco, mas focado em mim.",
    emoji: "🚀",
  },
  {
    name: "Aline",
    role: "Professora, Salvador",
    text: "Finalmente entendi pra onde vai meu dinheiro. A meta de emergência saiu do papel.",
    emoji: "🎯",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">
            Quem usa, conta
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Histórias <span className="text-gradient">reais</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <div className="text-3xl mb-2">{t.emoji}</div>
              <blockquote className="text-sm text-foreground/90 leading-relaxed">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                <strong className="text-foreground">{t.name}</strong> · {t.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
