export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#F5A623" : "var(--border)", fontSize: "16px" }}>★</span>
      ))}
    </div>
  );
}

export default async function BeoordelingenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;

  const [received, given] = await Promise.all([
    prisma.review.findMany({
      where: { reviewedId: userId },
      include: { reviewer: { select: { name: true, employer: { select: { companyName: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: { reviewerId: userId },
      include: { reviewed: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const avg = received.length
    ? (received.reduce((s, r) => s + r.rating, 0) / received.length).toFixed(1)
    : null;

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
            { href: "/dashboard/zzper",                   label: "Dashboard" },
            { href: "/vacatures",                         label: "Diensten" },
            { href: "/dashboard/zzper/timesheets",        label: "Timesheets" },
            { href: "/dashboard/zzper/beoordelingen",     label: "Beoordelingen" },
            { href: "/dashboard/zzper/profiel",           label: "Profiel" },
          ].map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium no-underline"
              style={{ color: n.href === "/dashboard/zzper/beoordelingen" ? "var(--teal)" : "var(--muted)" }}>
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
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Beoordelingen
          </h1>
          {avg && (
            <div className="flex items-center gap-2 mt-2">
              <Stars rating={Math.round(parseFloat(avg))} />
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>{avg}</span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>({received.length} beoordelingen)</span>
            </div>
          )}
        </div>

        {/* Ontvangen */}
        <div className="mb-8">
          <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "var(--teal)" }}>
            Ontvangen ({received.length})
          </div>
          {received.length === 0 ? (
            <div className="rounded-2xl p-10 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-3xl mb-3">⭐</div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Je hebt nog geen beoordelingen ontvangen.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {received.map(r => (
                <div key={r.id} className="rounded-2xl px-5 py-4 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>
                        {r.reviewer.employer?.companyName ?? r.reviewer.name}
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                        {new Date(r.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gegeven */}
        {given.length > 0 && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3" style={{ color: "var(--muted)" }}>
              Gegeven ({given.length})
            </div>
            <div className="space-y-3">
              {given.map(r => (
                <div key={r.id} className="rounded-2xl px-5 py-4 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{r.reviewed.name}</div>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
