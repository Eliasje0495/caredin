export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — list conversations for current user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const role   = (session.user as any).role;

  const where = role === "WORKER"
    ? { workerId: userId }
    : { employerId: userId };

  const convos = await prisma.directConversation.findMany({
    where,
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch counterpart names
  const ids = convos.map(c => role === "WORKER" ? c.employerId : c.workerId);
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, email: true },
  });
  const userMap = new Map(users.map(u => [u.id, u]));

  return NextResponse.json(convos.map(c => ({
    ...c,
    counterpart: userMap.get(role === "WORKER" ? c.employerId : c.workerId),
    lastMessage: c.messages[0] ?? null,
    unread: c.messages[0] && !c.messages[0].read && c.messages[0].senderId !== userId ? 1 : 0,
  })));
}

// POST — start or get conversation
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const role   = (session.user as any).role;
  const { otherUserId } = await req.json();

  const workerId   = role === "WORKER" ? userId : otherUserId;
  const employerId = role === "EMPLOYER" ? userId : otherUserId;

  const convo = await prisma.directConversation.upsert({
    where:  { workerId_employerId: { workerId, employerId } },
    create: { workerId, employerId },
    update: {},
  });

  return NextResponse.json(convo);
}
