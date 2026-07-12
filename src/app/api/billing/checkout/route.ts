import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isOwner } from "@/lib/plan";

const schema = z.object({
  plan: z.enum(["PRO", "PREMIUM"]),
  method: z.enum(["pix", "card"]).default("pix"),
});

/**
 * Checkout simulado. Quando Mercado Pago/Stripe entra, este handler
 * continua sendo o ponto único de entrada — só troca o corpo para
 * criar a preferência / session de pagamento no provedor.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { plan, method } = schema.parse(body);

    if (isOwner(session)) {
      return NextResponse.json(
        { error: "Owner já tem acesso total." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Cria/atualiza a Subscription como ACTIVE com periodo de 30 dias
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { id: `${userId}-${plan}` }, // chave determinística por usuário+plano
        update: {
          plan,
          status: "ACTIVE",
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
        create: {
          id: `${userId}-${plan}`,
          userId,
          plan,
          status: "ACTIVE",
          paymentProvider: method === "pix" ? "MERCADOPAGO" : "STRIPE",
          startedAt: new Date(),
          currentPeriodEnd: periodEnd,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { plan },
      }),
      prisma.planChange.create({
        data: {
          userId,
          fromPlan: session.user.plan as any,
          toPlan: plan,
          reason: "checkout",
          changedBy: userId,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Assinatura ativada (simulação).",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    console.error("Erro no checkout:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
