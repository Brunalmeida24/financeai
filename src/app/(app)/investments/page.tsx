"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

const investmentTypes = [
  { value: "TESOURO_SELIC", label: "🏛️ Tesouro Selic" },
  { value: "TESOURO_IPCA", label: "🏛️ Tesouro IPCA+" },
  { value: "TESOURO_PREFIXADO", label: "🏛️ Tesouro Prefixado" },
  { value: "CDB", label: "🏦 CDB" },
  { value: "LCI", label: "🏦 LCI" },
  { value: "LCA", label: "🏦 LCA" },
  { value: "FUND", label: "📊 Fundo de Investimento" },
  { value: "ETF", label: "📈 ETF" },
  { value: "STOCK", label: "📈 Ações" },
  { value: "FII", label: "🏢 Fundo Imobiliário" },
  { value: "CRYPTO", label: "₿ Cripto" },
  { value: "SAVINGS", label: "💰 Poupança" },
  { value: "OTHER", label: "📦 Outro" },
];

const s = (v: string) => `hsl(${v})`;

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "CDB", institution: "",
    investedAmount: "", currentValue: "",
    annualRate: "", purchaseDate: new Date().toISOString().split("T")[0],
    maturityDate: "", notes: "",
  });

  async function fetchInvestments() {
    setLoading(true);
    const res = await fetch("/api/investments");
    const data = await res.json();
    setInvestments(data.investments || []);
    setLoading(false);
  }

  useEffect(() => { fetchInvestments(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        investedAmount: Number(form.investedAmount),
        currentValue: Number(form.currentValue || form.investedAmount),
        annualRate: form.annualRate ? Number(form.annualRate) / 100 : undefined,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      fetchInvestments();
    }
    setSubmitting(false);
  }

  const totalInvested = investments.reduce((s, i) => s + Number(i.investedAmount), 0);
  const totalCurrent = investments.reduce((s, i) => s + Number(i.currentValue), 0);
  const totalReturn = totalCurrent - totalInvested;

  const inputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: "8px",
    background: s("234 20% 14%"), border: `1px solid ${s("234 18% 22%")}`,
    color: s("230 20% 92%"), fontSize: "13px", outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = { fontSize: "12px", fontWeight: "500" as const, color: s("230 12% 60%"), marginBottom: "4px", display: "block" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>📈 Investimentos</h1>
          <p style={{ fontSize: "13px", color: s("230 12% 50%"), marginTop: "2px" }}>Acompanhe sua carteira de investimentos</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: s("252 82% 68%"), color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          + Adicionar
        </button>
      </div>

      {/* RESUMO */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Total Investido", value: totalInvested, color: s("230 20% 92%") },
          { label: "Valor Atual", value: totalCurrent, color: s("252 82% 68%") },
          { label: "Rendimento", value: totalReturn, color: totalReturn >= 0 ? s("142 71% 45%") : s("0 72% 61%") },
        ].map(card => (
          <div key={card.label} style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: s("230 12% 50%"), marginBottom: "6px" }}>{card.label}</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: card.color, fontFamily: "Space Grotesk, sans-serif" }}>
              {formatCurrency(card.value)}
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>Adicionar Investimento</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: s("230 12% 50%"), cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: CDB Nubank, Tesouro Selic 2029..." required style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                    {investmentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Instituição</label>
                  <input value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} placeholder="Nubank, XP, Rico..." style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Valor investido (R$)</label>
                  <input type="number" step="0.01" min="0.01" value={form.investedAmount} onChange={e => setForm({ ...form, investedAmount: e.target.value })} placeholder="0,00" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Valor atual (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.currentValue} onChange={e => setForm({ ...form, currentValue: e.target.value })} placeholder="Deixe vazio = mesmo valor" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Taxa a.a. (%)</label>
                  <input type="number" step="0.01" value={form.annualRate} onChange={e => setForm({ ...form, annualRate: e.target.value })} placeholder="Ex: 14.75" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Data compra</label>
                  <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Vencimento</label>
                  <input type="date" value={form.maturityDate} onChange={e => setForm({ ...form, maturityDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: s("234 20% 16%"), border: `1px solid ${s("234 18% 22%")}`, color: s("230 12% 60%"), cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Cancelar</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: s("252 82% 68%"), border: "none", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA */}
      <div style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "12px", padding: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: s("230 12% 50%") }}>Carregando...</div>
        ) : investments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📈</div>
            <div style={{ fontSize: "14px", fontWeight: "500", color: s("230 20% 70%"), marginBottom: "4px" }}>Nenhum investimento registrado</div>
            <div style={{ fontSize: "12px", color: s("230 12% 40%") }}>Adicione seus investimentos para acompanhar sua carteira</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {investments.map((inv) => {
              const ret = Number(inv.currentValue) - Number(inv.investedAmount);
              const retPct = (ret / Number(inv.investedAmount)) * 100;
              return (
                <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: s("234 20% 14%"), borderRadius: "8px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: s("234 18% 20%"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                    {investmentTypes.find(t => t.value === inv.type)?.label.split(" ")[0] || "📦"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: s("230 20% 92%") }}>{inv.name}</div>
                    <div style={{ fontSize: "11px", color: s("230 12% 45%") }}>
                      {inv.institution || inv.type} {inv.annualRate ? `· ${(Number(inv.annualRate) * 100).toFixed(2)}% a.a.` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>{formatCurrency(Number(inv.currentValue))}</div>
                    <div style={{ fontSize: "11px", color: ret >= 0 ? s("142 71% 45%") : s("0 72% 61%") }}>
                      {ret >= 0 ? "+" : ""}{formatCurrency(ret)} ({retPct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}