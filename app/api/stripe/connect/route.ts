import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// GET — generate onboarding link for worker
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const stripe = getStripe();
  const profile = await prisma.workerProfile.findUnique({ where: { userId } });
  const user    = await prisma.user.findUnique({ where: { id: userId } });

  let accountId = profile?.stripeAccountId;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "NL",
      email: user?.email ?? undefined,
      capabilities: { transfers: { requested: true } },
      business_type: "individual",
      metadata: { userId },
    });
    accountId = account.id;
    await prisma.workerProfile.update({
      where: { userId },
      data: { stripeAccountId: accountId },
    });
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/dashboard/zzper/profiel?stripe=refresh`,
    return_url:  `${process.env.NEXTAUTH_URL}/dashboard/zzper/profiel?stripe=success`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}
