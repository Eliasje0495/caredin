export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StatistiekenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalShifts, openShifts, filledShifts, totalApps, pendingApps,
    approvedApps, recentShifts, topWorkers,
  ] = await Promise.all([
    prisma.shift.count({ where: { employerId: employer.id } }),
    prisma.shift.count({ where: { employerId: employer.id, status: "OPEN" } }),
    prisma.shift.count({ where: { employerId: employer.id, status: { in: ["FILLED","IN_PROGRESS","COMPLETED","APPROVED"] } } }),
    prisma.shiftApplication.count({ where: { shift: { employerId: employer.id } } }),
    prisma.shiftApplication.count({ where: { status: "PENDING", shift: { employerId: employer.id } } }),
    prisma.shiftApplication.findMany({
      where: { status: "APPROVED", shift: { employerId: employer.id }, paidAt: { gte: sixMonthsAgo } },
      select: { paidAt: true, hoursWorked: true, payoutAmount: true, platformFee: true },
    }),
    prisma.shift.findMany({
      where: { employerId: employer.id, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true },
    }),
    prisma.shiftApplication.findMany({
      where: { status: "APPROVED", shift: { employerId: employer.id } },
      include: { user: { select: { name: true } } },
      orderBy: { hoursWorked: "desc" },
      take: 5,
    }),
  ]);

  // Monthly stats
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
  });

  const monthlyHours: Record<string, number> = {};
  const monthlyCost:  Record<string, number> = {};
  for (const app of approvedApps) {
    if (!app.paidAt) continue;
    const key = new Date(app.paidAt).toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
    monthlyHours[key] = (monthlyHours[key] ?? 0) + Number(app.hoursWorked ?? 0);
    monthlyCost[key]  = (monthlyCost[key]  ?? 0) + Number(app.payoutAmount ?? 0) + Number(app.platformFee ?? 0);
  }

  const totalHours   = approvedApps.reduce((s, a) => s + Number(a.hoursWorked ?? 0), 0);
  const totalCost    = approvedApps.reduce((s, a) => s + Number(a.payoutAmount ?? 0) + Number(a.platformFee ?? 0), 0);
  const fillRate     = totalShifts > 0 ? Math.round((filledShifts / totalShifts) * 100) : 0;
  const maxHours     = Math.max(...months.map(m => monthlyHours[m] ?? 0), 1);

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Statistieken
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Inzicht in je personeelsinzet en kosten.</p>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Diensten geplaatst",    value: totalShifts,               suffix: "" },
            { label: "Bezettingsgraad",       value: `${fillRate}%`,            suffix: "" },
            { label: "Totaal uren ingehuurd", value: totalHours.toFixed(0),     suffix: " uur" },
            { label: "Totale kosten",         value: `€${totalCost.toFixed(0)}`, suffix: "" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[26px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
                {s.value}{s.suffix}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Monthly hours chart */}
        <div className="rounded-2xl bg-white p-6 mb-6" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: "var(--dark)" }}>Ingehuurde uren per maand</div>
          <div className="flex items-end gap-3 h-28">
            {months.map(m => {
              const h = monthlyHours[m] ?? 0;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] font-semibold" style={{ color: "var(--teal)" }}>
                    {h > 0 ? `${h.toFixed(0)}u` : ""}
                  </div>
                  <div className="w-full rounded-t-lg"
                    style={{ height: `${Math.max((h / maxHours) * 88, h > 0 ? 4 : 2)}px`, background: h > 0 ? "var(--teal)" : "var(--teal-light)", minHeight: "2px" }} />
                  <div className="text-[10px]" style={{ color: "var(--muted)" }}>{m}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Status breakdown */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--dark)" }}>Dienst status</div>
            <div className="space-y-3">
              {[
                { label: "Open",      value: openShifts,    color: "#065F46" },
                { label: "Bezet",     value: filledShifts,  color: "var(--teal)" },
                { label: "Aanmeldingen in behandeling", value: pendingApps, color: "#92400E" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--muted)" }}>{s.label}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--teal-light)" }}>
                    <div className="h-full rounded-full" style={{ width: `${totalShifts > 0 ? Math.min(100, (s.value / totalShifts) * 100) : 0}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top workers */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--dark)" }}>Top professionals</div>
            {topWorkers.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--muted)" }}>Nog geen data.</p>
            ) : (
              <div className="space-y-2.5">
                {topWorkers.map((app, i) => (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: i === 0 ? "#F59E0B" : "var(--teal)" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 text-sm font-medium truncate" style={{ color: "var(--dark)" }}>
                      {app.user.name ?? "Onbekend"}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                      {Number(app.hoursWorked ?? 0).toFixed(0)} uur
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
