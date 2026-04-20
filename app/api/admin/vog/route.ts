export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase()) ? session : null;
}

// GET — list all PENDING VOG submissions
export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const profiles = await prisma.workerProfile.findMany({
    where: { vogStatus: "PENDING" },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: "asc" },
  });

  return NextResponse.json({ pending: profiles.map(p => ({
    userId: p.userId,
    name: p.user.name,
    email: p.user.email,
    vogUrl: p.vogUrl,
    updatedAt: p.updatedAt,
  })) });
}

// POST — approve or reject
export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { userId, action, reason } = await req.json();
  // action: "approve" | "reject"

  if (action === "approve") {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 3); // VOG geldig 3 jaar
    await prisma.workerProfile.update({
      where: { userId },
      data: { vogStatus: "VERIFIED", vogVerifiedAt: now, vogExpiresAt: expiresAt, vogRejectedAt: null, vogRejectedReason: null },
    });
  } else if (action === "reject") {
    await prisma.workerProfile.update({
      where: { userId },
      data: { vogStatus: "REJECTED", vogRejectedAt: new Date(), vogRejectedReason: reason ?? "Niet goedgekeurd" },
    });
  } else {
    return NextResponse.json({ error: "Ongeldige actie" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
