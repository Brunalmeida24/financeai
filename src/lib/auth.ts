import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { ensureOwner, isOwnerEmail } from "./owner";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!valid) return null;

        // Garante privilégios de owner e atualiza último login
        const upgraded = await ensureOwner({
          id: user.id,
          email: user.email,
          role: user.role,
          plan: user.plan,
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return upgraded;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.role = (user as any).role;
        token.phone = (user as any).phone ?? null;
        token.lastLoginAt = (user as any).lastLoginAt ?? null;
      }
      // Re-checagem leve: se o e-mail no token é de owner mas a role não bateu,
      // corrige na hora. Isso cobre tokens antigos emitidos antes de um e-mail
      // virar owner.
      if (token.email && isOwnerEmail(token.email as string)) {
        if (token.role !== "OWNER" || token.plan !== "PREMIUM") {
          const u = await ensureOwner({
            id: token.id as string,
            email: token.email as string,
            role: token.role as any,
            plan: token.plan as any,
          });
          token.role = u.role;
          token.plan = u.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) ?? "FREE";
        session.user.role = (token.role as string) ?? "USER";
        session.user.phone = (token.phone as string | null) ?? null;
        session.user.lastLoginAt =
          (token.lastLoginAt as string | null) ?? null;
      }
      return session;
    },
  },
};
