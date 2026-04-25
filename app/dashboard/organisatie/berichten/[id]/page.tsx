export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MessageThread from "@/app/dashboard/zzper/berichten/[id]/MessageThread";

export default async function OrgBerichtPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const convo = await prisma.directConversation.findUnique({ where: { id: params.id } });
  if (!convo || convo.employerId !== userId) redirect("/dashboard/organisatie/berichten");

  const [messages, worker] = await Promise.all([
    prisma.directMessage.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: convo.workerId },
      select: { name: true, email: true },
    }),
  ]);

  await prisma.directMessage.updateMany({
    where: { conversationId: params.id, senderId: { not: userId }, read: false },
    data: { read: true },
  });

  const counterpartName = worker?.name ?? worker?.email ?? "Professional";

  return (
    <div>
      <main className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/organisatie/berichten" className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
            ← Berichten
          </Link>
          <span style={{ color: "var(--border)" }}>·</span>
          <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            {counterpartName}
          </h1>
        </div>
        <MessageThread
          conversationId={params.id}
          currentUserId={userId}
          initialMessages={JSON.parse(JSON.stringify(messages))}
        />
      </main>
    </div>
  );
}
