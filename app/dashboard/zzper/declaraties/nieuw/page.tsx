export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NieuweDeclaratieForm from "./NieuweDeclaratieForm";

export default async function NieuweDeclaratiePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as { id: string }).id;

  // Haal instellingen op waarvoor ZZP'er gewerkt heeft
  const employers = await prisma.employer.findMany({
    where: {
      shifts: {
        some: {
          applications: { some: { userId, status: { in: ["ACCEPTED", "COMPLETED", "APPROVED"] } } },
        },
      },
    },
    select: { id: true, companyName: true },
    orderBy: { companyName: "asc" },
  });

  // Haal ook uurtarief op
  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
    select: { hourlyRate: true },
  });

  return (
    <div className="px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Nieuw</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Declaratie aanmaken
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Vul de gewerkte uren in en dien in bij je opdrachtgever.
        </p>
        <NieuweDeclaratieForm employers={employers} defaultTarief={Number(profile?.hourlyRate ?? 0)} />
      </div>
    </div>
  );
}
