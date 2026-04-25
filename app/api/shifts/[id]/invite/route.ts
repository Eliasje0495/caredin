export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Not employer" }, { status: 403 });

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift || shift.employerId !== employer.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { workerId } = await req.json();

  // Create notification for worker
  const workerUser = await prisma.user.findUnique({ where: { id: workerId }, select: { id: true, name: true } });
  if (!workerUser) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

  await prisma.notification.create({
    data: {
      userId: workerId,
      type:   "SHIFT_INVITATION",
      title:  `Uitnodiging voor "${shift.title}"`,
      body:   `${employer.companyName} nodigt je uit voor een dienst op ${new Date(shift.startTime).toLocaleDateString("nl-NL")} in ${shift.city}.`,
      href:   `/diensten/${shift.id}`,
    },
  });

  return NextResponse.json({ ok: true });
}
