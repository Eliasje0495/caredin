export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });
  const loc = await prisma.location.findUnique({ where: { id: params.id } });
  if (!loc || loc.employerId !== employer.id) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  const body = await req.json();
  const updated = await prisma.location.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ location: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });
  const loc = await prisma.location.findUnique({ where: { id: params.id } });
  if (!loc || loc.employerId !== employer.id) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  await prisma.location.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
