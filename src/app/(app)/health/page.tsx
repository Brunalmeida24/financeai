export default function HealthPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "hsl(230 20% 92%)", fontFamily: "Space Grotesk, sans-serif" }}>
          ❤️ Saúde Financeira
        </h1>
        <p style={{ fontSize: "13px", color: "hsl(230 12% 50%)", marginTop: "2px" }}>
          Seu score e análise financeira completa
        </p>
      </div>
      <div style={{ background: "hsl(234 24% 11%)", border: "1px solid hsl(234 18% 18%)", borderRadius: "12px", padding: "60px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>❤️</div>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "hsl(230 20% 80%)", marginBottom: "8px" }}>Em desenvolvimento</div>
        <div style={{ fontSize: "13px", color: "hsl(230 12% 45%)" }}>Adicione gastos e receitas para calcular seu score financeiro</div>
      </div>
    </div>
  );
}