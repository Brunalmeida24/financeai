"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-hero-gradient">
      <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative overflow-hidden">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <h1 className="font-display text-4xl font-bold mb-3">
            Comece <span className="text-gradient">grátis</span> hoje
          </h1>
          <p className="text-muted-foreground mb-6">
            Em 30 segundos você tem um copiloto financeiro que te entende.
            Sem cartão, sem compromisso.
          </p>
          <div className="space-y-2">
            <TrustBadge
              emoji="🌱"
              title="Plano Free pra sempre"
              description="Sem cartão, sem pegadinha"
            />
            <TrustBadge
              emoji="🔒"
              title="Seus dados são só seus"
              description="Não compartilhamos com ninguém"
            />
            <TrustBadge
              emoji="🚫"
              title="Cancele quando quiser"
              description="Sem multa, sem ligação"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl btn-primary text-2xl mb-3">
              💰
            </div>
            <h1 className="font-display text-2xl font-bold">FinanceAI</h1>
          </div>

          <div className="glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            <h2 className="font-display text-xl font-semibold mb-1">
              Criar conta grátis ✨
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Sem cartão, sem pegadinha. Cancele quando quiser.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  👤 Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  📧 E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  🔑 Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Criando..." : "🚀 Criar conta grátis"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-5">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Entrar
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            Ao criar conta você concorda com nossos{" "}
            <span className="text-primary cursor-pointer">Termos de Uso</span>.
            🔒 LGPD compliant.
          </p>
        </div>
      </div>
    </div>
  );
}
