"use client";

import { Topbar } from "./Topbar";
import { useBalanceVisibility } from "./BalanceVisibility";

export function TopbarClient({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    plan?: string | null;
    role?: string | null;
  };
}) {
  const { balanceVisible, toggle } = useBalanceVisibility();
  return <Topbar user={user} balanceVisible={balanceVisible} onToggleBalance={toggle} />;
}
