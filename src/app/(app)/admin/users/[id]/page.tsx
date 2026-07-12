import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { formatCurrency, formatDate, formatDateRelative } from "@/lib/utils";
import { ChangePlanButton } from "@/components/admin/ChangePlanButton";

export const dynamic = "force-dynamic";

export default async function AdminUserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      expenses: {
        orderBy: { date: "desc" },
        take: 10,
        select: { id: true, title: true, amount: true, category: true, date: true },
      },
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      planChanges: {
        orderBy: { changedAt: "desc" },
        take: 5,
      },
      _count: { select: { expenses: true, incomes: true, goals: true, investments: true } },
    },
  });
  if (!user) notFound();

  const totalGasto = user.expenses.reduce(
    (s, e) => s + Number(e.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold">
            {user.name ?? "Sem nome"}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <ChangePlanButton
          userId={user.id}
          currentPlan={user.plan}
          isOwner={user.role === "OWNER"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardTitle>📇 Identificação</CardTitle>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="E-mail" value={user.email} />
            <Row
              label="Telefone"
              value={
                user.phone ? (
                  <a
                    href={`https://wa.me/55${user.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    📱 {user.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground/60">—</span>
                )
              }
            />
            <Row label="Plano" value={<PlanBadge plan={user.plan} />} />
            <Row
              label="Role"
              value={
                user.role === "OWNER" ? (
                  <span className="text-success font-semibold">👑 OWNER</span>
                ) : (
                  "USER"
                )
              }
            />
            <Row
              label="Último login"
              value={
                user.lastLoginAt
                  ? formatDateRelative(user.lastLoginAt)
                  : "nunca"
              }
            />
            <Row
              label="Cadastro"
              value={formatDate(user.createdAt)}
            />
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>📊 Resumo financeiro</CardTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <Stat label="Gastos" value={String(user._count.expenses)} />
            <Stat label="Receitas" value={String(user._count.incomes)} />
            <Stat label="Metas" value={String(user._count.goals)} />
            <Stat label="Investimentos" value={String(user._count.investments)} />
          </div>
          <div className="mt-3 text-2xl font-display font-bold">
            💸 {formatCurrency(totalGasto)}
          </div>
          <div className="text-xs text-muted-foreground">
            Volume total registrado em gastos
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>💸 Últimos gastos</CardTitle>
        <div className="mt-3 space-y-1.5">
          {user.expenses.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6">
              😶 Nenhum gasto registrado
            </div>
          ) : (
            user.expenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/30"
              >
                <div>
                  <div className="text-sm font-medium">{e.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {e.category} · {formatDate(e.date)}
                  </div>
                </div>
                <div className="text-sm font-bold text-destructive">
                  -{formatCurrency(Number(e.amount))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {user.planChanges.length > 0 && (
        <Card>
          <CardTitle>🔄 Histórico de plano</CardTitle>
          <div className="mt-3 space-y-1.5">
            {user.planChanges.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/30"
              >
                <div>
                  {c.fromPlan} → <strong>{c.toPlan}</strong>
                  {c.reason && (
                    <span className="text-muted-foreground text-xs ml-2">
                      ({c.reason})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {formatDate(c.changedAt)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground text-right">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border p-2.5">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="text-lg font-display font-bold">{value}</div>
    </div>
  );
}
