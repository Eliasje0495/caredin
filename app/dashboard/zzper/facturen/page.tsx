export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ZzperFacturenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;

  const approved = await prisma.shiftApplication.findMany({
    where: { userId, status: "APPROVED" },
    include: { shift: { include: { employer: true } } },
    orderBy: { paidAt: "desc" },
  });

  const totalEarned = approved.reduce((s, a) => s + Number(a.payoutAmount ?? 0), 0);
  const totalHours  = approved.reduce((s, a) => s + Number(a.hoursWorked ?? 0), 0);

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
            { href: "/dashboard/zzper/timesheets",   label: "Timesheets" },
            { href: "/dashboard/zzper/facturen",     label: "Facturen" },
            { href: "/dashboard/zzper/profiel",      label: "Profiel" },
          ].map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium no-underline"
              style={{ color: n.href === "/dashboard/zzper/facturen" ? "var(--teal)" : "var(--muted)" }}>
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
            Facturen & verdiensten
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Overzicht van alle goedgekeurde diensten en uitbetalingen.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Totaal verdiend", value: `€${totalEarned.toFixed(2)}` },
            { label: "Uren gewerkt",    value: `${totalHours.toFixed(1)} uur` },
            { label: "Diensten",        value: approved.length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[26px] font-bold leading-none mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
                {s.value}
              </div>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {approved.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-3xl mb-3">📄</div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>Nog geen facturen</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Facturen verschijnen nadat je uren zijn goedgekeurd.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            <div className="grid text-[11px] font-bold uppercase tracking-[1px] px-5 py-3"
              style={{ gridTemplateColumns: "1fr 1fr 80px 80px 80px", color: "var(--muted)", borderBottom: "0.5px solid var(--border)" }}>
              <span>Dienst</span><span>Instelling</span><span>Datum</span><span>Uren</span><span className="text-right">Bedrag</span>
            </div>
            {approved.map(app => (
              <div key={app.id} className="grid items-center px-5 py-3.5"
                style={{ gridTemplateColumns: "1fr 1fr 80px 80px 80px", borderBottom: "0.5px solid var(--border)" }}>
                <span className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{app.shift.title}</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{app.shift.employer.companyName}</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {app.paidAt ? new Date(app.paidAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "—"}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{Number(app.hoursWorked ?? 0).toFixed(1)}u</span>
                <span className="text-sm font-bold text-right" style={{ color: "var(--teal)" }}>
                  €{Number(app.payoutAmount ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
