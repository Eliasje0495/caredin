export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

// GET /api/v1/timesheets — approved applications with hours for payroll
export async function GET(req: NextRequest) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const offset = Number(searchParams.get("offset") ?? 0);
  const since = searchParams.get("since") ? new Date(searchParams.get("since")!) : undefined;

  const timesheets = await prisma.shiftApplication.findMany({
    where: {
      shift: { employerId: employer.id },
      status: "APPROVED",
      hoursWorked: { not: null },
      ...(since ? { updatedAt: { gte: since } } : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      shift: { select: { id: true, title: true, startTime: true, endTime: true, hourlyRate: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    skip: offset,
  });

  return NextResponse.json({ data: timesheets, limit, offset });
}
