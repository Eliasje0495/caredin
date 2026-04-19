export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function FlexpoolsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  // Instellingen where this worker has completed a shift
  const completedApps = await prisma.shiftApplication.findMany({
    where: { userId, status: "APPROVED" },
    include: { shift: { include: { employer: true } } },
    distinct: ["shiftId"],
  });

  const employerMap = new Map<string, any>();
  for (const app of completedApps) {
    const e = app.shift.employer;
    if (!employerMap.has(e.id)) employerMap.set(e.id, { ...e, shiftCount: 0 });
    employerMap.get(e.id).shiftCount++;
  }
  const employers = Array.from(employerMap.values());

  return (
    <div className="px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Jouw netwerk</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Flexpools
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Zorginstellingen waar je eerder hebt gewerkt. Zij kunnen je direct uitnodigen voor nieuwe diensten.
        </p>

        {employers.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">💼</div>
            <div className="text-base font-semibold mb-2" style={{ color: "var(--dark)" }}>Nog geen flexpools</div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Zodra je een dienst hebt afgerond, verschijnt de instelling hier in je flexpool.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {employers.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white"
                style={{ border: "0.5px solid var(--border)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: "var(--teal)" }}>
                    {e.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{e.companyName}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{e.shiftCount} dienst{e.shiftCount !== 1 ? "en" : ""} afgerond</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                  ✓ Geverifieerd
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
