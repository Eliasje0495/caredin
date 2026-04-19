export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FlexpoolsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  // Workers who have worked at least 1 approved shift here
  const workedHere = await prisma.shiftApplication.findMany({
    where: { status: "APPROVED", shift: { employerId: employer.id } },
    include: {
      user: {
        select: {
          id: true, name: true, email: true,
          workerProfile: {
            select: { bigStatus: true, averageRating: true, totalShifts: true, city: true, hourlyRate: true, contractType: true },
          },
        },
      },
    },
    distinct: ["userId"],
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Flexpools
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Professionals die eerder bij jou hebben gewerkt. Stuur ze direct een uitnodiging voor je volgende dienst.
            </p>
          </div>
          <Link href="/professionals"
            className="px-5 py-2.5 rounded-[40px] text-sm font-semibold no-underline"
            style={{ background: "var(--teal-light)", color: "var(--teal)", border: "0.5px solid rgba(26,122,106,0.3)" }}>
            Professionals zoeken →
          </Link>
        </div>

        {workedHere.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">👥</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Nog geen flexpool
            </div>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
              Zodra professionals diensten bij jou hebben afgerond, verschijnen ze hier. Je kunt ze dan direct uitnodigen voor nieuwe shifts.
            </p>
            <Link href="/dashboard/organisatie/diensten/nieuw"
              className="inline-flex px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Eerste dienst plaatsen →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
              {workedHere.length} professional{workedHere.length !== 1 ? "s" : ""}
            </div>
            {workedHere.map(app => {
              const wp = app.user.workerProfile;
              return (
                <div key={app.user.id} className="rounded-2xl px-5 py-4 bg-white flex items-center justify-between"
                  style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white"
                      style={{ background: "var(--teal)" }}>
                      {app.user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{app.user.name}</div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {wp?.bigStatus === "VERIFIED" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#065F4618", color: "#065F46" }}>✓ BIG</span>
                        )}
                        {wp?.averageRating && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>{Number(wp.averageRating).toFixed(1)} ★</span>
                        )}
                        {wp?.totalShifts && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>{wp.totalShifts} diensten totaal</span>
                        )}
                        {wp?.city && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>📍 {wp.city}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {wp?.hourlyRate && (
                      <span className="text-sm font-bold" style={{ color: "var(--teal)" }}>€{Number(wp.hourlyRate).toFixed(0)}/u</span>
                    )}
                    <Link href={`/dashboard/organisatie/diensten/nieuw`}
                      className="px-4 py-1.5 rounded-[40px] text-xs font-semibold no-underline"
                      style={{ background: "var(--teal-light)", color: "var(--teal)", border: "0.5px solid rgba(26,122,106,0.3)" }}>
                      Uitnodigen →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
