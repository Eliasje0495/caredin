export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Not employer" }, { status: 403 });
  const templates = await prisma.shiftTemplate.findMany({
    where: { employerId: employer.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Not employer" }, { status: 403 });
  const body = await req.json();
  const template = await prisma.shiftTemplate.create({
    data: {
      employerId:  employer.id,
      name:        body.name || body.title,
      title:       body.title,
      description: body.description ?? null,
      sector:      body.sector,
      function:    body.function,
      address:     body.address,
      city:        body.city,
      postalCode:  body.postalCode,
      breakMinutes: body.breakMinutes ?? 30,
      hourlyRate:  body.hourlyRate,
      requiresBig: body.requiresBig ?? false,
      requiresSkj: body.requiresSkj ?? false,
      requiresKvk: body.requiresKvk ?? true,
    },
  });
  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Not employer" }, { status: 403 });
  const { id } = await req.json();
  await prisma.shiftTemplate.deleteMany({ where: { id, employerId: employer.id } });
  return NextResponse.json({ ok: true });
}
