import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

export async function POST(req: NextRequest) {
  const { visitorName, visitorEmail, message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Bericht verplicht" }, { status: 400 });

  const conversation = await prisma.chatConversation.create({
    data: {
      visitorName:  visitorName || null,
      visitorEmail: visitorEmail || null,
      messages: { create: { sender: "visitor", content: message.trim() } },
    },
  });

  getResend().emails.send({
    from:    "CaredIn <noreply@caredin.nl>",
    to:      process.env.ADMIN_EMAILS?.split(",")[0] ?? "elias@standin.works",
    subject: `💬 Nieuw chatbericht van ${visitorName || visitorEmail || "anoniem"}`,
    html: `<div style="font-family:sans-serif;max-width:480px">
      <h2 style="color:#1A7A6A">Nieuw chatgesprek 💬</h2>
      <p><strong>Naam:</strong> ${visitorName || "—"}</p>
      <p><strong>E-mail:</strong> ${visitorEmail || "—"}</p>
      <p><strong>Bericht:</strong> ${message}</p>
      <a href="https://caredin.nl/admin/chat" style="display:inline-block;background:#1A7A6A;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;margin-top:12px">
        Reageren in admin →
      </a>
    </div>`,
  }).catch(() => {});

  return NextResponse.json({ ok: true, conversationId: conversation.id });
}
