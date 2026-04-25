export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AanmeldingenTabs } from "./AanmeldingenTabs";
import { calcMatchScore, matchLabel } from "@/lib/match-score";

export default async function ZzperDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id;

  const now = new Date();

  const profile = await prisma.workerProfile.findUnique({ where: { userId } });

  const [applications, upcomingShifts, suggestedShifts, dashUser] = await Promise.all([
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
    prisma.shift.findMany({
      where: {
        status: "OPEN",
        ...(profile?.primaryFunction ? { function: profile.primaryFunction as any } : {}),
        ...(profile?.city ? { city: profile.city } : {}),
      },
      include: { employer: { select: { companyName: true } } },
      orderBy: [{ isUrgent: "desc" }, { startTime: "asc" }],
      take: 4,
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, phone: true, image: true } }),
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

        {/* Profile completion */}
        {(() => {
          const fields = [
            dashUser?.name, dashUser?.phone,
            dashUser?.image, profile?.bio,
            profile?.dateOfBirth, profile?.address, profile?.city,
            profile?.postalCode, profile?.bigNumber, profile?.kvkNumber,
            profile?.hourlyRate ? String(profile.hourlyRate) : null, profile?.radius,
          ];
          const filled = fields.filter(f => f !== null && f !== "" && f !== undefined).length;
          const pct = Math.round((filled / fields.length) * 100);
          if (pct >= 80) return null;
          return (
            <div className="rounded-2xl p-5 mb-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>Profiel voltooiing</div>
                <Link href="/dashboard/zzper/profiel" className="text-xs font-semibold no-underline" style={{ color: "var(--teal)" }}>Aanvullen →</Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--teal-light)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 60 ? "var(--teal)" : "#F59E0B" }} />
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: pct >= 60 ? "var(--teal)" : "#92400E" }}>{pct}%</span>
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                Een volledig profiel vergroot je kans op geaccepteerd worden bij diensten.
              </p>
            </div>
          );
        })()}

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

        {/* Passende diensten */}
        {suggestedShifts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-bold uppercase tracking-[1.2px]" style={{ color: "var(--teal)" }}>
                Passende diensten ({suggestedShifts.length})
              </div>
              <Link href="/diensten" className="text-xs no-underline font-semibold" style={{ color: "var(--teal)" }}>
                Alle diensten →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(suggestedShifts as any[]).map((shift) => {
                const start = new Date(shift.startTime);
                const end   = new Date(shift.endTime);
                const hours = (end.getTime() - start.getTime()) / 3600000 - (shift.breakMinutes ?? 30) / 60;
                const earn  = (hours * Number(shift.hourlyRate)).toFixed(0);
                return (
                  <Link key={shift.id} href={`/diensten/${shift.id}`}
                    className="no-underline rounded-2xl px-5 py-4 bg-white group"
                    style={{ border: "0.5px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                        {shift.isUrgent ? "Urgent" : "Open"}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "var(--teal)" }}>~€{earn}</span>
                    </div>
                    {(() => {
                      const s = calcMatchScore({
                        workerFunction: profile?.primaryFunction ?? null,
                        workerCity: profile?.city ?? null,
                        isVerified: profile?.isVerified ?? false,
                        workerBig: profile?.bigStatus ?? undefined,
                        workerKvk: profile?.kvkStatus ?? undefined,
                        shiftFunction: shift.function,
                        shiftCity: shift.city,
                        requiresBig: shift.requiresBig,
                        requiresKvk: shift.requiresKvk,
                      });
                      const m = matchLabel(s);
                      return (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: m.bg, color: m.color }}>
                          {s}% · {m.label}
                        </span>
                      );
                    })()}
                    <div className="text-sm font-bold mb-0.5" style={{ color: "var(--dark)" }}>{shift.title}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {shift.employer.companyName} · {shift.city}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {start.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}{" "}
                      {start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}–
                      {end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
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
