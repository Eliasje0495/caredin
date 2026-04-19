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
    include: { shift: true },
  });
  if (!app) return NextResponse.json({ error: "Geen geaccepteerde aanmelding gevonden." }, { status: 404 });
  if (app.checkedInAt) return NextResponse.json({ error: "Al ingecheckt." }, { status: 409 });

  await prisma.shiftApplication.update({
    where: { id: app.id },
    data: { checkedInAt: new Date() },
  });
  await prisma.shift.update({
    where: { id: params.id },
    data: { status: "IN_PROGRESS" },
  });

  return NextResponse.json({ ok: true });
}
