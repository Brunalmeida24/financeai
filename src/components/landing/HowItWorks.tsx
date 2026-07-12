"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "1",
    e: "📝",
    title: "Crie sua conta em 30s",
    description: "E-mail e senha. Sem cartão. Só pra começar.",
  },
  {
    n: "2",
    e: "💸",
    title: "Adicione seu primeiro gasto",
    description: "Com emoji, categoria e forma de pagamento. Rápido.",
  },
  {
    n: "3",
    e: "🤖",
    title: "Converse com a IA",
    description: "Pergunte onde está vazando dinheiro. Ela responde.",
  },
  {
    n: "4",
    e: "🎯",
    title: "Crie metas e evolua",
    description: "Reserva de emergência, viagem, carro. Acompanhe.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">
            Como funciona
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Em 4 passos você já está{" "}
            <span className="text-gradient">no controle</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative glass rounded-2xl p-5"
            >
              <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full btn-primary flex items-center justify-center text-sm font-bold">
                {s.n}
              </div>
              <div className="text-3xl mb-3 mt-2">{s.e}</div>
              <h3 className="font-display font-semibold text-base mb-1">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
