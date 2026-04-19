export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrgNav from "./OrgNav";

export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const pendingCheckouts = await prisma.shiftApplication.count({
    where: { status: "COMPLETED", shift: { employerId: employer.id } },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <OrgNav
        companyName={employer.companyName}
        initial={employer.companyName[0]?.toUpperCase() ?? "?"}
        pendingCheckouts={pendingCheckouts}
      />
      {children}
    </div>
  );
}
