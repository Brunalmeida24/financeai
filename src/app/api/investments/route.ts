import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const investmentSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  institution: z.string().optional(),
  investedAmount: z.number().positive(),
  currentValue: z.number().positive(),
  annualRate: z.number().optional(),
  purchaseDate: z.string(),
  maturityDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const investments = await prisma.investment.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ investments });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = investmentSchema.parse(body);

    const investment = await prisma.investment.create({
      data: {
        ...data,
        purchaseDate: new Date(data.purchaseDate),
        maturityDate: data.maturityDate ? new Date(data.maturityDate) : null,
        userId: session.user.id,
      } as any,
    });

    return NextResponse.json(investment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}