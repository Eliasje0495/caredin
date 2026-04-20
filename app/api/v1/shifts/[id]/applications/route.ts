export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift || shift.employerId !== employer.id)
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const applications = await prisma.shiftApplication.findMany({
    where: { shiftId: params.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json({ data: applications });
}
