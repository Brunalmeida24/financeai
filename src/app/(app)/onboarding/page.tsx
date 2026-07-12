import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?next=/onboarding");
  if (session.user.role === "OWNER" || (session.user as any).onboardingCompleted) {
    redirect("/dashboard");
  }
  return <OnboardingFlow />;
}
