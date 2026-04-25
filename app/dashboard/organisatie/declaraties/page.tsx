export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrgDeclaratiesClient from "./OrgDeclaratiesClient";

export default async function OrgDeclaratiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as { id: string }).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const declaraties = await prisma.declaratie.findMany({
    where: { employerId: employer.id },
    include: {
      user: { select: { name: true, email: true } },
      regels: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const openstaand  = declaraties.filter(d => d.status === "INGEDIEND").reduce((s, d) => s + Number(d.totaalBedrag), 0);
  const uitbetaald  = declaraties.filter(d => d.status === "BETAALD").reduce((s, d) => s + Number(d.totaalBedrag), 0);
  const terGoedkeuring = declaraties.filter(d => d.status === "INGEDIEND").length;

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Facturatie</p>
          <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Zorgdeclaraties
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Ingediende declaraties van jouw zorgprofessionals. Keur goed of wijs af.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Ter beoordeling", value: terGoedkeuring, sub: "ingediend" },
            { label: "Openstaand bedrag", value: `€${openstaand.toFixed(2)}`, sub: "nog niet betaald" },
            { label: "Totaal uitbetaald", value: `€${uitbetaald.toFixed(2)}`, sub: `${declaraties.filter(d => d.status === "BETAALD").length} declaraties` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[26px] font-bold leading-none mb-1"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
                {s.value}
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: "var(--dark)" }}>{s.label}</div>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <OrgDeclaratiesClient declaraties={declaraties as any} />
      </main>
    </div>
  );
}
