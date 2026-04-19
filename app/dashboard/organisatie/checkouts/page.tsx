export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApproveButtons from "./ApproveButtons";
import ReviewWorkerButton from "./ReviewWorkerButton";

export default async function CheckoutsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const givenReviews = await prisma.review.findMany({ where: { reviewerId: userId }, select: { reviewedId: true, rating: true } });
  const reviewMap = new Map(givenReviews.map(r => [r.reviewedId, r.rating]));

  // All completed (awaiting approval) applications for this employer's shifts
  const pending = await prisma.shiftApplication.findMany({
    where: {
      status: "COMPLETED",
      shift: { employerId: employer.id },
    },
    include: {
      shift: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { checkedOutAt: "asc" },
  });

  // Already processed
  const approved = await prisma.shiftApplication.findMany({
    where: {
      status: "APPROVED",
      shift: { employerId: employer.id },
    },
    include: {
      shift: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { paidAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Checkouts goedkeuren
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Keur gewerkte uren goed binnen 7 dagen. Daarna worden ze automatisch goedgekeurd.
          </p>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "#7C3AED" }}>
              Wacht op goedkeuring ({pending.length})
            </div>
            <div className="space-y-3">
              {pending.map(app => (
                <CheckoutCard key={app.id} app={app as any} showActions />
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div className="rounded-2xl p-12 text-center bg-white mb-8" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-3xl mb-3">✅</div>
            <div className="text-base font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Alles up-to-date
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Er zijn geen openstaande checkouts.</p>
          </div>
        )}

        {/* Approved history */}
        {approved.length > 0 && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "#065F46" }}>
              Goedgekeurd ({approved.length})
            </div>
            <div className="space-y-2">
              {approved.map(app => (
                <div key={app.id}>
                  <CheckoutCard app={app as any} />
                  <div className="px-5 pb-3 -mt-1">
                    <ReviewWorkerButton
                      reviewedId={app.userId}
                      workerName={app.user.name ?? "Professional"}
                      existingRating={reviewMap.get(app.userId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CheckoutCard({ app, showActions }: { app: any; showActions?: boolean }) {
  const shift = app.shift;
  const checkoutDeadline = app.checkedOutAt
    ? new Date(new Date(app.checkedOutAt).getTime() + 7 * 24 * 3600000)
    : null;
  const daysLeft = checkoutDeadline
    ? Math.max(0, Math.ceil((checkoutDeadline.getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="rounded-2xl px-5 py-4 bg-white" style={{ border: `0.5px solid ${showActions ? "#7C3AED40" : "var(--border)"}` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "var(--teal)" }}>
              {app.user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{app.user.name}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{shift.title} · {shift.city}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-3 flex-wrap">
            <Stat label="Datum" value={new Date(shift.startTime).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })} />
            {app.checkedInAt && <Stat label="Inchecktijd" value={new Date(app.checkedInAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} />}
            {app.checkedOutAt && <Stat label="Uitchecktijd" value={new Date(app.checkedOutAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} />}
            {app.hoursWorked && <Stat label="Uren gewerkt" value={`${Number(app.hoursWorked).toFixed(2)} uur`} />}
            {app.payoutAmount && <Stat label="Uitbetaling" value={`€${Number(app.payoutAmount).toFixed(2)}`} highlight />}
          </div>

          {showActions && daysLeft !== null && (
            <div className="mt-2 text-xs font-medium" style={{ color: daysLeft <= 2 ? "#ef4444" : "var(--muted)" }}>
              ⏱ Automatisch goedgekeurd over {daysLeft} dag{daysLeft !== 1 ? "en" : ""}
            </div>
          )}
          {!showActions && app.paidAt && (
            <div className="mt-2 text-xs" style={{ color: "#065F46" }}>
              ✓ Goedgekeurd op {new Date(app.paidAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>

        {showActions && (
          <ApproveButtons appId={app.id} shiftId={shift.id} />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: "var(--teal-light)" }}>
      <div className="text-[10px] font-bold uppercase tracking-[0.6px]" style={{ color: "var(--teal)" }}>{label}</div>
      <div className="text-sm font-semibold" style={{ color: highlight ? "var(--teal)" : "var(--dark)" }}>{value}</div>
    </div>
  );
}
