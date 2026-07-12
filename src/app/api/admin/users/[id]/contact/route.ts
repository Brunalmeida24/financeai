import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/plan";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  channel: z.enum(["email", "whatsapp", "inapp"]).default("email"),
});

export async function POST(
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
    const data = schema.parse(body);

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    const msg = await prisma.contactMessage.create({
      data: {
        userId: id,
        subject: data.subject,
        message: data.message,
        channel: data.channel,
        status: "PENDING",
      },
    });

    // Aqui entraria o envio real (e-mail/whatsapp). Por enquanto fica
    // registrado para o dono revisar.
    return NextResponse.json({ ok: true, id: msg.id });
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
