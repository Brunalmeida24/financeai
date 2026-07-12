"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multa, sem ligação. Você cancela pelo seu próprio painel, em um clique.",
  },
  {
    q: "Tem garantia?",
    a: "Sim, 7 dias de garantia. Se não gostar, devolvemos seu dinheiro — sem perguntas.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Cartão de crédito ou Pix via Mercado Pago / Stripe. A integração está em fase final e entra em vigor em breve.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Servidores no Brasil, criptografia em repouso e em trânsito, conformidade com a LGPD.",
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim, a hora que quiser. Mudou de ideia? A gente ajusta o valor proporcionalmente.",
  },
  {
    q: "Vocês compartilham meus dados?",
    a: "Nunca. Seus dados são seus. Só usamos para o app funcionar — e nada além disso.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            Perguntas <span className="text-gradient">frequentes</span>
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-secondary/30 transition"
                >
                  <span className="text-sm font-medium">{f.q}</span>
                  <span
                    className={`text-muted-foreground transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
