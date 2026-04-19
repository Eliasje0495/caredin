import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

function requireAdmin(role: string) {
  if (role !== "ADMIN") throw new Error("Geen toegang.");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try { requireAdmin((session?.user as any)?.role); }
  catch { return NextResponse.json({ error: "Geen toegang." }, { status: 403 }); }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1");
  const role = searchParams.get("role") ?? undefined;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      include: {
        workerProfile: { select: { isVerified: true, bigStatus: true, totalShifts: true } },
        employer: { select: { companyName: true, isVerified: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 25,
      take: 25,
    }),
    prisma.user.count({ where: role ? { role: role as any } : undefined }),
  ]);

  return NextResponse.json({ users, total, page });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try { requireAdmin((session?.user as any)?.role); }
  catch { return NextResponse.json({ error: "Geen toegang." }, { status: 403 }); }

  const { userId, action } = await req.json();

  if (action === "verify-worker") {
    await prisma.workerProfile.updateMany({ where: { userId }, data: { isVerified: true } });
  } else if (action === "verify-employer") {
    await prisma.employer.updateMany({ where: { userId }, data: { isVerified: true, kvkStatus: "VERIFIED" } });
  } else if (action === "ban") {
    await prisma.user.update({ where: { id: userId }, data: { } });
  }

  return NextResponse.json({ ok: true });
}
