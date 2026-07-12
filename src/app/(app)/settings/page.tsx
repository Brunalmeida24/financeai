import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";
import Link from "next/link";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { profile: true },
  });

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold">⚙️ Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie sua conta, plano e segurança
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>👤 Perfil</CardTitle>
            <CardDescription>
              Como você aparece no FinanceAI
            </CardDescription>
          </div>
          <PlanBadge plan={user?.plan} />
        </div>

        <SettingsForm
          name={user?.name ?? ""}
          email={user?.email ?? ""}
          phone={user?.phone ?? ""}
        />
      </Card>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <CardTitle>💎 Plano</CardTitle>
            <CardDescription>
              Você está no{" "}
              <strong className="text-foreground">
                {user?.plan === "FREE"
                  ? "Free"
                  : user?.plan === "PRO"
                  ? "Pro"
                  : "Premium"}
              </strong>
              .
            </CardDescription>
          </div>
          <Link href="/pricing">
            <Button variant="outline" size="sm">
              {user?.plan === "FREE" ? "Fazer upgrade →" : "Gerenciar plano"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-secondary/40 p-3">
            <div className="text-[11px] text-muted-foreground uppercase">Free</div>
            <div className="font-display font-bold text-lg">R$ 0</div>
          </div>
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-3">
            <div className="text-[11px] text-primary uppercase">Pro ✨</div>
            <div className="font-display font-bold text-lg text-primary">R$ 9,90</div>
          </div>
          <div className="rounded-xl bg-success/10 border border-success/30 p-3">
            <div className="text-[11px] text-success uppercase">Premium 👑</div>
            <div className="font-display font-bold text-lg text-success">R$ 19,90</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>🔒 Segurança</CardTitle>
        <CardDescription>
          Como mantemos seus dados seguros
        </CardDescription>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <TrustBadge
            emoji="🔐"
            title="Senha criptografada"
            description="bcrypt + 12 rounds"
          />
          <TrustBadge
            emoji="🛡️"
            title="Sessões JWT"
            description="Tokens assinados e com expiração"
          />
          <TrustBadge
            emoji="🇧🇷"
            title="Servidores no Brasil"
            description="LGPD compliance"
          />
          <TrustBadge
            emoji="🚪"
            title="Sair de qualquer lugar"
            description="Botão 'Sair' invalida a sessão"
          />
        </div>
      </Card>
    </div>
  );
}
