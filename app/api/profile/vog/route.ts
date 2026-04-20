export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  await prisma.workerProfile.update({
    where: { userId },
    data: { vogUrl: dataUrl, vogStatus: "PENDING", vogRejectedAt: null, vogRejectedReason: null },
  });

  return NextResponse.json({ ok: true, status: "PENDING" });
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
