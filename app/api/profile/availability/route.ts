export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Availability shape:
// { mon: {available: bool, from: "08:00", to: "22:00"}, tue: {...}, ... }
// Days: mon tue wed thu fri sat sun

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const profile = await prisma.workerProfile.findUnique({ where: { userId }, select: { availability: true } });
  return NextResponse.json({ availability: profile?.availability ?? null });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const body = await req.json();
  await prisma.workerProfile.update({ where: { userId }, data: { availability: body } });
  return NextResponse.json({ ok: true });
}
