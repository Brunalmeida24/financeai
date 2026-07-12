"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

const categories = [
  { value: "FOOD", label: "🍔 Alimentação" },
  { value: "HOUSING", label: "🏠 Moradia" },
  { value: "TRANSPORT", label: "🚗 Transporte" },
  { value: "HEALTH", label: "💊 Saúde" },
  { value: "EDUCATION", label: "📚 Educação" },
  { value: "ENTERTAINMENT", label: "🎬 Lazer" },
  { value: "CLOTHING", label: "👕 Vestuário" },
  { value: "SUBSCRIPTIONS", label: "📱 Assinaturas" },
  { value: "TRAVEL", label: "✈️ Viagem" },
  { value: "PETS", label: "🐶 Pets" },
  { value: "GIFTS", label: "🎁 Presentes" },
  { value: "DEBT", label: "💳 Dívidas" },
  { value: "OTHER", label: "📦 Outros" },
];

const paymentMethods = [
  { value: "PIX", label: "⚡ Pix" },
  { value: "CREDIT_CARD", label: "💳 Crédito" },
  { value: "DEBIT_CARD", label: "💳 Débito" },
  { value: "CASH", label: "💵 Dinheiro" },
  { value: "TRANSFER", label: "🏦 Transferência" },
  { value: "BOLETO", label: "🧾 Boleto" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "PIX",
    isRecurring: false,
  });

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  async function fetchExpenses() {
    setLoading(true);
    const res = await fetch(`/api/expenses?month=${month}&year=${year}`);
    const data = await res.json();
    setExpenses(data.expenses || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  useEffect(() => {
    fetchExpenses();
  }, [month, year]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setUpgradeError(null);
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({
        title: "",
        amount: "",
        category: "FOOD",
        date: new Date().toISOString().split("T")[0],
        description: "",
        paymentMethod: "PIX",
        isRecurring: false,
      });
      fetchExpenses();
    } else {
      const data = await res.json();
      if (res.status === 402) {
        setUpgradeError(data.error);
      } else {
        setUpgradeError(data.error || "Erro ao salvar");
      }
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">💸 Gastos</h1>
          <p className="text-sm text-muted-foreground">
            Controle todas as suas despesas
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm"
          >
            {[
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ].map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button onClick={() => setShowForm(true)}>+ Adicionar</Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Total de gastos do mês
            </div>
            <div className="text-3xl font-display font-bold text-destructive">
              {formatCurrency(total)}
            </div>
          </div>
          <Badge variant="muted">
            {expenses.length} transação{expenses.length !== 1 ? "ões" : ""}
          </Badge>
        </div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold">💸 Adicionar gasto</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Descrição">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Almoço, Uber, Netflix..."
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Valor (R$)">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0,00"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                  />
                </Field>
                <Field label="Data">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                  />
                </Field>
              </div>

              <Field label="Categoria">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Forma de pagamento">
                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                >
                  {paymentMethods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Descrição (opcional)">
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Detalhes adicionais..."
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isRecurring}
                  onChange={(e) =>
                    setForm({ ...form, isRecurring: e.target.checked })
                  }
                />
                Gasto recorrente (mensal)
              </label>

              {upgradeError && (
                <div className="rounded-xl border border-warning/30 bg-warning/10 text-warning text-sm p-3">
                  {upgradeError}{" "}
                  <a
                    href="/pricing"
                    className="underline font-semibold ml-1"
                  >
                    Fazer upgrade →
                  </a>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  className="flex-1"
                >
                  Salvar gasto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            ⏳ Carregando...
          </div>
        ) : expenses.length === 0 ? (
          <EmptyState
            emoji="💸"
            title="Nenhum gasto registrado"
            description='Clique em "+ Adicionar" para registrar seu primeiro gasto.'
          />
        ) : (
          <div>
            {expenses.map((e) => {
              const cat = categories.find((c) => c.value === e.category);
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-3 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg flex-shrink-0">
                    {cat?.label.split(" ")[0] ?? "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{e.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {cat?.label.split(" ").slice(1).join(" ")} ·{" "}
                      {formatDate(e.date)} · {e.paymentMethod}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-destructive flex-shrink-0">
                    -{formatCurrency(Number(e.amount))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
