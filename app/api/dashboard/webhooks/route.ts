export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen employer account" }, { status: 403 });

  const webhooks = await prisma.webhookEndpoint.findMany({
    where: { employerId: employer.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deliveries: true } } },
  });
  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen employer account" }, { status: 403 });

  const { url, events, description } = await req.json();
  if (!url || !events?.length) return NextResponse.json({ error: "url en events zijn verplicht" }, { status: 400 });

  const VALID_EVENTS = ["shift.applied","shift.filled","shift.cancelled","worker.checkin","worker.checkout","hours.approved"];
  for (const e of events) {
    if (!VALID_EVENTS.includes(e)) return NextResponse.json({ error: `Ongeldig event: ${e}` }, { status: 422 });
  }

  const secret = `whsec_${randomBytes(24).toString("hex")}`;
  const webhook = await prisma.webhookEndpoint.create({
    data: { employerId: employer.id, url, events, secret, description: description ?? null },
  });

  return NextResponse.json({ webhook: { ...webhook }, secret }, { status: 201 });
}
