export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId   = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });

  const vacatures = await prisma.vacancy.findMany({
    where:   { employerId: employer.id },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ vacatures });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId   = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const {
    title, description, sector, function: fn,
    city, address,
    contractType = "LOONDIENST",
    hoursPerWeek,
    salaryMin, salaryMax,
    requiresBig = false,
    requiresSkj = false,
    minExperience = 0,
    expiresAt,
    status = "OPEN",
  } = body;

  if (!title || !description || !sector || !fn || !city) {
    return NextResponse.json({ error: "titel, beschrijving, sector, functie en stad zijn verplicht" }, { status: 400 });
  }

  const vacature = await prisma.vacancy.create({
    data: {
      employerId:   employer.id,
      title,
      description,
      sector,
      function:     fn,
      city,
      address:      address ?? null,
      contractType,
      hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null,
      salaryMin:    salaryMin    ? parseFloat(salaryMin)  : null,
      salaryMax:    salaryMax    ? parseFloat(salaryMax)  : null,
      requiresBig,
      requiresSkj,
      minExperience: parseInt(minExperience) || 0,
      expiresAt:    expiresAt ? new Date(expiresAt) : null,
      status,
    },
  });

  return NextResponse.json({ ok: true, id: vacature.id }, { status: 201 });
}
