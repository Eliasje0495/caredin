export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — messages for a conversation
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const convo = await prisma.directConversation.findUnique({ where: { id: params.id } });
  if (!convo || (convo.workerId !== userId && convo.employerId !== userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await prisma.directMessage.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: "asc" },
  });

  // Mark incoming messages as read
  await prisma.directMessage.updateMany({
    where: { conversationId: params.id, senderId: { not: userId }, read: false },
    data: { read: true },
  });

  return NextResponse.json(messages);
}

// POST — send a message
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const role   = (session.user as any).role;

  const convo = await prisma.directConversation.findUnique({ where: { id: params.id } });
  if (!convo || (convo.workerId !== userId && convo.employerId !== userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty" }, { status: 400 });

  const message = await prisma.directMessage.create({
    data: {
      conversationId: params.id,
      senderId:       userId,
      senderRole:     role,
      content:        content.trim(),
    },
  });

  await prisma.directConversation.update({
    where: { id: params.id },
    data:  { updatedAt: new Date() },
  });

  // Create in-app notification for the recipient
  const recipientId = convo.workerId === userId ? convo.employerId : convo.workerId;
  const senderName  = session.user?.name ?? "Iemand";
  await prisma.notification.create({
    data: {
      userId:   recipientId,
      type:     "NEW_MESSAGE",
      title:    `Nieuw bericht van ${senderName}`,
      body:     content.trim().slice(0, 80),
      href:     role === "WORKER"
        ? `/dashboard/organisatie/berichten/${params.id}`
        : `/dashboard/zzper/berichten/${params.id}`,
    },
  });

  return NextResponse.json(message);
}
