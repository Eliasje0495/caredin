import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page   = parseInt(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? undefined;

  const [shifts, total] = await Promise.all([
    prisma.shift.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        employer: { select: { companyName: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 25,
      take: 25,
    }),
    prisma.shift.count({ where: status ? { status: status as any } : undefined }),
  ]);

  return NextResponse.json({ shifts, total, page });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const { shiftId, action } = await req.json();
  if (action === "cancel") {
    await prisma.shift.update({ where: { id: shiftId }, data: { status: "CANCELLED", cancelledAt: new Date() } });
  }

  return NextResponse.json({ ok: true });
}
