import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const app = await prisma.shiftApplication.findFirst({
    where: { shiftId: params.id, userId, status: "ACCEPTED" },
    include: {
      shift: {
        include: { employer: { include: { user: { select: { id: true } } } } },
      },
    },
  });
  if (!app) return NextResponse.json({ error: "Geen geaccepteerde aanmelding gevonden." }, { status: 404 });
  if (!app.checkedInAt) return NextResponse.json({ error: "Nog niet ingecheckt." }, { status: 400 });
  if (app.checkedOutAt) return NextResponse.json({ error: "Al uitgecheckt." }, { status: 409 });

  const now = new Date();
  const hoursWorked = (now.getTime() - app.checkedInAt.getTime()) / 3600000;
  const payoutAmount = hoursWorked * Number(app.shift.hourlyRate);
  const platformFee  = hoursWorked * Number(app.shift.platformFeePerHour);

  await prisma.shiftApplication.update({
    where: { id: app.id },
    data: {
      checkedOutAt: now,
      hoursWorked:  Math.round(hoursWorked * 100) / 100,
      payoutAmount: Math.round(payoutAmount * 100) / 100,
      platformFee:  Math.round(platformFee  * 100) / 100,
      status: "COMPLETED",
    },
  });
  await prisma.shift.update({
    where: { id: params.id },
    data: { status: "COMPLETED" },
  });

  // Notify employer about checkout
  const employerUserId = (app.shift as any).employer?.user?.id as string | undefined;
  if (employerUserId) {
    const workerName = session?.user?.name ?? "Een professional";
    await prisma.notification.create({
      data: {
        userId: employerUserId,
        type:   "CHECKOUT_PENDING",
        title:  "Checkout ter goedkeuring",
        body:   `${workerName} heeft uitgecheckt bij "${app.shift.title}". Beoordeel de uren.`,
        href:   `/dashboard/organisatie/checkouts`,
      },
    });
  }

  return NextResponse.json({ ok: true, hoursWorked: Math.round(hoursWorked * 100) / 100 });
}
