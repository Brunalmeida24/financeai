import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const CONNECTION_STRING = "postgresql://postgres.djmwfqwxhubxbbucsuif:mUjoqBgeV4x7Ktec@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: CONNECTION_STRING });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;