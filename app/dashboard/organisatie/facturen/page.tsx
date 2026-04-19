export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrgFacturenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const approved = await prisma.shiftApplication.findMany({
    where: { status: "APPROVED", shift: { employerId: employer.id } },
    include: { shift: true, user: { select: { name: true } } },
    orderBy: { paidAt: "desc" },
  });

  const totalCost  = approved.reduce((s, a) => s + Number(a.payoutAmount ?? 0) + Number(a.platformFee ?? 0), 0);
  const totalHours = approved.reduce((s, a) => s + Number(a.hoursWorked ?? 0), 0);

  return (
    <div>
      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Facturen
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Overzicht van alle uitbetaalde diensten.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Totale kosten",  value: `€${totalCost.toFixed(2)}` },
            { label: "Uren ingezet",   value: `${totalHours.toFixed(1)} uur` },
            { label: "Afgeronde diensten", value: approved.length },
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
            <p className="text-xs" style={{ color: "var(--muted)" }}>Facturen verschijnen nadat checkouts zijn goedgekeurd.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            <div className="grid text-[11px] font-bold uppercase tracking-[1px] px-5 py-3"
              style={{ gridTemplateColumns: "1fr 1fr 80px 60px 90px 90px", color: "var(--muted)", borderBottom: "0.5px solid var(--border)" }}>
              <span>Dienst</span><span>Professional</span><span>Datum</span><span>Uren</span><span>Tarief</span><span className="text-right">Totaal</span>
            </div>
            {approved.map(app => {
              const total = Number(app.payoutAmount ?? 0) + Number(app.platformFee ?? 0);
              return (
                <div key={app.id} className="grid items-center px-5 py-3.5"
                  style={{ gridTemplateColumns: "1fr 1fr 80px 60px 90px 90px", borderBottom: "0.5px solid var(--border)" }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{app.shift.title}</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{app.user.name}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {app.paidAt ? new Date(app.paidAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "—"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{Number(app.hoursWorked ?? 0).toFixed(1)}u</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>€{Number(app.shift.hourlyRate).toFixed(2)}/u</span>
                  <span className="text-sm font-bold text-right" style={{ color: "var(--teal)" }}>€{total.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--teal-light)" }}>
              <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>Totaal (incl. platformkosten)</span>
              <span className="text-base font-bold" style={{ color: "var(--teal)" }}>€{totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
