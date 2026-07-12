import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/plan";
import { prisma } from "@/lib/prisma";

/**
 * Lista de clientes para o admin — payload enxuto.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!isOwner(session)) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      plan: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
      _count: { select: { expenses: true } },
    },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      plan: u.plan,
      role: u.role,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      expenseCount: u._count.expenses,
    })),
  });
}
