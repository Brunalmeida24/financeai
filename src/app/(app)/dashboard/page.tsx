import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateRelative } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";
import { TrustBadge } from "@/components/ui/TrustBadge";

const categoryLabels: Record<string, { emoji: string; label: string; tone: any }> = {
  FOOD: { emoji: "🍔", label: "Alimentação", tone: "warning" },
  HOUSING: { emoji: "🏠", label: "Moradia", tone: "info" },
  TRANSPORT: { emoji: "🚗", label: "Transporte", tone: "info" },
  HEALTH: { emoji: "💊", label: "Saúde", tone: "success" },
  EDUCATION: { emoji: "📚", label: "Educação", tone: "primary" },
  ENTERTAINMENT: { emoji: "🎬", label: "Lazer", tone: "primary" },
  CLOTHING: { emoji: "👕", label: "Vestuário", tone: "muted" },
  SUBSCRIPTIONS: { emoji: "📱", label: "Assinaturas", tone: "info" },
  INVESTMENTS: { emoji: "📈", label: "Investimentos", tone: "success" },
  SAVINGS: { emoji: "💰", label: "Poupança", tone: "success" },
  DEBT: { emoji: "💳", label: "Dívidas", tone: "destructive" },
  TRAVEL: { emoji: "✈️", label: "Viagem", tone: "primary" },
  PETS: { emoji: "🐶", label: "Pets", tone: "muted" },
  GIFTS: { emoji: "🎁", label: "Presentes", tone: "primary" },
  OTHER: { emoji: "📦", label: "Outros", tone: "muted" },
};

async function getDashboardData(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    currentExpenses,
    lastMonthExpenses,
    currentIncomes,
    goals,
    investments,
    recentExpenses,
    latestScore,
  ] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { amount: true },
    }),
    prisma.income.aggregate({
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.goal.findMany({
      where: { userId, status: "ACTIVE" },
      orderBy: { priority: "desc" },
      take: 4,
    }),
    prisma.investment.findMany({
      where: { userId, isActive: true },
      take: 3,
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.financialScore.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    totalExpenses: Number(currentExpenses._sum.amount || 0),
    totalLastMonth: Number(lastMonthExpenses._sum.amount || 0),
    totalIncome: Number(currentIncomes._sum.amount || 0),
    totalInvested: investments.reduce((s, i) => s + Number(i.currentValue), 0),
    expenseChange:
      Number(lastMonthExpenses._sum.amount || 0) > 0
        ? ((Number(currentExpenses._sum.amount || 0) -
            Number(lastMonthExpenses._sum.amount || 0)) /
            Number(lastMonthExpenses._sum.amount || 0)) *
          100
        : 0,
    goals,
    investments,
    recentExpenses,
    score: latestScore?.score || null,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user.id);
  const totalSaved = data.totalIncome - data.totalExpenses;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <ScoreRing score={data.score} />
            <div>
              <div className="text-[11px] text-muted-foreground uppercase font-semibold">
                Score
              </div>
              <div className="text-sm font-semibold text-success">
                {data.score ? "Calculado" : "Sem dados"}
              </div>
            </div>
          </div>
        </Card>

        <KpiCard
          label="Receitas do mês"
          emoji="💰"
          tone="success"
          value={data.totalIncome}
        />
        <KpiCard
          label="Gastos do mês"
          emoji="💸"
          tone="destructive"
          value={data.totalExpenses}
          change={data.expenseChange}
        />
        <KpiCard
          label="Economizado"
          emoji="🏦"
          tone="primary"
          value={totalSaved}
        />
      </div>

      {/* Plano + Upgrade CTA */}
      <PlanBanner />

      {/* Insights + Confiança */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <div className="font-display font-semibold text-sm">
                Copiloto IA — pronto para ajudar
              </div>
              <div className="text-xs text-muted-foreground">
                Adicione gastos e receitas para receber insights personalizados
              </div>
            </div>
            <Badge variant="primary" className="ml-auto">IA</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Olá! Sou seu copiloto financeiro. Comece adicionando seus{" "}
            <strong className="text-foreground">gastos e receitas</strong> do
            mês para que eu possa analisar seus hábitos. 💡
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/expenses">
              <Button size="sm" variant="primary">
                💸 Adicionar gasto
              </Button>
            </Link>
            <Link href="/goals">
              <Button size="sm" variant="outline">
                🎯 Criar meta
              </Button>
            </Link>
            <Link href="/ai-chat">
              <Button size="sm" variant="ghost">
                🤖 Conversar com IA
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-3">
          <TrustBadge
            emoji="🔒"
            title="Seus dados estão seguros"
            description="Criptografados em repouso e em trânsito"
          />
          <TrustBadge
            emoji="🇧🇷"
            title="Servidores no Brasil"
            description="Latência baixa, lei brasileira"
          />
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle>💸 Últimas transações</CardTitle>
            <Link
              href="/expenses"
              className="text-xs text-primary hover:text-primary/80"
            >
              Ver todas →
            </Link>
          </div>
          {data.recentExpenses.length === 0 ? (
            <EmptyState
              emoji="💸"
              title="Nenhum gasto ainda"
              description="Toque em + Adicionar para registrar seu primeiro gasto."
            />
          ) : (
            <div className="space-y-1.5">
              {data.recentExpenses.map((e) => {
                const cat = categoryLabels[e.category];
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/30 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-base flex-shrink-0">
                      {cat?.emoji ?? "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {e.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {cat?.label} · {formatDateRelative(e.date)}
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

        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle>🎯 Metas</CardTitle>
            <Link
              href="/goals"
              className="text-xs text-primary hover:text-primary/80"
            >
              + Nova meta →
            </Link>
          </div>
          {data.goals.length === 0 ? (
            <EmptyState
              emoji="🎯"
              title="Nenhuma meta ainda"
              description="Crie sua primeira meta e acompanhe o progresso."
            />
          ) : (
            <div className="space-y-2.5">
              {data.goals.map((g) => {
                const pct = Math.min(
                  Math.round(
                    (Number(g.currentAmount) / Number(g.targetAmount)) * 100
                  ),
                  100
                );
                return (
                  <div
                    key={g.id}
                    className="rounded-xl bg-secondary/30 border border-border p-3"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">
                        {g.emoji} {g.title}
                      </span>
                      <span className="text-xs text-success font-semibold">
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} />
                    <div className="text-[11px] text-muted-foreground mt-1.5">
                      {formatCurrency(Number(g.currentAmount))} /{" "}
                      {formatCurrency(Number(g.targetAmount))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <CardTitle>📈 Investimentos</CardTitle>
          <Link
            href="/investments"
            className="text-xs text-primary hover:text-primary/80"
          >
            Ver carteira →
          </Link>
        </div>
        {data.investments.length === 0 ? (
          <EmptyState
            emoji="📈"
            title="Nenhum investimento ainda"
            description="Comece a registrar sua carteira para acompanhar a evolução."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {data.investments.map((inv) => (
              <div
                key={inv.id}
                className="rounded-xl bg-secondary/30 border border-border p-3"
              >
                <div className="text-sm font-medium mb-1">{inv.name}</div>
                <div className="text-lg font-display font-bold text-gradient">
                  {formatCurrency(Number(inv.currentValue))}
                </div>
                <div className="text-[11px] text-success mt-0.5">
                  {inv.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function KpiCard({
  label,
  emoji,
  tone,
  value,
  change,
}: {
  label: string;
  emoji: string;
  tone: "success" | "destructive" | "primary";
  value: number;
  change?: number;
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
      ? "text-destructive"
      : "text-primary";
  return (
    <Card>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">
        <span>{emoji}</span>
        {label}
      </div>
      <div
        className={`text-2xl font-display font-bold ${color}`}
      >
        <AnimatedNumber value={value} format="currency" />
      </div>
      {typeof change === "number" && change !== 0 && (
        <div
          className={`text-[11px] mt-1 ${
            change > 0 ? "text-destructive" : "text-success"
          }`}
        >
          {change > 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs mês
          passado
        </div>
      )}
    </Card>
  );
}

function ScoreRing({ score }: { score: number | null }) {
  const pct = score ?? 0;
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="hsl(234 18% 22%)"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="hsl(252 82% 68%)"
          strokeWidth="5"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm text-primary">
        {score ?? "—"}
      </div>
    </div>
  );
}

function PlanBanner() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-info/10 border-primary/30 flex items-center gap-3 flex-wrap">
      <div className="text-3xl">✨</div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-sm">
          Tenha a IA Copiloto no seu bolso
        </div>
        <div className="text-xs text-muted-foreground">
          Faça upgrade para Pro e desbloqueie IA, score e investimentos.
        </div>
      </div>
      <Link href="/pricing">
        <Button size="sm" variant="primary">
          Ver planos
        </Button>
      </Link>
    </Card>
  );
}
