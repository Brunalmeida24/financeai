"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

const goalTypes = [
  { value: "EMERGENCY_FUND", label: "🛡️ Reserva de Emergência" },
  { value: "TRAVEL", label: "✈️ Viagem" },
  { value: "VEHICLE", label: "🚗 Veículo" },
  { value: "REAL_ESTATE", label: "🏠 Imóvel" },
  { value: "EDUCATION", label: "📚 Educação" },
  { value: "RETIREMENT", label: "👴 Aposentadoria" },
  { value: "DEBT_PAYMENT", label: "💳 Quitar Dívida" },
  { value: "OTHER", label: "🎯 Outro" },
];

const s = (v: string) => `hsl(${v})`;

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", emoji: "🎯", type: "OTHER",
    targetAmount: "", currentAmount: "0",
    targetDate: "", monthlyContribution: "",
    description: "", priority: 1,
  });

  async function fetchGoals() {
    setLoading(true);
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data.goals || []);
    setLoading(false);
  }

  useEffect(() => { fetchGoals(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount),
        monthlyContribution: form.monthlyContribution ? Number(form.monthlyContribution) : undefined,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ title: "", emoji: "🎯", type: "OTHER", targetAmount: "", currentAmount: "0", targetDate: "", monthlyContribution: "", description: "", priority: 1 });
      fetchGoals();
    }
    setSubmitting(false);
  }

  const inputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: "8px",
    background: s("234 20% 14%"), border: `1px solid ${s("234 18% 22%")}`,
    color: s("230 20% 92%"), fontSize: "13px", outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = { fontSize: "12px", fontWeight: "500" as const, color: s("230 12% 60%"), marginBottom: "4px", display: "block" };

  const emojis = ["🎯", "🛡️", "✈️", "🚗", "🏠", "📚", "👴", "💳", "💰", "🌟"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>
            🎯 Metas Financeiras
          </h1>
          <p style={{ fontSize: "13px", color: s("230 12% 50%"), marginTop: "2px" }}>
            Defina e acompanhe seus objetivos
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: s("252 82% 68%"), color: "#fff", border: "none",
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
          fontWeight: "600", cursor: "pointer",
        }}>
          + Nova Meta
        </button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>Nova Meta</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: s("230 12% 50%"), cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Emoji</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {emojis.map(e => (
                    <button key={e} type="button" onClick={() => setForm({ ...form, emoji: e })}
                      style={{ fontSize: "20px", padding: "4px 8px", borderRadius: "6px", border: `2px solid ${form.emoji === e ? s("252 82% 68%") : "transparent"}`, background: s("234 20% 16%"), cursor: "pointer" }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Nome da meta</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Reserva de emergência, Viagem Europa..." required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  {goalTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Valor alvo (R$)</label>
                  <input type="number" step="0.01" min="1" value={form.targetAmount}
                    onChange={e => setForm({ ...form, targetAmount: e.target.value })}
                    placeholder="0,00" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Já tenho (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.currentAmount}
                    onChange={e => setForm({ ...form, currentAmount: e.target.value })}
                    placeholder="0,00" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Data alvo</label>
                  <input type="date" value={form.targetDate}
                    onChange={e => setForm({ ...form, targetDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Contribuição mensal (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.monthlyContribution}
                    onChange={e => setForm({ ...form, monthlyContribution: e.target.value })}
                    placeholder="0,00" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: s("234 20% 16%"), border: `1px solid ${s("234 18% 22%")}`, color: s("230 12% 60%"), cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Cancelar</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: s("252 82% 68%"), border: "none", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Salvando..." : "Criar meta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE METAS */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: s("230 12% 50%") }}>Carregando...</div>
      ) : goals.length === 0 ? (
        <div style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "12px", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎯</div>
          <div style={{ fontSize: "14px", fontWeight: "500", color: s("230 20% 70%"), marginBottom: "4px" }}>Nenhuma meta criada ainda</div>
          <div style={{ fontSize: "12px", color: s("230 12% 40%") }}>Clique em "+ Nova Meta" para começar</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {goals.map((goal) => {
            const pct = Math.min(Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100), 100);
            const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
            return (
              <div key={goal.id} style={{ background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`, borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{goal.emoji}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: s("230 20% 92%") }}>{goal.title}</div>
                    <div style={{ fontSize: "11px", color: s("230 12% 45%") }}>
                      {goalTypes.find(t => t.value === goal.type)?.label.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: "18px", fontWeight: "700", color: s("252 82% 68%"), fontFamily: "Space Grotesk, sans-serif" }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ height: "6px", background: s("234 18% 20%"), borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? s("142 71% 45%") : s("252 82% 68%"), borderRadius: "3px", transition: "width 0.7s" }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: s("230 12% 55%") }}>
                    {formatCurrency(Number(goal.currentAmount))} / {formatCurrency(Number(goal.targetAmount))}
                  </span>
                  <span style={{ color: s("0 72% 61%") }}>Faltam {formatCurrency(remaining)}</span>
                </div>
                {goal.monthlyContribution && (
                  <div style={{ fontSize: "11px", color: s("230 12% 45%"), marginTop: "6px" }}>
                    💰 {formatCurrency(Number(goal.monthlyContribution))}/mês
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}