export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
  const userId = (session.user as any).id;
  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: "document",
    metadata: { userId },
    options: {
      document: {
        allowed_types: ["id_card", "passport", "driving_license"],
        require_id_number: false,
        require_live_capture: true,
        require_matching_selfie: true,
      },
    },
    return_url: `${origin}/dashboard/onboarding/identity-return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return NextResponse.json({ url: verificationSession.url, sessionId: verificationSession.id });
}
