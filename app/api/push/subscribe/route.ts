export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ publicKey: process.env.VAPID_PUBLIC_KEY ?? "" });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys?.p256dh || !keys?.auth)
    return NextResponse.json({ error: "Ongeldige subscription" }, { status: 400 });
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    update: { userId, p256dh: keys.p256dh, auth: keys.auth },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const { endpoint } = await req.json();
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
