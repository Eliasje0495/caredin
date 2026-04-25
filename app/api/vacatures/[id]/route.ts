export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getEmployerVacature(userId: string, id: string) {
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return null;
  const vacature = await prisma.vacancy.findFirst({ where: { id, employerId: employer.id } });
  return vacature;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const vacature = await getEmployerVacature(userId, params.id);
  if (!vacature) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  return NextResponse.json({ vacature });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const existing = await getEmployerVacature(userId, params.id);
  if (!existing) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const allowed = ["title","description","sector","function","city","address",
    "contractType","hoursPerWeek","salaryMin","salaryMax",
    "requiresBig","requiresSkj","minExperience","expiresAt","status"];

  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  if (body.status === "FILLED") data.filledAt = new Date();

  const updated = await prisma.vacancy.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, vacature: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const existing = await getEmployerVacature(userId, params.id);
  if (!existing) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  await prisma.vacancy.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ ok: true });
}
