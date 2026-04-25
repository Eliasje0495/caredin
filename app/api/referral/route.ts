export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCode(name: string): string {
  const base = (name.split(" ")[0] ?? "USER").toUpperCase().slice(0, 5).replace(/[^A-Z]/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}-${rand}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, name: true, referrals: { select: { id: true, name: true, createdAt: true } }, referralRewards: true },
  });

  // Generate code if not exists
  if (!user?.referralCode) {
    const code = generateCode(user?.name ?? "USER");
    await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, name: true, referrals: { select: { id: true, name: true, createdAt: true } }, referralRewards: true },
    });
  }

  const totalEarned = (user?.referralRewards ?? []).reduce((s, r) => s + Number(r.bonusAmount), 0);
  const pendingRewards = (user?.referralRewards ?? []).filter(r => !r.paidOut).length;

  return NextResponse.json({
    code: user?.referralCode,
    referrals: user?.referrals ?? [],
    totalEarned,
    pendingRewards,
  });
}
