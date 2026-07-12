import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { canAccess, isOwner, planLimits } from "@/lib/plan";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  if (!canAccess(session, "ai:chat")) {
    return NextResponse.json(
      {
        error: "O Copiloto IA é um recurso Pro. Faça upgrade para conversar com a IA.",
        code: "PLAN_REQUIRED",
        upgradeUrl: "/pricing",
      },
      { status: 402 }
    );
  }

  // Limite mensal de chats
  if (!isOwner(session)) {
    const limit = planLimits(session.user.plan).aiChatsPerMonth;
    if (Number.isFinite(limit)) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const used = await prisma.aiMessage.count({
        where: {
          role: "USER",
          createdAt: { gte: startOfMonth },
          chat: { userId: session.user.id },
        },
      });
      if (used >= limit) {
        return NextResponse.json(
          {
            error: `Você atingiu o limite de ${limit} mensagens de IA este mês.`,
            code: "PLAN_LIMIT",
            upgradeUrl: "/pricing",
          },
          { status: 402 }
        );
      }
    }
  }

  try {
    const { message, chatId } = await req.json();
    const userId = session.user.id;

    // Buscar contexto financeiro
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [expenses, incomes, goals, investments] = await Promise.all([
      prisma.expense.findMany({ where: { userId, date: { gte: startOfMonth } }, take: 20 }),
      prisma.income.findMany({ where: { userId, date: { gte: startOfMonth } } }),
      prisma.goal.findMany({ where: { userId, status: "ACTIVE" } }),
      prisma.investment.findMany({ where: { userId, isActive: true } }),
    ]);

    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
    const totalInvested = investments.reduce((s, i) => s + Number(i.currentValue), 0);

    const context = `
Dados financeiros do usuário (${now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}):
- Receitas: R$ ${totalIncome.toFixed(2)}
- Gastos: R$ ${totalExpenses.toFixed(2)}
- Saldo: R$ ${(totalIncome - totalExpenses).toFixed(2)}
- Total investido: R$ ${totalInvested.toFixed(2)}
- Metas ativas: ${goals.length}
- Gastos por categoria: ${JSON.stringify(
  expenses.reduce((acc: any, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {})
)}
    `.trim();

    // Buscar ou criar chat
    let activeChatId = chatId;
    if (!activeChatId) {
      const chat = await prisma.aiChat.create({
        data: { userId, title: message.slice(0, 50) },
      });
      activeChatId = chat.id;
    }

    // Buscar histórico
    const history = await prisma.aiMessage.findMany({
      where: { chatId: activeChatId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages: any[] = [
      {
        role: "system",
        content: `Você é o Copiloto Financeiro do FinanceAI — um assistente de finanças pessoais inteligente para brasileiros.
Seja direto, empático e use linguagem simples. Use contexto brasileiro (Selic, IPCA, Tesouro Direto, PIX).
Explique termos técnicos de forma simples. Dê conselhos práticos e personalizados.

${context}`,
      },
      ...history.map((m) => ({ role: m.role.toLowerCase(), content: m.content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    await prisma.aiMessage.createMany({
      data: [
        { chatId: activeChatId, role: "USER", content: message },
        { chatId: activeChatId, role: "ASSISTANT", content: assistantMessage, tokens: completion.usage?.total_tokens },
      ],
    });

    return NextResponse.json({ response: assistantMessage, chatId: activeChatId });
  } catch (error) {
    console.error("Erro no chat IA:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}