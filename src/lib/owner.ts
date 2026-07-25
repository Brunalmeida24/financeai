/**
 * Identifica o "dono" do SaaS — recebe role=OWNER e plano PREMIUM sempre.
 *
 * Você define quem é o dono pela env OWNER_EMAIL (separada por vírgula
 * se houver mais de um). Quando alguém com esse e-mail logar, a gente
 * força role=OWNER, plan=PREMIUM e atualiza lastLoginAt.
 *
 * Para login social (Google), o fluxo é:
 *   1. PrismaAdapter cria o User com `password: null` e `name` da conta.
 *   2. ensureUserFromProvider completa o cadastro (image, emailVerified,
 *      garante privilégios de owner se for o e-mail do dono).
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

/**
 * Completa/atualiza o cadastro de um usuário que entrou via provider social
 * (Google). O PrismaAdapter cria o User automaticamente, mas às vezes com
 * `name` vazio e sem `image`. Aqui a gente normaliza isso e marca o e-mail
 * como verificado.
 *
 * Idempotente: se o user já existir, só atualiza os campos faltantes.
 */
export async function ensureUserFromProvider({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!existing) {
    // Não deveria acontecer — o PrismaAdapter já cria o User antes do
    // signIn callback rodar. Se chegou aqui, aborta com erro claro.
    throw new Error(
      `ensureUserFromProvider: usuário ${normalizedEmail} não encontrado.`
    );
  }

  const updates: Partial<User> = {};
  if (!existing.name && name) updates.name = name;
  if (!existing.image && image) updates.image = image;
  if (!existing.emailVerified) updates.emailVerified = new Date();
  // Conta social nunca tem senha local.
  if (existing.password) updates.password = null;

  const updated = Object.keys(updates).length
    ? await prisma.user.update({ where: { id: existing.id }, data: updates })
    : existing;

  return ensureOwner({
    id: updated.id,
    email: updated.email,
    role: updated.role,
    plan: updated.plan,
  });
}

export function requireOwnerEmail(): never | void {
  if (process.env.NODE_ENV !== "production") return;
}
