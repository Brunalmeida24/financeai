import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BalanceVisibilityProvider } from "@/components/layout/BalanceVisibility";
import { isOwner } from "@/lib/plan";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Redireciona para onboarding na primeira entrada (apenas usuário comum)
  if (
    session.user.role !== "OWNER" &&
    !(session.user as any).onboardingCompleted
  ) {
    redirect("/onboarding");
  }

  const owner = isOwner(session);

  return (
    <BalanceVisibilityProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar isOwner={owner} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopbarClient
            user={{
              name: session.user.name,
              email: session.user.email,
              plan: session.user.plan,
              role: session.user.role,
            }}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </BalanceVisibilityProvider>
  );
}

import { TopbarClient } from "@/components/layout/TopbarClient";
