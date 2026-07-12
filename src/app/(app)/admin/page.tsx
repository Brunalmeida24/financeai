import { prisma } from "@/lib/prisma";
import { PLAN_PRICES, planLabel } from "@/lib/plan";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { formatDateRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const [total, free, pro, premium, newThisMonth, allExpenses, recent] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "FREE" } }),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "PREMIUM" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          phone: true,
          createdAt: true,
        },
      }),
    ]);

  const mrr = pro * PLAN_PRICES.PRO + premium * PLAN_PRICES.PREMIUM;

  return {
    total,
    free,
    pro,
    premium,
    newThisMonth,
    mrr,
    totalGasto: Number(allExpenses._sum.amount || 0),
    recent,
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Visão geral</h1>
        <p className="text-sm text-muted-foreground">
          Resumo da operação do FinanceAI
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          emoji="👥"
          label="Total de clientes"
          value={stats.total}
          hint={`+${stats.newThisMonth} este mês`}
          tone="primary"
        />
        <StatsCard
          emoji="💸"
          label="MRR estimado"
          value={formatCurrency(stats.mrr)}
          hint={`${stats.pro} Pro · ${stats.premium} Premium`}
          tone="success"
        />
        <StatsCard
          emoji="🌱"
          label="Free / Pro / Premium"
          value={`${stats.free} · ${stats.pro} · ${stats.premium}`}
          hint="Distribuição de planos"
          tone="muted"
        />
        <StatsCard
          emoji="📊"
          label="Volume transacionado"
          value={formatCurrency(stats.totalGasto)}
          hint="Soma de todos os gastos"
          tone="info"
        />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <CardTitle>🆕 Clientes recentes</CardTitle>
          <Link
            href="/admin/users"
            className="text-xs text-primary hover:text-primary/80"
          >
            Ver todos →
          </Link>
        </div>
        <div className="space-y-2">
          {stats.recent.map((u) => (
            <Link
              key={u.id}
              href={`/admin/users/${u.id}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition"
            >
              <div className="w-9 h-9 rounded-full btn-primary flex items-center justify-center text-sm font-semibold">
                {(u.name?.[0] ?? u.email[0]).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {u.name ?? "Sem nome"}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {u.email}
                </div>
              </div>
              <PlanBadge plan={u.plan} />
              <div className="text-[11px] text-muted-foreground hidden sm:block">
                {formatDateRelative(u.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
