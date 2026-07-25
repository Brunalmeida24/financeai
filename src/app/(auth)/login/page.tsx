"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
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
      setError("Email ou senha incorretos. Verifique seus dados.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "hsl(234 20% 14%)",
    border: "1px solid hsl(234 18% 22%)",
    color: "hsl(230 20% 92%)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(234 28% 7%)",
      display: "flex",
      fontFamily: "DM Sans, sans-serif",
    }}>
      {/* LEFT */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "linear-gradient(135deg, hsl(252 50% 12%) 0%, hsl(234 28% 9%) 100%)",
      }}>
        <div style={{ maxWidth: "400px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>💰</div>
          <h1 style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "hsl(230 20% 92%)",
            fontFamily: "Space Grotesk, sans-serif",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}>
            Suas finanças, no <span style={{ color: "hsl(252 82% 68%)" }}>piloto automático</span>
          </h1>
          <p style={{ fontSize: "16px", color: "hsl(230 12% 55%)", lineHeight: 1.6 }}>
            O copiloto financeiro que entende você. IA, score, metas e investimentos em um só app.
          </p>
          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "🔐", title: "Criptografado de ponta a ponta", desc: "HTTPS + bcrypt + LGPD" },
              { icon: "🇧🇷", title: "Servidores no Brasil", desc: "Latência baixa, lei brasileira" },
            ].map(item => (
              <div key={item.title} style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "16px", background: "hsl(234 24% 13%)",
                border: "1px solid hsl(234 18% 20%)", borderRadius: "12px", textAlign: "left",
              }}>
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "hsl(230 20% 88%)" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "hsl(230 12% 50%)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{
        width: "480px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "hsl(234 24% 9%)",
        borderLeft: "1px solid hsl(234 18% 16%)",
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "48px", height: "48px",
              background: "hsl(252 82% 68%)",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", margin: "0 auto 16px",
            }}>💰</div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "hsl(230 20% 92%)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "4px" }}>
              Bem-vindo de volta 👋
            </h2>
            <p style={{ fontSize: "13px", color: "hsl(230 12% 50%)" }}>Entre na sua conta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "hsl(230 12% 60%)", marginBottom: "6px", display: "block" }}>
                📧 E-mail
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "hsl(230 12% 60%)", marginBottom: "6px", display: "block" }}>
                🔑 Senha
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
            </div>

            {error && (
              <div style={{
                background: "hsl(0 72% 15%)",
                border: "1px solid hsl(0 72% 30%)",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "hsl(0 72% 71%)",
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px",
              borderRadius: "10px",
              background: "hsl(252 82% 68%)",
              border: "none", color: "#fff",
              fontSize: "14px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Entrando..." : "💎 Entrar na conta"}
            </button>

            <div style={{ position: "relative", textAlign: "center", margin: "4px 0" }}>
              <div style={{ height: "1px", background: "hsl(234 18% 20%)", position: "absolute", top: "50%", left: 0, right: 0 }}></div>
              <span style={{ position: "relative", background: "hsl(234 24% 9%)", padding: "0 12px", fontSize: "12px", color: "hsl(230 12% 40%)" }}>ou continue com</span>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "10px",
                background: "transparent",
                border: "1px solid hsl(234 18% 25%)",
                color: "hsl(230 20% 80%)",
                fontSize: "14px", fontWeight: 600,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "hsl(230 12% 45%)", marginTop: "20px" }}>
            Ainda não tem conta?{" "}
            <Link href="/register" style={{ color: "hsl(252 82% 68%)", fontWeight: 600, textDecoration: "none" }}>
              Criar conta grátis ✨
            </Link>
          </p>

          <p style={{ textAlign: "center", fontSize: "11px", color: "hsl(230 12% 35%)", marginTop: "16px" }}>
            🔒 Sua senha é criptografada. Nunca armazenamos em texto puro.
          </p>
        </div>
      </div>
    </div>
  );
}