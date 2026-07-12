/**
 * Planos do FinanceAI.
 *
 * Centraliza limites, preços e checagens de acesso. Usado tanto em server
 * components / route handlers quanto em client components.
 *
 * O criador (role OWNER) sempre passa em qualquer checagem — ver canAccess().
 */

export type PlanKey = "FREE" | "PRO" | "PREMIUM";

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  PRO: 9.9,
  PREMIUM: 19.9,
};

export const PLAN_LABELS: Record<PlanKey, string> = {
  FREE: "Gratuito",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export const PLAN_TAGLINES: Record<PlanKey, string> = {
  FREE: "Para começar a organizar sua vida financeira.",
  PRO: "Para quem quer IA, score e investimentos sem limites.",
  PREMIUM: "Para quem quer o copiloto financeiro no modo turbo.",
};

export type FeatureKey =
  | "expense:create"
  | "ai:chat"
  | "investments:view"
  | "score:view"
  | "export:csv"
  | "alerts:advanced"
  | "multi:account"
  | "consulting:monthly";

const PLAN_FEATURES: Record<PlanKey, Set<FeatureKey>> = {
  FREE: new Set<FeatureKey>(["expense:create"]),
  PRO: new Set<FeatureKey>([
    "expense:create",
    "ai:chat",
    "investments:view",
    "score:view",
    "export:csv",
    "alerts:advanced",
  ]),
  PREMIUM: new Set<FeatureKey>([
    "expense:create",
    "ai:chat",
    "investments:view",
    "score:view",
    "export:csv",
    "alerts:advanced",
    "multi:account",
    "consulting:monthly",
  ]),
};

export const PLAN_LIMITS = {
  FREE: { expensesPerMonth: 50, aiChatsPerMonth: 0 },
  PRO: { expensesPerMonth: Infinity, aiChatsPerMonth: 100 },
  PREMIUM: { expensesPerMonth: Infinity, aiChatsPerMonth: Infinity },
} as const;

export type SessionLike = {
  plan?: string | null;
  role?: string | null;
} | null
  | undefined;

function normalize(plan: string | null | undefined): PlanKey {
  if (plan === "PRO" || plan === "PREMIUM") return plan;
  return "FREE";
}

export function getPlan(plan: string | null | undefined): PlanKey {
  return normalize(plan);
}

export function isOwner(session: SessionLike): boolean {
  return session?.role === "OWNER";
}

export function canAccess(
  session: SessionLike,
  feature: FeatureKey
): boolean {
  if (isOwner(session)) return true;
  const plan = getPlan(session?.plan);
  return PLAN_FEATURES[plan].has(feature);
}

export function planLimits(plan: string | null | undefined) {
  return PLAN_LIMITS[getPlan(plan)];
}

export function planLabel(plan: string | null | undefined): string {
  return PLAN_LABELS[getPlan(plan)];
}

export function planPrice(plan: string | null | undefined): number {
  return PLAN_PRICES[getPlan(plan)];
}

/**
 * Compara o plano atual com um mínimo exigido.
 * Útil em middleware/gating: `atLeast(session, "PRO")` → free não passa.
 */
export function atLeast(session: SessionLike, min: PlanKey): boolean {
  if (isOwner(session)) return true;
  const order: PlanKey[] = ["FREE", "PRO", "PREMIUM"];
  return order.indexOf(getPlan(session?.plan)) >= order.indexOf(min);
}

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  "expense:create": "Registrar gastos e receitas",
  "ai:chat": "Copiloto IA ilimitado",
  "investments:view": "Carteira de investimentos",
  "score:view": "Score financeiro",
  "export:csv": "Exportar dados em CSV",
  "alerts:advanced": "Alertas inteligentes",
  "multi:account": "Múltiplas contas",
  "consulting:monthly": "Consultoria mensal com IA",
};
