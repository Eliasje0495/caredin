import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      // Mark worker as fully onboarded when both charges and payouts are enabled
      if (account.charges_enabled && account.payouts_enabled) {
        await prisma.workerProfile.updateMany({
          where: { stripeAccountId: account.id },
          data: { isVerified: true },
        });
      }
      break;
    }

    case "transfer.created": {
      // Transfer to worker — record transfer ID and mark as paid
      const transfer = event.data.object as Stripe.Transfer;
      if (transfer.metadata?.appId) {
        await prisma.shiftApplication.updateMany({
          where: { id: transfer.metadata.appId },
          data: { stripeTransferId: transfer.id, paidAt: new Date() },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
