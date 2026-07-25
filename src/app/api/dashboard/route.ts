import { NextResponse } from "next/server";

/**
 * Endpoint de health-check do dashboard.
 * Útil para verificar se a API e o banco estão respondendo.
 */
export async function GET() {
  return NextResponse.json({ ok: true, route: "dashboard" });
}
