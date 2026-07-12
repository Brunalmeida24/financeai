"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextUrl = search.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos");
      setLoading(false);
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-hero-gradient">
      {/* Lado esquerdo: branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative overflow-hidden">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4 animate-float">💰</div>
          <h1 className="font-display text-4xl font-bold mb-3">
            Suas finanças, no{" "}
            <span className="text-gradient">piloto automático</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            O copiloto financeiro que entende você. IA, score, metas e
            investimentos em um só app.
          </p>
          <div className="space-y-2">
            <TrustBadge
              emoji="🔒"
              title="Criptografado de ponta a ponta"
              description="HTTPS + bcrypt + LGPD"
            />
            <TrustBadge
              emoji="🇧🇷"
              title="Servidores no Brasil"
              description="Latência baixa, lei brasileira"
            />
          </div>
        </div>
      </div>

      {/* Lado direito: form */}
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
              Bem-vindo de volta 👋
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Entre na sua conta para continuar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                  placeholder="••••••••"
                  required
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
                {loading ? "Entrando..." : "🔓 Entrar na conta"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-5">
              Ainda não tem conta?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Criar conta grátis ✨
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            🔒 Sua senha é criptografada. Nunca armazenamos em texto puro.
          </p>
        </div>
      </div>
    </div>
  );
}
