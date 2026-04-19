export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ExportClient from "./ExportClient";

export default async function ExportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const shifts = await prisma.shift.findMany({
    where: { employerId: employer.id },
    include: {
      applications: {
        where: { status: { in: ["APPROVED", "COMPLETED", "ACCEPTED"] } },
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { startTime: "desc" },
  });

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Shifts exporteren
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Download een CSV-overzicht van al je diensten voor boekhouding of loonadministratie.</p>
        </div>
        <ExportClient shifts={JSON.parse(JSON.stringify(shifts))} />
      </main>
    </div>
  );
}
