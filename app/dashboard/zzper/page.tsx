export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ZzperDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id;

  const [profile, applications] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId } }),
    prisma.shiftApplication.findMany({
      where: { userId },
      include: { shift: { include: { employer: true } } },
      orderBy: { appliedAt: "desc" },
      take: 10,
    }),
  ]);

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
            Goedemiddag, {session.user?.name?.split(" ")[0]} 👋
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

        {/* Recent applications */}
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "var(--dark)" }}>Recente aanmeldingen</h2>
            <Link href="/dashboard/zzper/diensten" className="text-xs font-semibold no-underline" style={{ color: "var(--teal)" }}>Alle bekijken →</Link>
          </div>
          {applications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>Nog geen aanmeldingen</p>
              <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Zoek een dienst en meld je direct aan.</p>
              <Link href="/diensten"
                className="inline-flex px-5 py-2.5 rounded-full text-sm font-semibold text-white no-underline"
                style={{ background: "var(--teal)" }}>Dienst zoeken →</Link>
            </div>
          ) : (
            <div>
              {applications.map((app: any) => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--dark)" }}>{app.shift.title}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {app.shift.employer.companyName} · {app.shift.city} · {new Date(app.shift.startTime).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: statusColor[app.status] + "20", color: statusColor[app.status] }}>
                    {statusLabel[app.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
    </div>
  );
}
