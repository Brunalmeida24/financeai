import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string | null;
      role?: string | null;
      phone?: string | null;
      lastLoginAt?: string | null;
    };
  }
}
