import Link from "next/link";
import { TrustBadge } from "@/components/ui/TrustBadge";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
                💰
              </div>
              <span className="font-display font-bold">FinanceAI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Seu copiloto financeiro pessoal, feito com carinho no Brasil.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 max-w-md">
              <TrustBadge
                emoji="🔒"
                title="Criptografado"
                description="HTTPS + bcrypt"
                className="flex-1 min-w-[180px]"
              />
              <TrustBadge
                emoji="🇧🇷"
                title="Brasil"
                description="Servidores em SP"
                className="flex-1 min-w-[180px]"
              />
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Produto
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Termos de uso</li>
              <li>Política de privacidade</li>
              <li>LGPD</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} FinanceAI. Feito com 💜 no Brasil.
          </div>
          <div>🔒 Seus dados estão seguros conosco.</div>
        </div>
      </div>
    </footer>
  );
}
