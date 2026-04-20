// GET  — alle gesprekken ophalen
// POST — admin stuurt antwoord
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());

function esc(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase());
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const conversations = await prisma.chatConversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { conversationId, content } = await req.json();
  if (!conversationId || !content?.trim()) return NextResponse.json({ error: "Verplichte velden" }, { status: 400 });

  const conversation = await prisma.chatConversation.findUnique({ where: { id: conversationId } });

  const msg = await prisma.chatMessage.create({
    data: { conversationId, sender: "admin", content: content.trim() },
  });

  await prisma.chatConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

  if (conversation?.visitorEmail) {
    const visitorName = esc(conversation.visitorName ?? "daar");
    const safeContent = esc(content.trim());
    getResend().emails.send({
      from:    "CaredIn <noreply@caredin.nl>",
      to:      conversation.visitorEmail,
      subject: "Je hebt een reactie ontvangen van CaredIn",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
          <h2 style="font-size:20px;color:#0F1C1A;margin-bottom:8px">Hoi ${visitorName}!</h2>
          <p style="color:#6B7280;font-size:14px;margin-bottom:16px">Je hebt een reactie ontvangen op je chatgesprek met CaredIn:</p>
          <div style="background:#E8F7F4;border-left:4px solid #1A7A6A;border-radius:8px;padding:16px;margin-bottom:20px;font-size:15px;color:#111">
            ${safeContent}
          </div>
          <a href="https://caredin.nl" style="display:inline-block;background:#1A7A6A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px">
            Open chat →
          </a>
          <p style="color:#9CA3AF;font-size:12px;margin-top:24px">CaredIn.nl</p>
        </div>
      `,
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true, message: msg });
}
