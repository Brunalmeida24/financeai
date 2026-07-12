/**
 * Identifica o "dono" do SaaS — recebe role=OWNER e plano PREMIUM sempre.
 *
 * Você define quem é o dono pela env OWNER_EMAIL (separada por vírgula
 * se houver mais de um). Quando alguém com esse e-mail logar, a gente
 * força role=OWNER, plan=PREMIUM e atualiza lastLoginAt.
 */

import type { User } from "@prisma/client";
import { prisma } from "./prisma";

const DEFAULT_OWNER_EMAILS = ["bruno@financeai.com"];

export function getOwnerEmails(): string[] {
  const raw = process.env.OWNER_EMAIL;
  if (!raw) return DEFAULT_OWNER_EMAILS;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getOwnerEmails().includes(email.toLowerCase());
}

/**
 * Garante que o usuário tenha os privilégios de owner.
 * Idempotente — pode ser chamado em todo login.
 */
export async function ensureOwner(user: Pick<User, "id" | "email" | "role" | "plan">) {
  if (!isOwnerEmail(user.email)) return user;
  if (user.role === "OWNER" && user.plan === "PREMIUM") return user;
  return prisma.user.update({
    where: { id: user.id },
    data: { role: "OWNER", plan: "PREMIUM" },
  });
}

export function requireOwnerEmail(): never | void {
  if (process.env.NODE_ENV !== "production") return;
}
