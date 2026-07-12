import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const incomeSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string(),
  date: z.string(),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
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

  const [incomes, aggregate] = await Promise.all([
    prisma.income.findMany({ where, orderBy: { date: "desc" }, take: 100 }),
    prisma.income.aggregate({ where, _sum: { amount: true } }),
  ]);

  return NextResponse.json({ incomes, total: Number(aggregate._sum.amount || 0) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = incomeSchema.parse(body);

    const income = await prisma.income.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: session.user.id,
      } as any,
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}