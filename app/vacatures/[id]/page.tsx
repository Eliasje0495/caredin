import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import SolliciterenButton from "./SolliciterenButton";

export const dynamic = "force-dynamic";

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
  ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", GEDRAGSDESKUNDIGE: "Gedragsdeskundige",
  ARTS: "Arts", FYSIOTHERAPEUT: "Fysiotherapeut", ERGOTHERAPEUT: "Ergotherapeut",
  LOGOPEDIST: "Logopedist", KRAAMVERZORGENDE: "Kraamverzorgende", OVERIG: "Overig",
};

const SECTOR_LABELS: Record<string, string> = {
  VVT: "Ouderenzorg (VVT)", GGZ: "GGZ", JEUGDZORG: "Jeugdzorg",
  ZIEKENHUIS: "Ziekenhuiszorg", HUISARTSENZORG: "Huisartsenzorg",
  GEHANDICAPTENZORG: "Gehandicaptenzorg", KRAAMZORG: "Kraamzorg",
  THUISZORG: "Thuiszorg", REVALIDATIE: "Revalidatie", OVERIG: "Overig",
};

export default async function VacatureDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const shift = await prisma.shift.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
      applications: userId ? { where: { userId } } : false,
    },
  });

  if (!shift) notFound();

  const hasApplied = userId ? (shift.applications as any[]).length > 0 : false;

  const start = new Date(shift.startTime);
  const end   = new Date(shift.endTime);
  const dateStr   = start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const startTime = start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const endTime   = end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const durationHours = ((end.getTime() - start.getTime()) / 3600000 - shift.breakMinutes / 60).toFixed(1);

  return (
    <>
      <Nav />

      {/* Banner */}
      <div className="px-12 py-12 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto">
          <Link href="/vacatures" className="no-underline text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
            ← Terug naar vacatures
          </Link>
          <h1 className="text-[42px] font-bold text-white tracking-[-1px] mt-3" style={{ fontFamily: "var(--font-fraunces)" }}>
            {FUNCTION_LABELS[shift.function] ?? shift.function}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            {shift.employer.companyName} · {shift.city}
          </p>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex gap-8">

            {/* Main */}
            <main className="flex-1 space-y-5">

              {/* Shift info */}
              <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>{shift.title}</h2>
                    <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{SECTOR_LABELS[shift.sector] ?? shift.sector}</div>
                  </div>
                  <div className="flex gap-2">
                    {shift.isUrgent && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: "#ef4444" }}>Urgent</span>
                    )}
                    {shift.isNightShift && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: "#6366f1" }}>Nachtdienst</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Datum",    value: dateStr },
                    { label: "Tijd",     value: `${startTime} – ${endTime} (${durationHours} uur netto)` },
                    { label: "Locatie",  value: `${shift.address}, ${shift.postalCode} ${shift.city}` },
                    { label: "Uurtarief",value: `€ ${Number(shift.hourlyRate).toFixed(2)} / uur` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl px-4 py-3" style={{ background: "var(--teal-light)" }}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>{label}</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{value}</div>
                    </div>
                  ))}
                </div>

                {shift.description && (
                  <div>
                    <h3 className="text-base font-bold mb-2" style={{ color: "var(--dark)" }}>Omschrijving</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{shift.description}</p>
                  </div>
                )}
              </div>

              {/* Vereisten */}
              <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Vereisten</h3>
                <div className="space-y-3">
                  {[
                    { active: shift.requiresBig, label: "BIG-registratie vereist" },
                    { active: shift.requiresSkj, label: "SKJ-registratie vereist" },
                    ...(shift.minExperience > 0
                      ? [{ active: true, label: `Minimaal ${shift.minExperience} jaar ervaring` }]
                      : []),
                  ].map(({ active, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: active ? "var(--teal)" : "var(--border)" }}>
                        {active ? "✓" : "–"}
                      </span>
                      <span className="text-sm" style={{ color: active ? "var(--text)" : "var(--muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0">
              <div className="sticky top-[84px] space-y-4">

                {/* Solliciteer */}
                <div className="rounded-2xl p-6 bg-white" style={{ border: "1.5px solid var(--teal)" }}>
                  <div className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                    €{Number(shift.hourlyRate).toFixed(2)}<span className="text-base font-normal">/uur</span>
                  </div>
                  <div className="text-sm mb-5" style={{ color: "var(--muted)" }}>
                    {startTime} – {endTime} · {durationHours} uur netto
                  </div>
                  <SolliciterenButton
                    shiftId={shift.id}
                    shiftStatus={shift.status}
                    isLoggedIn={!!session}
                    hasApplied={hasApplied}
                  />
                  {!session && (
                    <p className="text-xs mt-3 text-center" style={{ color: "var(--muted)" }}>
                      <Link href="/inloggen" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Inloggen</Link>
                      {" "}of{" "}
                      <Link href="/registreren" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>registreren</Link>
                    </p>
                  )}
                </div>

                {/* Bedrijf */}
                <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>Over de instelling</h3>
                  {shift.employer.logo ? (
                    <img src={shift.employer.logo} alt={shift.employer.companyName}
                      className="w-14 h-14 rounded-xl object-contain mb-3" style={{ border: "0.5px solid var(--border)" }} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-2xl"
                      style={{ background: "var(--teal-light)" }}>🏥</div>
                  )}
                  <div className="text-base font-bold mb-0.5" style={{ color: "var(--dark)" }}>{shift.employer.companyName}</div>
                  {shift.employer.sector && (
                    <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                      {SECTOR_LABELS[shift.employer.sector] ?? shift.employer.sector}
                    </div>
                  )}
                  {shift.employer.city && (
                    <div className="text-xs" style={{ color: "var(--muted)" }}>📍 {shift.employer.city}</div>
                  )}
                  {shift.employer.description && (
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {shift.employer.description.slice(0, 150)}{shift.employer.description.length > 150 ? "…" : ""}
                    </p>
                  )}
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
