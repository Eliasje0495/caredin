import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getEmployerId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = (session as { user?: { email?: string } } | null)?.user?.email;
  if (!email) return null;
  const employer = await prisma.employer.findFirst({ where: { user: { email } }, select: { id: true } });
  return employer?.id ?? null;
}

// GET — list blocked workers
export async function GET() {
  const employerId = await getEmployerId();
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await prisma.blockedWorker.findMany({
    where: { employerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ blocked });
}

// POST — block a worker
export async function POST(req: NextRequest) {
  const employerId = await getEmployerId();
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workerId, workerName, reason } = await req.json();
  if (!workerId || !workerName) {
    return NextResponse.json({ error: "workerId en workerName zijn verplicht" }, { status: 400 });
  }

  const blocked = await prisma.blockedWorker.upsert({
    where: { employerId_workerId: { employerId, workerId } },
    create: { employerId, workerId, workerName, reason: reason ?? null },
    update: { reason: reason ?? null },
  });

  return NextResponse.json({ blocked });
}

// DELETE — unblock a worker
export async function DELETE(req: NextRequest) {
  const employerId = await getEmployerId();
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workerId } = await req.json();
  if (!workerId) return NextResponse.json({ error: "workerId verplicht" }, { status: 400 });

  await prisma.blockedWorker.deleteMany({
    where: { employerId, workerId },
  });

  return NextResponse.json({ ok: true });
}
