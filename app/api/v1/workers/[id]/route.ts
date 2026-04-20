export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only expose workers who have applied to this employer's shifts
  const hasApplied = await prisma.shiftApplication.findFirst({
    where: { userId: params.id, shift: { employerId: employer.id } },
  });
  if (!hasApplied) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, email: true, phone: true,
      workerProfile: {
        select: {
          bio: true, primaryFunction: true, contractType: true,
          bigNumber: true, bigStatus: true,
          skjNumber: true, skjStatus: true,
          kvkNumber: true, kvkCompanyName: true, kvkStatus: true,
          hourlyRate: true, totalShifts: true, totalHours: true, averageRating: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ data: user });
}
