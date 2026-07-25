import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

async function getDashboardData(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [currentExpenses, lastMonthExpenses, currentIncomes, goals, investments, recentExpenses, latestScore] =
    await Promise.all([
      prisma.expense.aggregate({ where: { userId, date: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
      prisma.income.aggregate({ where: { userId, date: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.goal.findMany({ where: { userId, status: "ACTIVE" }, orderBy: { priority: "desc" }, take: 4 }),
      prisma.investment.findMany({ where: { userId, isActive: true }, take: 3 }),
      prisma.expense.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 5 }),
      prisma.financialScore.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

  return {
    totalExpenses: Number(currentExpenses._sum.amount || 0),
    totalIncome: Number(currentIncomes._sum.amount || 0),
    totalInvested: investments.reduce((sum: number, i) => sum + Number(i.currentValue), 0),
    expenseChange: Number(lastMonthExpenses._sum.amount || 0) > 0
      ? ((Number(currentExpenses._sum.amount || 0) - Number(lastMonthExpenses._sum.amount || 0)) / Number(lastMonthExpenses._sum.amount || 0)) * 100
      : 0,
    goals, investments, recentExpenses,
    score: latestScore?.score || null,
  };
}

const cats: Record<string, string> = {
  FOOD:"🍔",HOUSING:"🏠",TRANSPORT:"🚗",HEALTH:"💊",EDUCATION:"📚",
  ENTERTAINMENT:"🎬",CLOTHING:"👕",SUBSCRIPTIONS:"📱",DEBT:"💳",OTHER:"📦",
};

const h = (v: string) => `hsl(${v})`;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const data = await getDashboardData(session.user.id);
  const totalSaved = data.totalIncome - data.totalExpenses;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
        {[
          { label:"Receitas do Mês", value:data.totalIncome, color:h("142 71% 45%"), icon:"💰" },
          { label:"Gastos do Mês", value:data.totalExpenses, color:h("0 72% 61%"), icon:"💸" },
          { label:"Economizado", value:totalSaved, color:h("252 82% 68%"), icon:"🏦" },
          { label:"Investido", value:data.totalInvested, color:h("38 92% 50%"), icon:"📈" },
        ].map(card => (
          <div key={card.label} style={{ background:h("234 24% 11%"), border:`1px solid ${h("234 18% 18%")}`, borderRadius:"12px", padding:"16px" }}>
            <div style={{ fontSize:"11px", color:h("230 12% 50%"), marginBottom:"8px", display:"flex", alignItems:"center", gap:"6px" }}>
              <span>{card.icon}</span>{card.label}
            </div>
            <div style={{ fontSize:"22px", fontWeight:700, color:card.color, fontFamily:"Space Grotesk, sans-serif" }}>
              {formatCurrency(card.value)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"linear-gradient(135deg,hsl(252 50% 12%),hsl(234 24% 11%))", border:`1px solid hsl(252 50% 22%)`, borderRadius:"12px", padding:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
          <div style={{ width:"32px", height:"32px", background:h("252 82% 68%"), borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>🤖</div>
          <div>
            <div style={{ fontSize:"13px", fontWeight:600, color:h("252 90% 80%") }}>Copiloto IA</div>
            <div style={{ fontSize:"11px", color:h("230 12% 50%") }}>Seu assistente financeiro pessoal</div>
          </div>
        </div>
        <p style={{ fontSize:"13px", color:h("230 12% 60%"), lineHeight:1.6, marginBottom:"12px" }}>
          Olá, {session.user.name?.split(" ")[0]}! Adicione seus gastos e receitas para insights personalizados.
        </p>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {([["💸 Adicionar gasto","/expenses"],["🎯 Criar meta","/goals"],["🤖 Conversar com IA","/ai-chat"],["📈 Investimentos","/investments"]] as [string,string][]).map(([btn,href]) => (
            <a key={btn} href={href} style={{ fontSize:"11px", padding:"5px 10px", borderRadius:"6px", border:`1px solid ${h("234 18% 22%")}`, background:"transparent", color:h("230 12% 60%"), textDecoration:"none" }}>{btn}</a>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        <div style={{ background:h("234 24% 11%"), border:`1px solid ${h("234 18% 18%")}`, borderRadius:"12px", padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
            <span style={{ fontSize:"13px", fontWeight:600, color:h("230 20% 92%") }}>💸 Últimas Transações</span>
            <a href="/expenses" style={{ fontSize:"11px", color:h("252 82% 68%"), textDecoration:"none" }}>Ver todas</a>
          </div>
          {data.recentExpenses.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px 0", color:h("230 12% 40%") }}>
              <div style={{ fontSize:"32px", marginBottom:"8px" }}>💸</div>
              <div style={{ fontSize:"13px" }}>Nenhum gasto ainda</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {data.recentExpenses.map(expense => (
                <div key={expense.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px", borderRadius:"8px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:h("234 20% 16%"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>
                    {cats[expense.category] || "📦"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", fontWeight:500, color:h("230 20% 92%") }}>{expense.title}</div>
                  </div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:h("0 72% 61%") }}>-{formatCurrency(Number(expense.amount))}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background:h("234 24% 11%"), border:`1px solid ${h("234 18% 18%")}`, borderRadius:"12px", padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
            <span style={{ fontSize:"13px", fontWeight:600, color:h("230 20% 92%") }}>🎯 Minhas Metas</span>
            <a href="/goals" style={{ fontSize:"11px", color:h("252 82% 68%"), textDecoration:"none" }}>Nova meta</a>
          </div>
          {data.goals.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px 0", color:h("230 12% 40%") }}>
              <div style={{ fontSize:"32px", marginBottom:"8px" }}>🎯</div>
              <div style={{ fontSize:"13px" }}>Nenhuma meta ainda</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {data.goals.map(goal => {
                const pct = Math.min(Math.round((Number(goal.currentAmount)/Number(goal.targetAmount))*100),100);
                return (
                  <div key={goal.id} style={{ background:h("234 20% 14%"), borderRadius:"8px", padding:"10px 12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                      <span style={{ fontSize:"12px", fontWeight:500, color:h("230 20% 92%") }}>{goal.emoji} {goal.title}</span>
                      <span style={{ fontSize:"11px", color:h("142 71% 45%") }}>{pct}%</span>
                    </div>
                    <div style={{ height:"5px", background:h("234 18% 20%"), borderRadius:"3px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:h("252 82% 68%"), borderRadius:"3px" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
