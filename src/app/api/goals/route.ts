import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const goalSchema = z.object({
  title: z.string().min(1),
  emoji: z.string().optional(),
  type: z.string(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().default(0),
  targetDate: z.string().optional(),
  monthlyContribution: z.number().optional(),
  description: z.string().optional(),
  priority: z.number().default(1),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    orderBy: { priority: "desc" },
  });

  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = goalSchema.parse(body);

    const goal = await prisma.goal.create({
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        userId: session.user.id,
      } as any,
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}