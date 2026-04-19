export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StatistiekenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const allApps = await prisma.shiftApplication.findMany({
    where: { status: "APPROVED", shift: { employerId: employer.id } },
    include: { shift: { select: { function: true, sector: true, startTime: true, hourlyRate: true } } },
  });

  const totalShifts   = await prisma.shift.count({ where: { employerId: employer.id } });
  const openShifts    = await prisma.shift.count({ where: { employerId: employer.id, status: "OPEN" } });
  const filledShifts  = await prisma.shift.count({ where: { employerId: employer.id, status: { in: ["FILLED","IN_PROGRESS","COMPLETED","APPROVED"] } } });
  const totalHours    = allApps.reduce((s, a) => s + Number(a.hoursWorked ?? 0), 0);
  const totalSpend    = allApps.reduce((s, a) => s + Number(a.payoutAmount ?? 0) + Number(a.platformFee ?? 0), 0);
  const totalWorkers  = new Set(allApps.map(a => a.userId)).size;

  // Per function breakdown
  const byFunction: Record<string, { shifts: number; hours: number; spend: number }> = {};
  for (const a of allApps) {
    const fn = a.shift.function;
    if (!byFunction[fn]) byFunction[fn] = { shifts: 0, hours: 0, spend: 0 };
    byFunction[fn].shifts++;
    byFunction[fn].hours += Number(a.hoursWorked ?? 0);
    byFunction[fn].spend += Number(a.payoutAmount ?? 0) + Number(a.platformFee ?? 0);
  }

  // Monthly breakdown (last 6 months)
  const months: { label: string; shifts: number; hours: number; spend: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
    const mApps = allApps.filter(a => {
      const t = new Date(a.shift.startTime);
      return t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear();
    });
    months.push({
      label,
      shifts: mApps.length,
      hours: mApps.reduce((s, a) => s + Number(a.hoursWorked ?? 0), 0),
      spend: mApps.reduce((s, a) => s + Number(a.payoutAmount ?? 0) + Number(a.platformFee ?? 0), 0),
    });
  }

  const FUNCTION_LABELS: Record<string, string> = {
    VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
    HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
    ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
    PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", ARTS: "Arts",
    FYSIOTHERAPEUT: "Fysiotherapeut", OVERIG: "Overig",
  };

  return (
    <div>
      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Statistieken
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Overzicht van jouw gebruik van het platform.</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Totale diensten",   value: totalShifts },
            { label: "Open / Ingevuld",   value: `${openShifts} / ${filledShifts}` },
            { label: "Unieke professionals", value: totalWorkers },
            { label: "Uren ingezet",      value: `${totalHours.toFixed(0)} uur` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[26px] font-bold leading-none mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>{s.value}</div>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Monthly bar chart (CSS only) */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--teal)" }}>Diensten per maand</div>
            <div className="flex items-end gap-2 h-32">
              {months.map(m => {
                const max = Math.max(...months.map(x => x.shifts), 1);
                const pct = (m.shifts / max) * 100;
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-semibold" style={{ color: "var(--teal)" }}>{m.shifts || ""}</div>
                    <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max(pct, 4)}%`, background: "var(--teal)", opacity: 0.8 }} />
                    <div className="text-[9px]" style={{ color: "var(--muted)" }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spend per month */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--teal)" }}>Kosten per maand</div>
            <div className="flex items-end gap-2 h-32">
              {months.map(m => {
                const max = Math.max(...months.map(x => x.spend), 1);
                const pct = (m.spend / max) * 100;
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-semibold" style={{ color: "#1E40AF" }}>{m.spend > 0 ? `€${m.spend.toFixed(0)}` : ""}</div>
                    <div className="w-full rounded-t-md" style={{ height: `${Math.max(pct, 4)}%`, background: "#3B82F6", opacity: 0.7 }} />
                    <div className="text-[9px]" style={{ color: "var(--muted)" }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* By function */}
        {Object.keys(byFunction).length > 0 && (
          <div className="mt-6 rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            <div className="px-6 py-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
              <div className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: "var(--teal)" }}>Per functie</div>
            </div>
            {Object.entries(byFunction).sort((a, b) => b[1].shifts - a[1].shifts).map(([fn, data]) => (
              <div key={fn} className="grid items-center px-6 py-3" style={{ gridTemplateColumns: "1fr 80px 100px 100px", borderBottom: "0.5px solid var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{FUNCTION_LABELS[fn] ?? fn}</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{data.shifts} diensten</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{data.hours.toFixed(0)} uur</span>
                <span className="text-sm font-semibold text-right" style={{ color: "var(--teal)" }}>€{data.spend.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}

        {allApps.length === 0 && (
          <div className="mt-8 rounded-2xl p-12 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-3xl mb-3">📊</div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>Nog geen statistieken</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Statistieken worden beschikbaar zodra eerste diensten zijn goedgekeurd.</p>
          </div>
        )}
      </main>
    </div>
  );
}
