import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { emails } from "@/lib/email";

export const dynamic = "force-dynamic";

// Runs every 5 minutes via Vercel Cron (Pro) or externally.
// Finds ACCEPTED applications with shifts starting in 8–15 minutes,
// creates a Stripe Identity VerificationSession, and emails the worker.
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 8 * 60 * 1000);   // 8 min from now
  const windowEnd   = new Date(now.getTime() + 15 * 60 * 1000);  // 15 min from now

  const applications = await prisma.shiftApplication.findMany({
    where: {
      status: "ACCEPTED",
      identitySentAt: null, // not yet triggered
      shift: {
        startTime: { gte: windowStart, lte: windowEnd },
        status: { in: ["FILLED", "IN_PROGRESS"] },
      },
    },
    include: {
      shift: { select: { title: true, startTime: true, address: true, city: true } },
      user:  { select: { email: true, name: true, id: true } },
    },
  });

  const stripe = getStripe();
  const origin = process.env.NEXTAUTH_URL ?? "https://caredin.nl";
  let sent = 0;

  for (const app of applications) {
    if (!app.user.email) continue;

    try {
      const session = await stripe.identity.verificationSessions.create({
        type: "document",
        metadata: {
          applicationId: app.id,
          userId: app.user.id,
          shiftId: app.shiftId,
        },
        options: {
          document: {
            allowed_types: ["id_card", "passport", "driving_license"],
            require_live_capture: true,
            require_matching_selfie: true,
          },
        },
        return_url: `${origin}/dashboard/zzper/timesheets?identity=done`,
      });

      await prisma.shiftApplication.update({
        where: { id: app.id },
        data: {
          identitySessionId:  session.id,
          identitySessionUrl: session.url,
          identitySentAt:     new Date(),
        },
      });

      const startFormatted = app.shift.startTime.toLocaleTimeString("nl-NL", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam",
      });

      await emails.identityCheck(
        app.user.email,
        app.user.name ?? "Zorgprofessional",
        app.shift.title,
        startFormatted,
        session.url!,
      );

      sent++;
    } catch (err) {
      console.error("Identity check failed for app", app.id, err);
    }
  }

  return NextResponse.json({ checked: applications.length, sent, at: now.toISOString() });
}
