export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeclaratiesClient from "./DeclaratiesClient";

export default async function DeclaratiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as { id: string }).id;

  const [declaraties, employers] = await Promise.all([
    prisma.declaratie.findMany({
      where: { userId },
      include: { employer: { select: { id: true, companyName: true } }, regels: true },
      orderBy: { createdAt: "desc" },
    }),
    // Instellingen waarvoor de ZZP'er ooit een shift heeft gedaan
    prisma.employer.findMany({
      where: {
        shifts: {
          some: {
            applications: { some: { userId, status: { in: ["ACCEPTED","COMPLETED","APPROVED"] } } },
          },
        },
      },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
  ]);

  const totaalOpen      = declaraties.filter(d => d.status === "INGEDIEND").reduce((s, d) => s + Number(d.totaalBedrag), 0);
  const totaalBetaald   = declaraties.filter(d => d.status === "BETAALD").reduce((s, d) => s + Number(d.totaalBedrag), 0);
  const aantalIngediend = declaraties.filter(d => d.status === "INGEDIEND").length;

  return (
    <div className="px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Facturatie</p>
            <h1 className="text-[28px] font-bold tracking-[-0.5px]" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Zorgdeclaraties
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Dien declaraties in bij jouw opdrachtgevers en volg de status.
            </p>
          </div>
          <Link href="/dashboard/zzper/declaraties/nieuw"
            className="px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline flex-shrink-0"
            style={{ background: "var(--teal)" }}>
            + Nieuwe declaratie
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Openstaand",     value: `€${totaalOpen.toFixed(2)}`,    sub: `${aantalIngediend} ingediend` },
            { label: "Totaal ontvangen", value: `€${totaalBetaald.toFixed(2)}`, sub: `${declaraties.filter(d => d.status === "BETAALD").length} betaald` },
            { label: "Totaal declaraties", value: declaraties.length,            sub: `${declaraties.filter(d => d.status === "CONCEPT").length} concept` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[26px] font-bold leading-none mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
                {s.value}
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: "var(--dark)" }}>{s.label}</div>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <DeclaratiesClient declaraties={declaraties as any} employers={employers} />
      </div>
    </div>
  );
}
