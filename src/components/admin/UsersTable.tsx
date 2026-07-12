"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateRelative } from "@/lib/utils";
import { Search, Mail, ExternalLink, ArrowUpDown } from "lucide-react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  plan: "FREE" | "PRO" | "PREMIUM";
  role: "USER" | "OWNER";
  lastLoginAt: string | null;
  createdAt: string;
  totalExpenses: number;
  totalIncome: number;
  expenseCount: number;
}

type SortKey = "name" | "plan" | "lastLoginAt" | "totalExpenses";

export function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<"ALL" | "FREE" | "PRO" | "PREMIUM">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("lastLoginAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [contacting, setContacting] = useState<AdminUser | null>(null);
  const [contactMsg, setContactMsg] = useState("");
  const [contactSending, setContactSending] = useState(false);

  const filtered = useMemo(() => {
    let r = users;
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.name?.toLowerCase().includes(q) ?? false) ||
          (u.phone?.includes(q) ?? false)
      );
    }
    if (plan !== "ALL") r = r.filter((u) => u.plan === plan);
    r = [...r].sort((a, b) => {
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];
      const cmp = (va ?? "") < (vb ?? "") ? -1 : (va ?? "") > (vb ?? "") ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [users, query, plan, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  async function sendContact() {
    if (!contacting || !contactMsg.trim()) return;
    setContactSending(true);
    try {
      await fetch(`/api/admin/users/${contacting.id}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Mensagem do FinanceAI",
          message: contactMsg,
        }),
      });
      setContacting(null);
      setContactMsg("");
    } finally {
      setContactSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={14}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
          />
        </div>
        <div className="flex gap-1.5">
          {(["ALL", "FREE", "PRO", "PREMIUM"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                plan === p
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "ALL" ? "Todos" : p}
            </button>
          ))}
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] text-muted-foreground uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Cliente <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="text-left p-3 font-semibold hidden md:table-cell">
                  Telefone
                </th>
                <th className="text-left p-3 font-semibold">
                  <button
                    onClick={() => toggleSort("plan")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Plano <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="text-right p-3 font-semibold">
                  <button
                    onClick={() => toggleSort("totalExpenses")}
                    className="flex items-center gap-1 hover:text-foreground ml-auto"
                  >
                    Gasto total <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="text-left p-3 font-semibold hidden lg:table-cell">
                  <button
                    onClick={() => toggleSort("lastLoginAt")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Último acesso <ArrowUpDown size={10} />
                  </button>
                </th>
                <th className="text-right p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    😶 Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition"
                  >
                    <td className="p-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-full btn-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate group-hover:text-primary">
                            {u.name ?? "—"}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {u.email}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">
                      {u.phone ? (
                        <a
                          href={`https://wa.me/55${u.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-foreground"
                        >
                          📱 {u.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <PlanBadge plan={u.plan} />
                      {u.role === "OWNER" && (
                        <span className="ml-1.5 text-[10px] text-success font-semibold">
                          · DONO
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(u.totalExpenses)}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {u.lastLoginAt
                        ? formatDateRelative(u.lastLoginAt)
                        : "nunca"}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center"
                          title="Ver perfil"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          onClick={() => setContacting(u)}
                          className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center"
                          title="Contatar"
                        >
                          <Mail size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">
        Mostrando {filtered.length} de {users.length} clientes
      </div>

      {/* Modal de contato */}
      {contacting && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">
                ✉️ Contatar {contacting.name ?? contacting.email}
              </h3>
              <button
                onClick={() => setContacting(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              A mensagem é registrada internamente. Quando o e-mail real
              estiver plugado, será enviada ao {contacting.email}.
            </p>
            <textarea
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              rows={5}
              placeholder="Escreva sua mensagem…"
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus-glow resize-none"
            />
            <div className="flex gap-2 mt-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setContacting(null)}
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={sendContact}
                loading={contactSending}
                size="sm"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
