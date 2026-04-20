export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shift = await prisma.shift.findUnique({
    where: { id: params.id },
    include: { _count: { select: { applications: true } } },
  });
  if (!shift || shift.employerId !== employer.id)
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  return NextResponse.json({ data: shift });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift || shift.employerId !== employer.id)
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const allowed = ["title","description","hourlyRate","isUrgent","status","cancelReason"];
  const data: any = {};
  for (const key of allowed) { if (body[key] !== undefined) data[key] = body[key]; }

  const updated = await prisma.shift.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift || shift.employerId !== employer.id)
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  await prisma.shift.update({ where: { id: params.id }, data: { status: "CANCELLED", cancelledAt: new Date() } });
  return NextResponse.json({ ok: true });
}
