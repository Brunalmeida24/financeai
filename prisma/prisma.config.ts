import path from "path";
import { defineConfig } from "prisma/config";

const directUrl = "postgresql://postgres.djmwfqwxhubxbbucsuif:Zurq180319%40@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const { default: pg } = await import("pg");

      const pool = new pg.Pool({ connectionString: directUrl });

      return new PrismaPg(pool);
    },
  },
});