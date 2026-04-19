import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";

export const dynamic = "force-dynamic";

// Called daily by a cron job (e.g. Vercel Cron or external scheduler)
// Authorization via CRON_SECRET header
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find all COMPLETED applications older than 7 days
  const expired = await prisma.shiftApplication.findMany({
    where: {
      status: "COMPLETED",
      checkedOutAt: { lt: sevenDaysAgo },
    },
    include: {
      shift: true,
      user: { select: { email: true } },
    },
  });

  let approved = 0;
  for (const app of expired) {
    await prisma.shiftApplication.update({
      where: { id: app.id },
      data: { status: "APPROVED", paidAt: new Date() },
    });
    await prisma.shift.update({
      where: { id: app.shiftId },
      data: { status: "APPROVED" },
    });
    if (app.hoursWorked && app.payoutAmount) {
      await prisma.workerProfile.updateMany({
        where: { userId: app.userId },
        data: {
          totalShifts: { increment: 1 },
          totalHours:  { increment: Number(app.hoursWorked) },
          totalEarned: { increment: Number(app.payoutAmount) },
        },
      });
      if (app.user.email) {
        emails.checkoutApproved(app.user.email, app.shift.title, Number(app.payoutAmount).toFixed(2)).catch(() => {});
      }
    }
    approved++;
  }

  // Send reminders for checkouts expiring in 2 days
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const expiringSoon = await prisma.shiftApplication.findMany({
    where: {
      status: "COMPLETED",
      checkedOutAt: {
        gte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      shift: { include: { employer: { include: { user: { select: { email: true } } } } } },
    },
  });

  for (const app of expiringSoon) {
    const employerEmail = app.shift.employer.user.email;
    if (employerEmail) {
      emails.checkoutReminder(employerEmail, app.shift.title, 2).catch(() => {});
    }
  }

  return NextResponse.json({ approved, reminders: expiringSoon.length });
}
