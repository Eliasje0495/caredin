import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = params;

  await prisma.workerProfile.update({
    where: { userId },
    data: {
      bigStatus: "VERIFIED",
      bigVerifiedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
