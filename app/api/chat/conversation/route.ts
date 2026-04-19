// GET  ?id=xxx&after=ISO   — poll voor nieuwe berichten
// POST                     — bezoeker stuurt nieuw bericht
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id    = req.nextUrl.searchParams.get("id");
  const after = req.nextUrl.searchParams.get("after");
  if (!id) return NextResponse.json({ error: "id verplicht" }, { status: 400 });

  const messages = await prisma.chatMessage.findMany({
    where: {
      conversationId: id,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const { id, content } = await req.json();
  if (!id || !content?.trim()) return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 });

  const conv = await prisma.chatConversation.findUnique({ where: { id } });
  if (!conv) return NextResponse.json({ error: "Gesprek niet gevonden" }, { status: 404 });

  const msg = await prisma.chatMessage.create({
    data: { conversationId: id, sender: "visitor", content: content.trim() },
  });

  await prisma.chatConversation.update({ where: { id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ ok: true, message: msg });
}
