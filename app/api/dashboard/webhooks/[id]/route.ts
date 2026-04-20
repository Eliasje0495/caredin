export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen employer account" }, { status: 403 });

  const wh = await prisma.webhookEndpoint.findUnique({ where: { id: params.id } });
  if (!wh || wh.employerId !== employer.id) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  await prisma.webhookEndpoint.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
