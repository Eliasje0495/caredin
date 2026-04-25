export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StripeConnectButton from "./StripeConnectButton";

export default async function FinancieelPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const profile = await prisma.workerProfile.findUnique({ where: { userId } });
  const recentApps = await prisma.shiftApplication.findMany({
    where: { userId, status: "APPROVED" },
    include: { shift: { include: { employer: true } } },
    orderBy: { paidAt: "desc" },
    take: 12,
  });

  const totalEarned = Number(profile?.totalEarned ?? 0);
  const totalHours  = Number(profile?.totalHours ?? 0);
  const avgRate     = totalHours > 0 ? totalEarned / totalHours : 0;

  // Monthly earnings for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyApps = await prisma.shiftApplication.findMany({
    where: { userId, status: "APPROVED", paidAt: { gte: sixMonthsAgo } },
    select: { paidAt: true, payoutAmount: true },
  });

  const monthlyMap: Record<string, number> = {};
  for (const app of monthlyApps) {
    if (!app.paidAt) continue;
    const key = app.paidAt.toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
    monthlyMap[key] = (monthlyMap[key] ?? 0) + Number(app.payoutAmount ?? 0);
  }
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
  });
  const monthlyData = months.map(m => ({ month: m, amount: monthlyMap[m] ?? 0 }));
  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);

  return (
    <div className="px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Jouw verdiensten</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-8" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Financieel overzicht
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Totaal verdiend",   value: `€${totalEarned.toFixed(0)}` },
            { label: "Uren gewerkt",      value: `${totalHours.toFixed(0)} uur` },
            { label: "Gemiddeld tarief",  value: `€${avgRate.toFixed(2)}/uur` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Monthly earnings chart */}
        <div className="rounded-2xl bg-white p-5 mb-6" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: "var(--dark)" }}>Verdiensten per maand</div>
          <div className="flex items-end gap-2 h-24">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-semibold" style={{ color: "var(--teal)" }}>
                  {d.amount > 0 ? `€${d.amount.toFixed(0)}` : ""}
                </div>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max((d.amount / maxAmount) * 72, d.amount > 0 ? 4 : 0)}px`,
                    background: d.amount > 0 ? "var(--teal)" : "var(--teal-light)",
                    minHeight: d.amount > 0 ? "4px" : "2px",
                  }}
                />
                <div className="text-[10px]" style={{ color: "var(--muted)" }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe Connect */}
        <div className="rounded-2xl p-6 mb-6 flex items-center justify-between bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "var(--teal-light)" }}>🏦</div>
            <div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--dark)" }}>Bankrekening</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Koppel je rekening voor uitbetaling binnen 48 uur</div>
            </div>
          </div>
          <StripeConnectButton stripeOnboarded={profile?.isVerified ?? false} />
        </div>

        {/* Recent payouts */}
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--dark)" }}>Recente uitbetalingen</h2>
          </div>
          {recentApps.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>Nog geen uitbetalingen.</p>
            </div>
          ) : (
            recentApps.map((app: any, i: number) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: i < recentApps.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--dark)" }}>{app.shift.title}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {app.shift.employer.companyName} · {new Date(app.shift.startTime).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    {app.hoursWorked ? ` · ${Number(app.hoursWorked).toFixed(1)} uur` : ""}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="text-sm font-semibold" style={{ color: "var(--teal)" }}>
                    {app.payoutAmount ? `€${Number(app.payoutAmount).toFixed(2)}` : "—"}
                  </div>
                  <div className="text-[10px]" style={{ color: app.stripeTransferId ? "#065f46" : "var(--muted)" }}>
                    {app.stripeTransferId ? "Overgemaakt" : app.paidAt ? "Goedgekeurd" : ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
