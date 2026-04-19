import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { emails } from "@/lib/email";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen werkgeveraccount." }, { status: 403 });

  const shift = await prisma.shift.findFirst({ where: { id: params.id, employerId: employer.id } });
  if (!shift) return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });

  const { action, appId } = await req.json(); // action: "approve" | "reject"

  const app = await prisma.shiftApplication.findFirst({
    where: { id: appId, shiftId: params.id, status: "COMPLETED" },
  });
  if (!app) return NextResponse.json({ error: "Checkout niet gevonden of al verwerkt." }, { status: 404 });

  if (action === "approve") {
    const [updatedApp] = await Promise.all([
      prisma.shiftApplication.update({
        where: { id: appId },
        data: { status: "APPROVED", paidAt: new Date() },
        include: { user: { select: { email: true } } },
      }),
      prisma.shift.update({ where: { id: params.id }, data: { status: "APPROVED" } }),
    ]);
    if (app.hoursWorked && app.payoutAmount) {
      await prisma.workerProfile.updateMany({
        where: { userId: app.userId },
        data: {
          totalShifts: { increment: 1 },
          totalHours:  { increment: Number(app.hoursWorked) },
          totalEarned: { increment: Number(app.payoutAmount) },
        },
      });
      if (updatedApp.user.email) {
        emails.checkoutApproved(updatedApp.user.email, shift.title, Number(app.payoutAmount).toFixed(2)).catch(() => {});
      }
    }

    // Stripe transfer to worker's Connect account
    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: app.userId } });
    if (workerProfile?.stripeAccountId && app.payoutAmount) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2026-03-25.dahlia" as any,
      });
      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(Number(app.payoutAmount) * 100), // cents
          currency: "eur",
          destination: workerProfile.stripeAccountId,
          description: `Uitbetaling: ${shift.title}`,
          metadata: { appId: app.id, shiftId: params.id },
        });
        await prisma.shiftApplication.update({
          where: { id: appId },
          data: { stripeTransferId: transfer.id },
        });
      } catch (e) {
        // Log but don't fail the approval
        console.error("Stripe transfer failed:", e);
      }
    }
  } else if (action === "reject") {
    // Reopen shift for new applications
    await prisma.shiftApplication.update({
      where: { id: appId },
      data: { status: "REJECTED" },
    });
    await prisma.shift.update({
      where: { id: params.id },
      data: { status: "OPEN", filledAt: null },
    });
  }

  return NextResponse.json({ ok: true });
}
