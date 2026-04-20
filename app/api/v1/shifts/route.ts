export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

// GET /api/v1/shifts — list employer's shifts
export async function GET(req: NextRequest) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const offset = Number(searchParams.get("offset") ?? 0);

  const shifts = await prisma.shift.findMany({
    where: { employerId: employer.id, ...(status ? { status: status as any } : {}) },
    orderBy: { startTime: "desc" },
    take: limit,
    skip: offset,
    include: { _count: { select: { applications: true } } },
  });

  return NextResponse.json({ data: shifts, limit, offset });
}

// POST /api/v1/shifts — create a shift
export async function POST(req: NextRequest) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const required = ["title", "sector", "function", "address", "city", "postalCode", "startTime", "endTime", "hourlyRate"];
  for (const f of required) {
    if (!body[f]) return NextResponse.json({ error: `Verplicht veld ontbreekt: ${f}` }, { status: 422 });
  }

  const shift = await prisma.shift.create({
    data: {
      employerId:   employer.id,
      title:        body.title,
      description:  body.description ?? null,
      sector:       body.sector,
      function:     body.function,
      address:      body.address,
      city:         body.city,
      postalCode:   body.postalCode,
      startTime:    new Date(body.startTime),
      endTime:      new Date(body.endTime),
      breakMinutes: body.breakMinutes ?? 30,
      hourlyRate:   body.hourlyRate,
      requiresBig:  body.requiresBig ?? false,
      requiresSkj:  body.requiresSkj ?? false,
      requiresKvk:  body.requiresKvk ?? true,
      isUrgent:     body.isUrgent ?? false,
      minExperience: body.minExperience ?? 0,
    },
  });

  return NextResponse.json({ data: shift }, { status: 201 });
}
