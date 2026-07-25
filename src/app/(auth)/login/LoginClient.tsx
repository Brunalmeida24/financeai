"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { GoogleButton } from "@/components/auth/GoogleButton";

export function LoginClient({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const search = useSearchParams();
  const nextUrl = search.get("next") || "/dashboard";
  const suspendedFlag = search.get("suspended") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      // Forçamos lowercase no client também — defesa em profundidade.
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      // NextAuth não passa o motivo pelo callback. O backend loga; aqui
      // damos uma mensagem útil.
      setError("E-mail ou senha incorretos. Confira e tente novamente.");
      setLoading(false);
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-hero-gradient">
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

            {suspendedFlag && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm p-3 mb-4">
                Sua conta está temporariamente suspensa. Fale com o suporte para
                reativar.
              </div>
            )}

            {googleEnabled && (
              <>
                <GoogleButton
                  mode="signin"
                  callbackUrl={nextUrl}
                />
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    ou
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

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
                  autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-muted-foreground">
                    🔑 Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Em breve: recuperação de senha por e-mail.")}
                    className="text-[11px] text-primary hover:text-primary/80"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-muted border border-border text-sm focus-glow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg btn-ghost flex items-center justify-center"
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
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
