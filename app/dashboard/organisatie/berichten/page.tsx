export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrgBerichtenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const convos = await prisma.directConversation.findMany({
    where: { employerId: userId },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  const workerIds = convos.map(c => c.workerId);
  const workers   = await prisma.user.findMany({
    where: { id: { in: workerIds } },
    select: { id: true, name: true, email: true },
  });
  const workerMap = new Map(workers.map(w => [w.id, w]));

  return (
    <div>
      <main className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Berichten
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Directe berichten met professionals.</p>

        {convos.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">💬</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Geen berichten</div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Start een gesprek via de professionalslijst.</p>
            <Link href="/dashboard/organisatie/professionals"
              className="inline-flex mt-4 px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Professionals zoeken →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {convos.map(c => {
              const w    = workerMap.get(c.workerId);
              const last = c.messages[0];
              const unread = last && !last.read && last.senderId !== userId;
              return (
                <Link key={c.id} href={`/dashboard/organisatie/berichten/${c.id}`}
                  className="no-underline flex items-center gap-4 rounded-2xl px-5 py-4 bg-white"
                  style={{ border: `0.5px solid ${unread ? "rgba(26,122,106,0.4)" : "var(--border)"}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal)" }}>
                    {(w?.name ?? w?.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>
                        {w?.name ?? w?.email ?? "Professional"}
                      </span>
                      {last && (
                        <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                          {new Date(last.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                    {last && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: unread ? "var(--dark)" : "var(--muted)", fontWeight: unread ? 600 : 400 }}>
                        {last.senderId === userId ? "Jij: " : ""}{last.content}
                      </p>
                    )}
                  </div>
                  {unread && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "var(--teal)" }} />}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
