"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { user?: { name?: string | null; email?: string | null } };
}) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Visão geral", emoji: "📊", exact: true },
    { href: "/admin/users", label: "Clientes", emoji: "👥" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass-strong border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-success/20 text-success flex items-center justify-center border border-success/30">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="font-display font-bold text-sm">
                  FinanceAI · Admin
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Painel do dono
                </div>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              {items.map((i) => {
                const active = i.exact
                  ? pathname === i.href
                  : pathname?.startsWith(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-2",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                  >
                    <span>{i.emoji}</span>
                    {i.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← App
            </Link>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-foreground font-medium">
                {session.user?.name ?? "Dono"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {session.user?.email}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-9 h-9 rounded-lg btn-ghost flex items-center justify-center"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
