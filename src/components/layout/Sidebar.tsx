"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/expenses", icon: "💸", label: "Gastos" },
  { href: "/goals", icon: "🎯", label: "Metas" },
  { href: "/investments", icon: "📈", label: "Investimentos" },
  { href: "/ai-chat", icon: "🤖", label: "Copiloto IA" },
  { href: "/news", icon: "📰", label: "Notícias" },
  { href: "/health", icon: "❤️", label: "Saúde" },
];

interface SidebarProps {
  isOwner?: boolean;
}

export function Sidebar({ isOwner = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] flex-shrink-0 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-base">
          💰
        </div>
        <div>
          <div className="font-display font-bold text-sm text-foreground">
            FinanceAI
          </div>
          <div className="text-[10px] text-muted-foreground">
            Seu copiloto financeiro
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="px-5 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2 text-sm transition-all ${
                isActive
                  ? "text-primary bg-primary/10 border-r-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <span className="text-base w-5 text-center" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {isOwner && (
          <>
            <div className="px-5 pt-4 pb-1 text-[10px] font-semibold text-success uppercase tracking-wider">
              Admin
            </div>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-5 py-2 text-sm transition-all ${
                pathname?.startsWith("/admin")
                  ? "text-success bg-success/10 border-r-2 border-success"
                  : "text-success/80 hover:text-success hover:bg-success/5"
              }`}
            >
              <ShieldCheck size={16} />
              Painel Admin
            </Link>
          </>
        )}
      </nav>

      {/* Settings + Logout */}
      <div className="border-t border-border p-2 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition"
        >
          <span className="text-base w-5 text-center" aria-hidden>
            ⚙️
          </span>
          Configurações
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}
