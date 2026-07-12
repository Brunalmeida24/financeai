"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 sm:p-12 text-center bg-hero-gradient"
        >
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Pronto pra colocar suas finanças no piloto automático?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Crie sua conta em 30 segundos. Plano Free de verdade, sem cartão.
            Se gostar, ative o Pro por R$ 9,90 quando quiser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg">✨ Criar conta grátis</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Ver planos →
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
