export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ZzperNav } from "./ZzperNav";

export default async function ZzperLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const role = (session.user as any).role;
  if (role !== "WORKER") redirect("/dashboard/organisatie");

  const userName = session.user?.name ?? "Professional";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <ZzperNav userName={userName} userInitial={userInitial} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
