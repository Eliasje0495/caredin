export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

async function extractVogDate(base64: string, mimeType: string): Promise<Date | null> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    type ImageBlock = {
      type: "image";
      source: { type: "base64"; media_type: "image/jpeg" | "image/png" | "image/webp"; data: string };
    };
    type DocumentBlock = {
      type: "document";
      source: { type: "base64"; media_type: "application/pdf"; data: string };
    };
    type TextBlock = { type: "text"; text: string };

    const mediaBlock: ImageBlock | DocumentBlock =
      mimeType === "application/pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/webp",
              data: base64,
            },
          };

    const textBlock: TextBlock = {
      type: "text",
      text: 'Dit is een VOG (Verklaring Omtrent Gedrag). Zoek de "datum van afgifte" of een andere datum op het document. Geef ALLEEN de datum terug in het formaat DD-MM-YYYY. Als er geen datum staat, antwoord dan alleen met "NIET GEVONDEN".',
    };

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 30,
      messages: [{ role: "user", content: [mediaBlock, textBlock] }],
    });

    const text = (msg.content[0] as { type: string; text?: string }).text?.trim() ?? "";
    const match = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (!match) return null;

    const issueDate = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
    if (isNaN(issueDate.getTime())) return null;

    // VOG geldig voor 1 jaar vanaf afgifte
    const expiry = new Date(issueDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry;
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
    select: { vogUrl: true, vogStatus: true, vogVerifiedAt: true, vogExpiresAt: true, vogRejectedReason: true },
  });
  return NextResponse.json({ vog: profile });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Geen bestand geüpload" }, { status: 400 });

  // Max 5MB
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "Bestand mag maximaal 5MB zijn" }, { status: 400 });

  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type))
    return NextResponse.json({ error: "Alleen PDF, JPG of PNG toegestaan" }, { status: 400 });

  // Convert to base64 data URL for storage
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  // OCR: probeer vervaldatum uit te lezen
  const vogExpiresAt = await extractVogDate(base64, file.type);

  await prisma.workerProfile.update({
    where: { userId },
    data: {
      vogUrl: dataUrl,
      vogStatus: "PENDING",
      vogRejectedAt: null,
      vogRejectedReason: null,
      ...(vogExpiresAt ? { vogExpiresAt } : {}),
    },
  });

  return NextResponse.json({ ok: true, status: "PENDING", vogExpiresAt: vogExpiresAt?.toISOString() ?? null });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  await prisma.workerProfile.update({
    where: { userId },
    data: { vogUrl: null, vogStatus: "UNVERIFIED", vogVerifiedAt: null, vogExpiresAt: null },
  });
  return NextResponse.json({ ok: true });
}
