import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .optional()
    .or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);
    const cleanPhone = phone && phone.length > 0 ? phone : null;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { phone: cleanPhone },
      select: { phone: true },
    });

    return NextResponse.json({ ok: true, phone: updated.phone });
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
