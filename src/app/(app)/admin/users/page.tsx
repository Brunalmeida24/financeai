import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/UsersTable";
import { isOwner } from "@/lib/plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!isOwner(session)) redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      expenses: { select: { amount: true } },
      incomes: { select: { amount: true } },
      _count: { select: { expenses: true } },
    },
  });

  const initial = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    plan: u.plan as "FREE" | "PRO" | "PREMIUM",
    role: u.role as "USER" | "OWNER",
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
    totalExpenses: u.expenses.reduce(
      (s, e) => s + Number(e.amount),
      0
    ),
    totalIncome: u.incomes.reduce(
      (s, e) => s + Number(e.amount),
      0
    ),
    expenseCount: u._count.expenses,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">👥 Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Lista de todos os clientes. Clique em um para ver o perfil
          completo, ou use os botões para contatar.
        </p>
      </div>

      <UsersTable initialUsers={initial} />
    </div>
  );
}
