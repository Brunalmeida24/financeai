import { RegisterClient } from "./RegisterClient";

export const metadata = {
  title: "Criar conta — FinanceAI",
};

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export default function RegisterPage() {
  return <RegisterClient googleEnabled={googleEnabled} />;
}
