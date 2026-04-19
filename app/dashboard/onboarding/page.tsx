export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const role = (session.user as any).role as "WORKER" | "EMPLOYER";
  const name = session.user?.name ?? "daar";

  return <OnboardingForm role={role} name={name} />;
}
