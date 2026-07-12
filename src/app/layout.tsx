import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FinanceAI — Seu copiloto financeiro",
  description:
    "Controle suas finanças com inteligência artificial. Score, metas, investimentos e copiloto IA em um só app.",
  themeColor: "#0c0d18",
  openGraph: {
    title: "FinanceAI — Seu copiloto financeiro",
    description:
      "Controle suas finanças com IA. Plano Free, Pro R$ 9,90, Premium R$ 19,90.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0d18",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
