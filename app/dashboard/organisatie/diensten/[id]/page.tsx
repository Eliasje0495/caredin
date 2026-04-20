export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApplicationActions from "./ApplicationActions";

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
  ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", ARTS: "Arts",
  FYSIOTHERAPEUT: "Fysiotherapeut", OVERIG: "Overig",
};
const APP_STATUS_LABEL: Record<string, string> = {
  PENDING: "In behandeling", ACCEPTED: "Geaccepteerd",
  REJECTED: "Afgewezen", WITHDRAWN: "Ingetrokken",
};
const APP_STATUS_COLOR: Record<string, string> = {
  PENDING: "#92400E", ACCEPTED: "#065F46",
  REJECTED: "#991B1B", WITHDRAWN: "#6B7280",
};

export default async function ShiftDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const shift = await prisma.shift.findFirst({
    where: { id: params.id, employerId: employer.id },
    include: {
      applications: {
        include: {
          user: {
            select: {
              name: true, email: true, image: true,
              workerProfile: {
                select: {
                  bigStatus: true, kvkStatus: true, vogStatus: true, isVerified: true,
                  averageRating: true, totalShifts: true, hourlyRate: true,
                  contractType: true, city: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: "asc" },
      },
    },
  });

  if (!shift) notFound();

  const start = new Date(shift.startTime);
  const end   = new Date(shift.endTime);
  const dateStr   = start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const startTime = start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const endTime   = end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const hours = ((end.getTime() - start.getTime()) / 3600000 - shift.breakMinutes / 60).toFixed(1);

  const pending  = shift.applications.filter(a => a.status === "PENDING");
  const accepted = shift.applications.filter(a => a.status === "ACCEPTED");
  const others   = shift.applications.filter(a => !["PENDING","ACCEPTED"].includes(a.status));

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-6">
          <Link href="/dashboard/organisatie/diensten" className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
            ← Terug naar diensten
          </Link>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-5">

            {/* Shift info */}
            <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-[22px] font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                    {FUNCTION_LABELS[shift.function] ?? shift.function} — {shift.title}
                  </h1>
                  <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{shift.city}</div>
                </div>
                <div className="flex gap-2">
                  {shift.isUrgent && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: "#ef4444" }}>Urgent</span>
                  )}
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ background: shift.status === "OPEN" ? "#065F4618" : "#1E40AF18", color: shift.status === "OPEN" ? "#065F46" : "#1E40AF" }}>
                    {shift.status === "OPEN" ? "Open" : shift.status === "FILLED" ? "Ingevuld" : shift.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Datum",     value: dateStr },
                  { label: "Tijd",      value: `${startTime} – ${endTime} (${hours} uur netto)` },
                  { label: "Locatie",   value: `${shift.address}, ${shift.postalCode} ${shift.city}` },
                  { label: "Uurtarief", value: `€${Number(shift.hourlyRate).toFixed(2)} / uur` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl px-4 py-3" style={{ background: "var(--teal-light)" }}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>{label}</div>
                    <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{value}</div>
                  </div>
                ))}
              </div>
              {shift.description && (
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{shift.description}</p>
              )}
            </div>

            {/* Accepted */}
            {accepted.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "#065F46" }}>
                  Geaccepteerd ({accepted.length})
                </div>
                <div className="space-y-2">
                  {accepted.map(app => (
                    <ApplicantCard key={app.id} app={app as any} shiftId={shift.id} shiftStatus={shift.status} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "var(--muted)" }}>
                  Aanmeldingen ({pending.length})
                </div>
                <div className="space-y-2">
                  {pending.map(app => (
                    <ApplicantCard key={app.id} app={app as any} shiftId={shift.id} shiftStatus={shift.status} />
                  ))}
                </div>
              </div>
            )}

            {/* Others */}
            {others.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "var(--muted)" }}>
                  Overige ({others.length})
                </div>
                <div className="space-y-2">
                  {others.map(app => (
                    <ApplicantCard key={app.id} app={app as any} shiftId={shift.id} shiftStatus={shift.status} />
                  ))}
                </div>
              </div>
            )}

            {shift.applications.length === 0 && (
              <div className="rounded-2xl p-12 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <div className="text-3xl mb-3">👥</div>
                <div className="text-base font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                  Nog geen aanmeldingen
                </div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Professionals kunnen zich direct aanmelden via de vacaturepagina.</p>
              </div>
            )}
          </div>

          {/* Sidebar stats */}
          <aside className="w-56 flex-shrink-0">
            <div className="rounded-2xl p-5 bg-white sticky top-[84px]" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>Overzicht</div>
              {[
                { label: "Aanmeldingen", value: shift.applications.length },
                { label: "In behandeling", value: pending.length },
                { label: "Geaccepteerd", value: accepted.length },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--teal)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ApplicantCard({ app, shiftId, shiftStatus }: { app: any; shiftId: string; shiftStatus: string }) {
  const wp = app.user.workerProfile;
  const statusColor = APP_STATUS_COLOR[app.status] ?? "var(--muted)";
  const statusLabel = APP_STATUS_LABEL[app.status] ?? app.status;

  return (
    <div className="rounded-2xl px-5 py-4 bg-white" style={{ border: "0.5px solid var(--border)" }}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
            style={{ background: "var(--teal)" }}>
            {app.user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{app.user.name}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{app.user.email}</div>
            {wp && (
              <div className="flex items-center gap-3 mt-1.5">
                {wp.bigStatus === "VERIFIED" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#065F4618", color: "#065F46" }}>✓ BIG</span>
                )}
                {wp.kvkStatus === "VERIFIED" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#065F4618", color: "#065F46" }}>✓ KvK</span>
                )}
                {wp.vogStatus === "VERIFIED" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#065F4618", color: "#065F46" }}>✓ VOG</span>
                )}
                {wp.averageRating && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{Number(wp.averageRating).toFixed(1)} ★</span>
                )}
                {wp.totalShifts > 0 && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{wp.totalShifts} diensten</span>
                )}
                {wp.city && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>📍 {wp.city}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: statusColor + "18", color: statusColor }}>
            {statusLabel}
          </span>
          {app.status === "PENDING" && shiftStatus === "OPEN" && (
            <ApplicationActions appId={app.id} shiftId={shiftId} />
          )}
        </div>
      </div>
    </div>
  );
}
