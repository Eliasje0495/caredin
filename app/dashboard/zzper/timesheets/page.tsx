export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CheckInOutButtons from "./CheckInOutButtons";
import ReviewButton from "./ReviewButton";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aangemeld", ACCEPTED: "Geaccepteerd",
  COMPLETED: "Wacht op goedkeuring", APPROVED: "Goedgekeurd & uitbetaald",
  REJECTED: "Afgewezen", WITHDRAWN: "Ingetrokken",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "#92400E", ACCEPTED: "#1E40AF",
  COMPLETED: "#7C3AED", APPROVED: "#065F46",
  REJECTED: "#991B1B", WITHDRAWN: "#6B7280",
};

export default async function TimesheetsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;

  const [applications, givenReviews] = await Promise.all([
    prisma.shiftApplication.findMany({
      where: { userId },
      include: { shift: { include: { employer: { include: { user: { select: { id: true } } } } } } },
      orderBy: { shift: { startTime: "desc" } },
    }),
    prisma.review.findMany({ where: { reviewerId: userId }, select: { reviewedId: true, rating: true } }),
  ]);
  const reviewMap = new Map(givenReviews.map(r => [r.reviewedId, r.rating]));

  const upcoming  = applications.filter(a => ["PENDING","ACCEPTED"].includes(a.status) && new Date(a.shift.startTime) > new Date());
  const active    = applications.filter(a => a.status === "ACCEPTED" && new Date(a.shift.startTime) <= new Date());
  const completed = applications.filter(a => ["COMPLETED","APPROVED"].includes(a.status));
  const other     = applications.filter(a => ["REJECTED","WITHDRAWN"].includes(a.status));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="bg-white px-8 h-[60px] flex items-center justify-between sticky top-0 z-40"
        style={{ borderBottom: "0.5px solid var(--border)" }}>
        <Link href="/" className="text-lg font-bold no-underline"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
          Care<span style={{ color: "var(--dark)" }}>din</span>
        </Link>
        <nav className="flex gap-6">
          {[
            { href: "/dashboard/zzper",              label: "Dashboard" },
            { href: "/vacatures",                    label: "Diensten zoeken" },
            { href: "/dashboard/zzper/timesheets",   label: "Mijn diensten" },
            { href: "/dashboard/zzper/profiel",      label: "Profiel" },
          ].map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium no-underline"
              style={{ color: n.href === "/dashboard/zzper/timesheets" ? "var(--teal)" : "var(--muted)" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "var(--teal)" }}>
          {session.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Mijn diensten
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Beheer je aanmeldingen, check in/uit en volg je uren.</p>
          </div>
          <a href="/api/ical" download="caredin-diensten.ics"
            className="px-4 py-2 rounded-[40px] text-sm font-semibold no-underline flex-shrink-0"
            style={{ background: "var(--teal-light)", color: "var(--teal)", border: "1px solid var(--teal)" }}>
            📅 Exporteer kalender
          </a>
        </div>

        {applications.length === 0 && (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">📋</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Nog geen diensten
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Zoek een dienst en meld je aan.</p>
            <Link href="/vacatures"
              className="inline-flex px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Diensten zoeken →
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {/* Actieve diensten — check in/out */}
          {active.length > 0 && (
            <Group label="Nu actief" color="#1E40AF">
              {active.map(app => (
                <ShiftRow key={app.id} app={app as any} showCheckinOut
                  employerUserId={(app.shift as any).employer?.user?.id}
                  hourlyRate={Number(app.shift.hourlyRate)}
                />
              ))}
            </Group>
          )}

          {/* Aankomende diensten */}
          {upcoming.length > 0 && (
            <Group label="Aankomend" color="var(--teal)">
              {upcoming.map(app => (
                <ShiftRow key={app.id} app={app as any} />
              ))}
            </Group>
          )}

          {/* Afgeronde diensten */}
          {completed.length > 0 && (
            <Group label="Afgerond" color="#065F46">
              {completed.map(app => (
                <div key={app.id}>
                  <ShiftRow app={app as any} showEarnings />
                  {app.status === "APPROVED" && (app.shift as any).employer?.user?.id && (
                    <div className="px-5 pb-4 -mt-1">
                      <ReviewButton
                        reviewedId={(app.shift as any).employer.user.id}
                        shiftTitle={app.shift.title}
                        existingRating={reviewMap.get((app.shift as any).employer.user.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </Group>
          )}

          {/* Afgewezen/ingetrokken */}
          {other.length > 0 && (
            <Group label="Overig" color="var(--muted)">
              {other.map(app => (
                <ShiftRow key={app.id} app={app as any} />
              ))}
            </Group>
          )}
        </div>
      </main>
    </div>
  );
}

function Group({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color }}>{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ShiftRow({ app, showCheckinOut, showEarnings, employerUserId, hourlyRate }: {
  app: any; showCheckinOut?: boolean; showEarnings?: boolean;
  employerUserId?: string; hourlyRate?: number;
}) {
  const shift = app.shift;
  const start = new Date(shift.startTime);
  const end   = new Date(shift.endTime);
  const statusColor = STATUS_COLOR[app.status] ?? "var(--muted)";
  const statusLabel = STATUS_LABEL[app.status] ?? app.status;

  return (
    <div className="rounded-2xl px-5 py-4 bg-white" style={{ border: "0.5px solid var(--border)" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: statusColor + "18", color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          <div className="text-base font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            {shift.title}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {shift.employer.companyName} · {shift.city}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {start.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}{" "}
            {start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}–
            {end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
            {" "}· €{Number(shift.hourlyRate).toFixed(2)}/uur
          </div>

          {/* Check-in/out timestamps */}
          {app.checkedInAt && (
            <div className="text-xs mt-1.5 font-medium" style={{ color: "var(--teal)" }}>
              Ingecheckt: {new Date(app.checkedInAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
              {app.checkedOutAt && (
                <> · Uitgecheckt: {new Date(app.checkedOutAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
          {showEarnings && app.hoursWorked && (
            <div className="text-right">
              <div className="text-base font-bold" style={{ color: "var(--teal)" }}>
                €{Number(app.payoutAmount).toFixed(2)}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{Number(app.hoursWorked).toFixed(1)} uur</div>
            </div>
          )}
          {showCheckinOut && (
            <CheckInOutButtons
              shiftId={shift.id}
              shiftTitle={shift.title}
              employerName={shift.employer.companyName}
              employerUserId={employerUserId}
              hourlyRate={hourlyRate ?? Number(shift.hourlyRate)}
              checkedInAt={app.checkedInAt ? new Date(app.checkedInAt).toISOString() : null}
              checkedIn={!!app.checkedInAt}
              checkedOut={!!app.checkedOutAt}
            />
          )}
        </div>
      </div>
    </div>
  );
}
