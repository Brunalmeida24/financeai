import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Portal de gerenciamento de assinatura — placeholder.
 * Quando Mercado Pago/Stripe entra, retorna URL real do portal.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.json({
    url: "/settings?tab=plan",
    note: "Portal do provedor em breve. Por enquanto, gerencie em /settings.",
  });
}
