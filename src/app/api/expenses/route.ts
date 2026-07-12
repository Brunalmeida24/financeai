import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isOwner, planLimits, canAccess } from "@/lib/plan";

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string(),
  date: z.string(),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  paymentMethod: z.string().default("PIX"),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const where: any = { userId: session.user.id };
  if (month && year) {
    where.date = {
      gte: new Date(Number(year), Number(month) - 1, 1),
      lte: new Date(Number(year), Number(month), 0),
    };
  }

  const [expenses, aggregate] = await Promise.all([
    prisma.expense.findMany({ where, orderBy: { date: "desc" }, take: 100 }),
    prisma.expense.aggregate({ where, _sum: { amount: true } }),
  ]);

  return NextResponse.json({ expenses, total: Number(aggregate._sum.amount || 0) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  // Bloqueio por plano: FREE tem limite mensal
  if (!canAccess(session, "expense:create")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  if (!isOwner(session)) {
    const limit = planLimits(session.user.plan).expensesPerMonth;
    if (Number.isFinite(limit)) {
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const count = await prisma.expense.count({
        where: { userId: session.user.id, date: { gte: startOfMonth } },
      });
      if (count >= limit) {
        return NextResponse.json(
          {
            error: `Você atingiu o limite de ${limit} gastos/mês do plano Free. Faça upgrade para continuar.`,
            code: "PLAN_LIMIT",
            upgradeUrl: "/pricing",
          },
          { status: 402 }
        );
      }
    }
  }

  try {
    const body = await req.json();
    const data = expenseSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.user.id,
        tags: [],
      } as any,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}