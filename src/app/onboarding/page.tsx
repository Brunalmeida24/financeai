"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(234 28% 7%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{
        background: "hsl(234 24% 11%)",
        border: "1px solid hsl(234 18% 18%)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "480px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
        <h1 style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "hsl(230 20% 92%)",
          fontFamily: "Space Grotesk, sans-serif",
          marginBottom: "8px",
        }}>
          Bem-vindo ao FinanceAI!
        </h1>
        <p style={{ fontSize: "14px", color: "hsl(230 12% 50%)", marginBottom: "32px" }}>
          Sua conta foi criada com sucesso!
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "hsl(252 82% 68%)",
            border: "none",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Ir para o Dashboard
        </button>
      </div>
    </div>
  );
}
