import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/plan";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  plan: z.enum(["FREE", "PRO", "PREMIUM"]).optional(),
  phone: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!isOwner(session)) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      expenses: { orderBy: { date: "desc" }, take: 10 },
      planChanges: { orderBy: { changedAt: "desc" }, take: 10 },
      _count: {
        select: { expenses: true, incomes: true, goals: true, investments: true },
      },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!isOwner(session)) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const data = patchSchema.parse(body);

    const current = await prisma.user.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    if (current.role === "OWNER") {
      return NextResponse.json(
        { error: "Não é possível alterar o plano do OWNER." },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.plan && data.plan !== current.plan) {
      updates.plan = data.plan;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: updates,
      });
      if (data.plan && data.plan !== current.plan) {
        await tx.planChange.create({
          data: {
            userId: id,
            fromPlan: current.plan,
            toPlan: data.plan,
            reason: "admin_change",
            changedBy: session.user.id,
          },
        });
      }
      return updated;
    });

    return NextResponse.json({ ok: true, user: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
