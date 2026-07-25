// Aplica o schema Prisma no Supabase via SQL direto.
// Workaround para o P1014 (FK para tabela inexistente) e o P3006
// (mudança destrutiva no enum UserPlan).
//
// Estratégia:
//  1. Dropa todas as tabelas do schema public (não há dados importantes
//     em prod ainda — o usuário está subindo o app pela primeira vez).
//  2. Recria tudo a partir do schema.prisma traduzido para SQL.
//  3. Conecta via `pg` (sem Prisma) para evitar pgbouncer prepared-stmt.
//
// Para rodar: `node scripts/apply-schema.mjs`

import "dotenv/config";
import pg from "pg";

const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!directUrl) {
  console.error("Defina DIRECT_URL ou DATABASE_URL no .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: directUrl });
await client.connect();

const TABLES_IN_DROP_ORDER = [
  "ai_messages",
  "ai_chats",
  "ai_insights",
  "financial_scores",
  "plan_changes",
  "subscriptions",
  "contact_messages",
  "investments",
  "goals",
  "incomes",
  "expenses",
  "user_profiles",
  "accounts",
  "sessions",
  "verification_tokens",
  "users",
];

const ENUMS = [
  "UserPlan",
  "Role",
  "SubscriptionStatus",
  "PaymentProvider",
  "ContactMessageStatus",
  "EmploymentType",
  "InvestorProfile",
  "ExpenseCategory",
  "IncomeCategory",
  "RecurrenceType",
  "PaymentMethod",
  "GoalType",
  "GoalStatus",
  "InvestmentType",
  "IndexType",
  "MessageRole",
  "InsightType",
];

console.log("→ Dropando tabelas existentes (ordem reversa por FK)...");
for (const t of TABLES_IN_DROP_ORDER) {
  try {
    await client.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
  } catch (e) {
    console.log(`  ! ${t}:`, e.message);
  }
}

console.log("→ Dropando enums...");
for (const e of ENUMS) {
  try {
    await client.query(`DROP TYPE IF EXISTS "${e}" CASCADE`);
  } catch (err) {
    console.log(`  ! ${e}:`, err.message);
  }
}

console.log("→ Criando enums...");
const enumsSql = `
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO', 'PREMIUM');
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING');
CREATE TYPE "PaymentProvider" AS ENUM ('NONE', 'MERCADOPAGO', 'STRIPE');
CREATE TYPE "ContactMessageStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
CREATE TYPE "EmploymentType" AS ENUM ('EMPLOYEE', 'FREELANCER', 'ENTREPRENEUR', 'STUDENT', 'UNEMPLOYED', 'RETIRED');
CREATE TYPE "InvestorProfile" AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE');
CREATE TYPE "ExpenseCategory" AS ENUM ('FOOD', 'HOUSING', 'TRANSPORT', 'HEALTH', 'EDUCATION', 'ENTERTAINMENT', 'CLOTHING', 'SUBSCRIPTIONS', 'INVESTMENTS', 'SAVINGS', 'DEBT', 'TRAVEL', 'PETS', 'GIFTS', 'OTHER');
CREATE TYPE "IncomeCategory" AS ENUM ('SALARY', 'FREELANCE', 'INVESTMENT', 'BONUS', 'RENTAL', 'GIFT', 'SALE', 'OTHER');
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH', 'TRANSFER', 'BOLETO', 'OTHER');
CREATE TYPE "GoalType" AS ENUM ('EMERGENCY_FUND', 'TRAVEL', 'VEHICLE', 'REAL_ESTATE', 'EDUCATION', 'RETIREMENT', 'DEBT_PAYMENT', 'OTHER');
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');
CREATE TYPE "InvestmentType" AS ENUM ('TESOURO_SELIC', 'TESOURO_IPCA', 'TESOURO_PREFIXADO', 'CDB', 'LCI', 'LCA', 'FUND', 'ETF', 'STOCK', 'FII', 'CRYPTO', 'SAVINGS', 'OTHER');
CREATE TYPE "IndexType" AS ENUM ('CDI', 'SELIC', 'IPCA', 'IGPM', 'PREFIXADO');
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');
CREATE TYPE "InsightType" AS ENUM ('SPENDING_ALERT', 'GOAL_PROGRESS', 'INVESTMENT_TIP', 'NEWS_IMPACT', 'MONTHLY_SUMMARY', 'ACHIEVEMENT', 'WARNING', 'OPPORTUNITY');
`;
await client.query(enumsSql);

console.log("→ Criando tabelas...");
const tablesSql = `
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "password" TEXT,
  "plan" "UserPlan" NOT NULL DEFAULT 'FREE',
  "role" "Role" NOT NULL DEFAULT 'USER',
  "phone" TEXT,
  "lastLoginAt" TIMESTAMP(3),
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_plan_idx" ON "users"("plan");

CREATE TABLE "accounts" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

CREATE TABLE "sessions" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

CREATE TABLE "user_profiles" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "birthDate" TIMESTAMP(3),
  "phone" TEXT,
  "city" TEXT,
  "state" TEXT,
  "employmentType" "EmploymentType" NOT NULL DEFAULT 'EMPLOYEE',
  "monthlyIncome" DECIMAL(12,2),
  "monthlyFixedExpenses" DECIMAL(12,2),
  "investorProfile" "InvestorProfile" NOT NULL DEFAULT 'CONSERVATIVE',
  "mainGoals" TEXT[],
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "expenses" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "category" "ExpenseCategory" NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  "recurrence" "RecurrenceType",
  "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PIX',
  "tags" TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "expenses_userId_date_idx" ON "expenses"("userId", "date");
CREATE INDEX "expenses_userId_category_idx" ON "expenses"("userId", "category");

CREATE TABLE "incomes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "category" "IncomeCategory" NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  "recurrence" "RecurrenceType",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "incomes_userId_date_idx" ON "incomes"("userId", "date");

CREATE TABLE "goals" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "emoji" TEXT,
  "type" "GoalType" NOT NULL,
  "targetAmount" DECIMAL(12,2) NOT NULL,
  "currentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "targetDate" TIMESTAMP(3),
  "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
  "monthlyContribution" DECIMAL(12,2),
  "priority" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "goals_userId_status_idx" ON "goals"("userId", "status");

CREATE TABLE "investments" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "InvestmentType" NOT NULL,
  "institution" TEXT,
  "investedAmount" DECIMAL(12,2) NOT NULL,
  "currentValue" DECIMAL(12,2) NOT NULL,
  "annualRate" DECIMAL(6,4),
  "indexType" "IndexType",
  "purchaseDate" TIMESTAMP(3) NOT NULL,
  "maturityDate" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "investments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "investments_userId_isActive_idx" ON "investments"("userId", "isActive");

CREATE TABLE "ai_chats" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL DEFAULT 'Nova conversa',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "ai_chats_userId_idx" ON "ai_chats"("userId");

CREATE TABLE "ai_messages" (
  "id" TEXT PRIMARY KEY,
  "chatId" TEXT NOT NULL,
  "role" "MessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "tokens" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ai_chats"("id") ON DELETE CASCADE
);
CREATE INDEX "ai_messages_chatId_idx" ON "ai_messages"("chatId");

CREATE TABLE "ai_insights" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" "InsightType" NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "category" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "isDismissed" BOOLEAN NOT NULL DEFAULT false,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "ai_insights_userId_isRead_idx" ON "ai_insights"("userId", "isRead");

CREATE TABLE "financial_scores" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "savingsScore" INTEGER NOT NULL,
  "debtScore" INTEGER NOT NULL,
  "investmentScore" INTEGER NOT NULL,
  "emergencyScore" INTEGER NOT NULL,
  "disciplineScore" INTEGER NOT NULL,
  "highlights" TEXT[],
  "warnings" TEXT[],
  "tips" TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "financial_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "financial_scores_userId_month_year_key" ON "financial_scores"("userId", "month", "year");
CREATE INDEX "financial_scores_userId_idx" ON "financial_scores"("userId");

CREATE TABLE "subscriptions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "plan" "UserPlan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'NONE',
  "externalId" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

CREATE TABLE "plan_changes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "fromPlan" "UserPlan" NOT NULL,
  "toPlan" "UserPlan" NOT NULL,
  "reason" TEXT,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "changedBy" TEXT,
  CONSTRAINT "plan_changes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "plan_changes_userId_changedAt_idx" ON "plan_changes"("userId", "changedAt");

CREATE TABLE "contact_messages" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "ContactMessageStatus" NOT NULL DEFAULT 'PENDING',
  "channel" TEXT NOT NULL DEFAULT 'email',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contact_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX "contact_messages_userId_idx" ON "contact_messages"("userId");
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");
`;
await client.query(tablesSql);

console.log("✓ Schema aplicado com sucesso.");
await client.end();
