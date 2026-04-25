export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ZzperBerichtenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const convos = await prisma.directConversation.findMany({
    where: { workerId: userId },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  const employerIds = convos.map(c => c.employerId);
  const employers   = await prisma.user.findMany({
    where: { id: { in: employerIds } },
    select: { id: true, name: true, employer: { select: { companyName: true } } },
  });
  const empMap = new Map(employers.map(e => [e.id, e]));

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Berichten
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Directe berichten met zorginstellingen.</p>

        {convos.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">💬</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Geen berichten</div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Instellingen kunnen je een bericht sturen wanneer je werkt of aangemeld bent voor een dienst.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {convos.map(c => {
              const emp = empMap.get(c.employerId);
              const last = c.messages[0];
              const unread = last && !last.read && last.senderId !== userId;
              return (
                <Link key={c.id} href={`/dashboard/zzper/berichten/${c.id}`}
                  className="no-underline flex items-center gap-4 rounded-2xl px-5 py-4 bg-white"
                  style={{ border: `0.5px solid ${unread ? "rgba(26,122,106,0.4)" : "var(--border)"}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal)" }}>
                    {(emp?.employer?.companyName ?? emp?.name ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>
                        {emp?.employer?.companyName ?? emp?.name ?? "Instelling"}
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
      </div>
    </div>
  );
}
