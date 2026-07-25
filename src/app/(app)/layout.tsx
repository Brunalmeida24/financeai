import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"hsl(234 28% 7%)" }}>
      <Sidebar />
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <Topbar user={session.user} />
        <main style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
