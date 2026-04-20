export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

// GET /api/v1/workers — list workers who have applied to this employer's shifts
export async function GET(req: NextRequest) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const offset = Number(searchParams.get("offset") ?? 0);
  const status = searchParams.get("status") ?? undefined;

  const applications = await prisma.shiftApplication.findMany({
    where: {
      shift: { employerId: employer.id },
      ...(status ? { status: status as any } : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      shift: { select: { id: true, title: true, startTime: true } },
    },
    orderBy: { appliedAt: "desc" },
    take: limit,
    skip: offset,
    distinct: ["userId"],
  });

  const workers = applications.map((a) => ({
    id: a.user.id,
    name: a.user.name,
    email: a.user.email,
    phone: a.user.phone,
    lastShift: { id: a.shift.id, title: a.shift.title, startTime: a.shift.startTime },
  }));

  return NextResponse.json({ data: workers, limit, offset });
}
