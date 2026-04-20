export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });
  const locations = await prisma.location.findMany({
    where: { employerId: employer.id, isActive: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ locations });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });
  const { name, address, city, postalCode } = await req.json();
  if (!name || !address || !city || !postalCode)
    return NextResponse.json({ error: "Alle velden verplicht" }, { status: 400 });
  const location = await prisma.location.create({
    data: { employerId: employer.id, name, address, city, postalCode },
  });
  return NextResponse.json({ location }, { status: 201 });
}
