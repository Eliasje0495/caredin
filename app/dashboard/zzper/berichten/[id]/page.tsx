export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MessageThread from "./MessageThread";

export default async function ZzperBerichtPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const convo = await prisma.directConversation.findUnique({ where: { id: params.id } });
  if (!convo || convo.workerId !== userId) redirect("/dashboard/zzper/berichten");

  const [messages, employer] = await Promise.all([
    prisma.directMessage.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: convo.employerId },
      select: { name: true, employer: { select: { companyName: true } } },
    }),
  ]);

  // Mark incoming messages read
  await prisma.directMessage.updateMany({
    where: { conversationId: params.id, senderId: { not: userId }, read: false },
    data: { read: true },
  });

  const counterpartName = employer?.employer?.companyName ?? employer?.name ?? "Instelling";

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/zzper/berichten" className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
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
      </div>
    </div>
  );
}
