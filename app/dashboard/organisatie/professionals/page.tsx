export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MessageButton from "./MessageButton";
import InviteWorkerButton from "@/app/dashboard/organisatie/diensten/[id]/InviteWorkerButton";

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: { function?: string; city?: string; verified?: string; shiftId?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  if ((session.user as any).role !== "EMPLOYER") redirect("/dashboard");

  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const fn = searchParams.function as any;
  const city = searchParams.city;
  const verifiedOnly = searchParams.verified === "1";
  const shiftId = searchParams.shiftId;

  const workers = await prisma.workerProfile.findMany({
    where: {
      isActive: true,
      ...(fn ? { primaryFunction: fn } : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(verifiedOnly ? { isVerified: true } : {}),
    },
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: [{ isVerified: "desc" }, { averageRating: "desc" }],
    take: 30,
  });

  const FUNCTIONS: Record<string, string> = {
    VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
    HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
    ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
    PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", ARTS: "Arts",
    FYSIOTHERAPEUT: "Fysiotherapeut", OVERIG: "Overig",
  };

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Professionals zoeken
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Vind geverifieerde zorgprofessionals en nodig ze uit voor een dienst.
          </p>
        </div>

        {/* Filters */}
        <form method="GET" className="flex gap-3 mb-6 flex-wrap">
          <select name="function" defaultValue={fn ?? ""}
            className="text-sm rounded-[40px] px-4 py-2 font-medium"
            style={{ border: "1px solid var(--border)", background: "#fff", color: "var(--dark)" }}>
            <option value="">Alle functies</option>
            {Object.entries(FUNCTIONS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input name="city" defaultValue={city ?? ""} placeholder="Stad..."
            className="text-sm rounded-[40px] px-4 py-2"
            style={{ border: "1px solid var(--border)", background: "#fff", color: "var(--dark)" }} />
          <label className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 rounded-[40px]"
            style={{ border: "1px solid var(--border)", background: "#fff", color: "var(--dark)" }}>
            <input type="checkbox" name="verified" value="1" defaultChecked={verifiedOnly} className="accent-teal-600" />
            Alleen geverifieerd
          </label>
          <button type="submit" className="px-5 py-2 rounded-[40px] text-sm font-semibold text-white"
            style={{ background: "var(--teal)" }}>
            Zoeken
          </button>
        </form>

        {/* Results */}
        {workers.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">👤</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Geen professionals gevonden
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Probeer andere filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {workers.map((w) => (
              <div key={w.id} className="rounded-2xl px-5 py-4 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal)" }}>
                    {(w.user.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>{w.user.name ?? "Onbekend"}</span>
                      {w.isVerified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>✓ Geverifieerd</span>
                      )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {w.primaryFunction ? FUNCTIONS[w.primaryFunction] ?? w.primaryFunction : "Functie onbekend"}
                      {w.city ? ` · ${w.city}` : ""}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {w.averageRating && (
                        <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                          ★ {Number(w.averageRating).toFixed(1)}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{w.totalShifts} diensten</span>
                      {w.hourlyRate && Number(w.hourlyRate) > 0 && (
                        <span className="text-xs font-semibold" style={{ color: "var(--dark)" }}>
                          €{Number(w.hourlyRate).toFixed(0)}/u
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {w.bigStatus === "VERIFIED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#DBEAFE", color: "#1E40AF" }}>BIG</span>
                      )}
                      {w.kvkStatus === "VERIFIED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>KvK</span>
                      )}
                      {w.vogStatus === "VERIFIED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#EDE9FE", color: "#5B21B6" }}>VOG</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 flex gap-2 flex-wrap" style={{ borderTop: "0.5px solid var(--border)" }}>
                  {shiftId ? (
                    <InviteWorkerButton shiftId={shiftId} workerId={w.userId} workerName={w.user.name ?? "Professional"} />
                  ) : (
                    <Link href={`/dashboard/organisatie/diensten/nieuw?professional=${w.userId}`}
                      className="text-xs font-semibold no-underline px-3 py-1.5 rounded-[40px]"
                      style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                      + Dienst plaatsen →
                    </Link>
                  )}
                  <MessageButton workerId={w.userId} employerUserId={employer.userId} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
