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
