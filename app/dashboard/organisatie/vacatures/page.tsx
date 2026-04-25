export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  DRAFT:     { label: "Concept",   color: "bg-gray-100 text-gray-500" },
  OPEN:      { label: "Open",      color: "bg-teal-50 text-teal-700" },
  FILLED:    { label: "Ingevuld",  color: "bg-green-100 text-green-700" },
  EXPIRED:   { label: "Verlopen", color: "bg-yellow-100 text-yellow-700" },
  CANCELLED: { label: "Gesloten", color: "bg-red-100 text-red-700" },
};

export default async function VacaturesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId   = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const vacatures = await prisma.vacancy.findMany({
    where:   { employerId: employer.id, status: { not: "CANCELLED" } },
    orderBy: { publishedAt: "desc" },
  });

  const open   = vacatures.filter(v => v.status === "OPEN").length;
  const filled = vacatures.filter(v => v.status === "FILLED").length;

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Vacatures
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Vaste functies en loondienst-posities bij jouw zorginstelling.
            </p>
          </div>
          <Link href="/dashboard/organisatie/vacatures/nieuw"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
            style={{ background: "var(--teal)" }}>
            + Vacature plaatsen
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Totaal", value: vacatures.length },
            { label: "Open",   value: open },
            { label: "Ingevuld", value: filled },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Lijst */}
        {vacatures.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <p className="text-4xl mb-4">📋</p>
            <p className="font-bold text-lg mb-2" style={{ color: "var(--dark)", fontFamily: "var(--font-fraunces)" }}>
              Nog geen vacatures
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              Zoek je vaste medewerkers? Plaats je eerste vacature en bereik duizenden gekwalificeerde zorgprofessionals.
            </p>
            <Link href="/dashboard/organisatie/vacatures/nieuw"
              className="inline-flex px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Eerste vacature plaatsen →
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            {vacatures.map((v, i) => {
              const st = STATUS_LABEL[v.status] ?? STATUS_LABEL.OPEN;
              return (
                <div key={v.id}
                  className="flex items-center justify-between px-6 py-5"
                  style={{ borderBottom: i < vacatures.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm" style={{ color: "var(--dark)" }}>{v.title}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {v.city}
                      {v.hoursPerWeek ? ` · ${v.hoursPerWeek} u/week` : ""}
                      {v.salaryMin && v.salaryMax
                        ? ` · €${Number(v.salaryMin).toFixed(0)}–€${Number(v.salaryMax).toFixed(0)}/mnd`
                        : v.salaryMin
                        ? ` · v.a. €${Number(v.salaryMin).toFixed(0)}/mnd`
                        : ""}
                      {` · ${new Date(v.publishedAt).toLocaleDateString("nl-NL")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <Link href={`/dashboard/organisatie/vacatures/${v.id}`}
                      className="text-xs font-semibold no-underline px-3 py-1.5 rounded-xl"
                      style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                      Bewerken
                    </Link>
                    {v.status === "OPEN" && (
                      <Link href={`/vacatures/${v.id}`}
                        className="text-xs font-semibold no-underline px-3 py-1.5 rounded-xl text-white"
                        style={{ background: "var(--teal)" }}>
                        Bekijken →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
