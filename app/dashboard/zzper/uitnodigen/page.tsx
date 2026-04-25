export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReferralClient from "./ReferralClient";

async function getOrCreateCode(userId: string, name: string | null): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (user?.referralCode) return user.referralCode;
  const base = (name?.split(" ")[0] ?? "USER").toUpperCase().slice(0, 5).replace(/[^A-Z]/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `${base}-${rand}`;
  await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
  return code;
}

export default async function UitnodigPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");
  const userId = (session.user as any).id;

  const code = await getOrCreateCode(userId, session.user?.name ?? null);

  const [referrals, rewards] = await Promise.all([
    prisma.user.findMany({ where: { referredById: userId }, select: { name: true, createdAt: true } }),
    prisma.referralReward.findMany({ where: { referrerId: userId } }),
  ]);

  const totalEarned  = rewards.reduce((s, r) => s + Number(r.bonusAmount), 0);
  const pendingCount = rewards.filter(r => !r.paidOut).length;

  return (
    <ReferralClient
      code={code}
      referrals={JSON.parse(JSON.stringify(referrals))}
      totalEarned={totalEarned}
      pendingCount={pendingCount}
    />
  );
}
