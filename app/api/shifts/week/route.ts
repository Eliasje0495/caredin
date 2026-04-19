import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen werkgever." }, { status: 403 });

  const from = req.nextUrl.searchParams.get("from");
  if (!from) return NextResponse.json({ error: "from parameter vereist." }, { status: 400 });

  const weekStart = new Date(from);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const shifts = await prisma.shift.findMany({
    where: {
      employerId: employer.id,
      startTime: { gte: weekStart, lt: weekEnd },
    },
    include: {
      _count: { select: { applications: true } },
      applications: {
        where: { status: "ACCEPTED" },
        select: { id: true, user: { select: { name: true } } },
        take: 1,
      },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(shifts);
}
