export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open", FILLED: "Ingevuld", IN_PROGRESS: "Bezig",
  COMPLETED: "Afgerond", APPROVED: "Goedgekeurd", CANCELLED: "Geannuleerd",
};
const STATUS_COLOR: Record<string, string> = {
  OPEN: "#065F46", FILLED: "#1E40AF", IN_PROGRESS: "#92400E",
  COMPLETED: "#374151", APPROVED: "#065F46", CANCELLED: "#991B1B",
};
const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
  ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", ARTS: "Arts",
  FYSIOTHERAPEUT: "Fysiotherapeut", OVERIG: "Overig",
};

export default async function DienstenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const shifts = await prisma.shift.findMany({
    where: { employerId: employer.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  const grouped = {
    OPEN:      shifts.filter(s => s.status === "OPEN"),
    FILLED:    shifts.filter(s => ["FILLED", "IN_PROGRESS"].includes(s.status)),
    COMPLETED: shifts.filter(s => ["COMPLETED", "APPROVED"].includes(s.status)),
    CANCELLED: shifts.filter(s => s.status === "CANCELLED"),
  };

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Mijn diensten
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{shifts.length} dienst{shifts.length !== 1 ? "en" : ""} geplaatst</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/organisatie/diensten/import"
              className="px-4 py-2.5 rounded-[40px] text-sm font-semibold no-underline flex-shrink-0"
              style={{ background: "var(--teal-light)", color: "var(--teal)", border: "1px solid var(--teal)" }}>
              📂 Importeren
            </Link>
            <Link href="/dashboard/organisatie/diensten/nieuw"
              className="px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline flex-shrink-0"
              style={{ background: "var(--teal)" }}>
              + Dienst plaatsen
            </Link>
          </div>
        </div>

        {shifts.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">📋</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Nog geen diensten geplaatst
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Plaats je eerste dienst en vind snel geverifieerd zorgpersoneel.</p>
            <Link href="/dashboard/organisatie/diensten/nieuw"
              className="inline-flex px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Dienst plaatsen →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).filter(([, list]) => list.length > 0).map(([group, list]) => (
              <div key={group}>
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3"
                  style={{ color: STATUS_COLOR[group] ?? "var(--muted)" }}>
                  {STATUS_LABEL[group]} ({list.length})
                </div>
                <div className="space-y-2">
                  {list.map((shift) => (
                    <Link key={shift.id} href={`/dashboard/organisatie/diensten/${shift.id}`} className="no-underline block">
                      <div className="rounded-2xl px-6 py-4 bg-white flex items-center justify-between hover:shadow-md transition-shadow"
                        style={{ border: "0.5px solid var(--border)" }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: STATUS_COLOR[shift.status] + "18", color: STATUS_COLOR[shift.status] }}>
                              {STATUS_LABEL[shift.status]}
                            </span>
                            {shift.isUrgent && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#ef4444" }}>Urgent</span>
                            )}
                          </div>
                          <div className="text-base font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                            {FUNCTION_LABELS[shift.function] ?? shift.function} — {shift.title}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            {shift.city} · {new Date(shift.startTime).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}{" "}
                            {new Date(shift.startTime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}–
                            {new Date(shift.endTime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        <div className="flex items-center gap-5 flex-shrink-0 ml-4">
                          <div className="text-right">
                            <div className="text-sm font-bold" style={{ color: "var(--teal)" }}>€{Number(shift.hourlyRate).toFixed(2)}/u</div>
                            <div className="text-xs" style={{ color: "var(--muted)" }}>
                              {shift._count.applications} aanmelding{shift._count.applications !== 1 ? "en" : ""}
                            </div>
                          </div>
                          <span style={{ color: "var(--muted)" }}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

