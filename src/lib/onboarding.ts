/**
 * Helpers de onboarding — flag de tour persistida em User.onboardingCompleted.
 */

import { prisma } from "./prisma";

export async function markOnboardingComplete(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });
}

export function needsOnboarding(user: {
  onboardingCompleted?: boolean | null;
} | null | undefined): boolean {
  if (!user) return true;
  return !user.onboardingCompleted;
}

export const ONBOARDING_STEPS = [
  {
    key: "welcome",
    emoji: "👋",
    title: "Bem-vindo ao FinanceAI!",
    description:
      "Seu copiloto financeiro pessoal. Vamos te mostrar tudo em 4 passos rápidos.",
  },
  {
    key: "profile",
    emoji: "🪪",
    title: "Conte um pouco sobre você",
    description:
      "Telefone, cidade e tipo de trabalho. Usamos só pra personalizar — você controla o que compartilha.",
  },
  {
    key: "first-expense",
    emoji: "💸",
    title: "Vamos registrar seu primeiro gasto",
    description:
      "Adicionar um gasto real é o jeito mais rápido de sentir o app funcionando.",
  },
  {
    key: "tour",
    emoji: "🗺️",
    title: "Tour rápido do dashboard",
    description:
      "Vou te mostrar onde fica cada coisa — Score, Metas, IA e os seus dados seguros.",
  },
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]["key"];
