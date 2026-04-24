export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AanmeldingenTabs } from "./AanmeldingenTabs";

export default async function ZzperDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id;

  const now = new Date();

  const [profile, applications, upcomingShifts] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId } }),
    prisma.shiftApplication.findMany({
      where: { userId },
      include: { shift: { include: { employer: { select: { companyName: true } } } } },
      orderBy: { appliedAt: "desc" },
      take: 50,
    }),
    prisma.shiftApplication.findMany({
      where: { userId, status: "ACCEPTED", shift: { startTime: { gte: now } } },
      include: { shift: { include: { employer: { select: { companyName: true } } } } },
      orderBy: { shift: { startTime: "asc" } },
      take: 5,
    }),
  ]);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";

  const isVerified = profile?.isVerified ?? false;
  const bigOk = profile?.bigStatus === "VERIFIED";

  const statusColor: Record<string, string> = {
    PENDING:   "#92400E",
    ACCEPTED:  "#065F46",
    REJECTED:  "#991B1B",
    COMPLETED: "#1E40AF",
    APPROVED:  "#065F46",
    WITHDRAWN: "#6B7280",
  };
  const statusLabel: Record<string, string> = {
    PENDING:   "In behandeling",
    ACCEPTED:  "Geaccepteerd",
    REJECTED:  "Afgewezen",
    COMPLETED: "Afgerond",
    APPROVED:  "Goedgekeurd",
    WITHDRAWN: "Ingetrokken",
  };

  return (
    <div className="px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-fraunces text-[28px] font-bold mb-1" style={{ color: "var(--dark)" }}>
            {greeting}, {session.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Hier is een overzicht van je activiteiten.</p>
        </div>

        {/* Verification warning */}
        {!isVerified && (
          <div className="rounded-2xl p-5 mb-6 flex items-start gap-4"
            style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: "#92400E" }}>Profiel nog niet geverifieerd</div>
              <p className="text-sm leading-[1.6]" style={{ color: "#B45309" }}>
                Vul je registraties en KvK-gegevens in om diensten te accepteren.{" "}
                <Link href="/dashboard/zzper/profiel" className="font-semibold no-underline underline" style={{ color: "#92400E" }}>Profiel aanvullen →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Diensten gedaan",   value: profile?.totalShifts ?? 0,           suffix: "" },
            { label: "Uren gewerkt",      value: Number(profile?.totalHours ?? 0),    suffix: " uur" },
            { label: "Totaal verdiend",   value: `€${Number(profile?.totalEarned ?? 0).toFixed(0)}`, suffix: "" },
            { label: "Gemiddelde score",  value: profile?.averageRating ? `${profile.averageRating} ★` : "–", suffix: "" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="font-fraunces text-[28px] font-bold leading-none mb-1" style={{ color: "var(--teal)" }}>
                {s.value}{s.suffix}
              </div>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🔍", label: "Dienst zoeken",     href: "/diensten",                    desc: "Bekijk openstaande shifts" },
            { icon: "👤", label: "Profiel bewerken",  href: "/dashboard/zzper/profiel",     desc: "Registraties, tarief, beschikbaarheid" },
            { icon: "📋", label: "Mijn timesheets",   href: "/dashboard/zzper/timesheets",  desc: "Uren bekijken en declareren" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="rounded-2xl p-5 bg-white flex items-start gap-4 no-underline group"
              style={{ border: "0.5px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "var(--teal-light)" }}>{a.icon}</div>
              <div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--dark)" }}>{a.label}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming shifts */}
        {upcomingShifts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-bold uppercase tracking-[1.2px]" style={{ color: "var(--teal)" }}>
                Aankomende diensten ({upcomingShifts.length})
              </div>
              <Link href="/dashboard/zzper/timesheets" className="text-xs no-underline font-semibold" style={{ color: "var(--teal)" }}>
                Alle timesheets →
              </Link>
            </div>
            <div className="space-y-2">
              {(upcomingShifts as any[]).map((app) => {
                const shift = app.shift;
                const start = new Date(shift.startTime);
                const end   = new Date(shift.endTime);
                const isToday = start.toDateString() === now.toDateString();
                const isTomorrow = start.toDateString() === new Date(now.getTime() + 86400000).toDateString();
                const dayLabel = isToday ? "Vandaag" : isTomorrow ? "Morgen"
                  : start.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
                return (
                  <Link key={app.id} href="/dashboard/zzper/timesheets"
                    className="no-underline flex items-center gap-4 rounded-2xl px-5 py-4 bg-white group"
                    style={{ border: `0.5px solid ${isToday ? "rgba(26,122,106,0.4)" : "var(--border)"}`, background: isToday ? "rgba(26,122,106,0.03)" : "#fff" }}>
                    {/* Date block */}
                    <div className="flex-shrink-0 w-12 text-center rounded-xl py-2"
                      style={{ background: isToday ? "var(--teal)" : "var(--teal-light)" }}>
                      <div className="text-[10px] font-bold uppercase" style={{ color: isToday ? "rgba(255,255,255,0.7)" : "var(--teal)" }}>
                        {start.toLocaleDateString("nl-NL", { month: "short" })}
                      </div>
                      <div className="text-[22px] font-bold leading-none" style={{ fontFamily: "var(--font-fraunces)", color: isToday ? "#fff" : "var(--teal)" }}>
                        {start.getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate" style={{ color: "var(--dark)" }}>{shift.title}</span>
                        {isToday && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: "var(--teal)" }}>Vandaag</span>}
                        {isTomorrow && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>Morgen</span>}
                      </div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                        {shift.employer.companyName} · {shift.city} · {start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}–{end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-sm font-bold flex-shrink-0" style={{ color: "var(--teal)" }}>
                      €{Number(shift.hourlyRate).toFixed(0)}/u
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Applications with tabs */}
        <AanmeldingenTabs applications={applications as any} />
    </div>
    </div>
  );
}
