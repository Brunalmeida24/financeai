"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const Ctx = createContext<{
  balanceVisible: boolean;
  toggle: () => void;
} | null>(null);

export function BalanceVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  return (
    <Ctx.Provider
      value={{ balanceVisible: visible, toggle: () => setVisible((v) => !v) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBalanceVisibility() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { balanceVisible: true, toggle: () => {} };
  }
  return ctx;
}

export function Hideable({
  value,
  hidden,
  formatter = (v) => v,
}: {
  value: string;
  hidden: boolean;
  formatter?: (v: string) => string;
}) {
  return (
    <span className="inline-block transition-all">
      {hidden ? "••••••" : formatter(value)}
    </span>
  );
}
