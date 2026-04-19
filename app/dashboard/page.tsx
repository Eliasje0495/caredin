export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const role = (session.user as any).role;
  if (role === "EMPLOYER") redirect("/dashboard/organisatie");
  redirect("/dashboard/zzper");
}
