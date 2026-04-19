import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen werkgeveraccount." }, { status: 403 });

  const body = await req.json();

  const {
    title, description, sector, function: fn, address, city, postalCode,
    startDate, startTimeStr, endTimeStr, breakMinutes,
    hourlyRate, isUrgent, isNightShift,
    requiresBig, requiresSkj, requiresKvk, minExperience,
  } = body;

  if (!title || !sector || !fn || !address || !city || !postalCode || !startDate || !startTimeStr || !endTimeStr || !hourlyRate) {
    return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
  }

  const startTime = new Date(`${startDate}T${startTimeStr}`);
  const endTime   = new Date(`${startDate}T${endTimeStr}`);
  if (endTime <= startTime) return NextResponse.json({ error: "Eindtijd moet na begintijd liggen." }, { status: 400 });

  const shift = await prisma.shift.create({
    data: {
      employerId:   employer.id,
      title,
      description:  description || undefined,
      sector,
      function:     fn,
      address,
      city,
      postalCode,
      startTime,
      endTime,
      breakMinutes: parseInt(breakMinutes) || 30,
      hourlyRate:   parseFloat(hourlyRate),
      isUrgent:     !!isUrgent,
      isNightShift: !!isNightShift,
      requiresBig:  !!requiresBig,
      requiresSkj:  !!requiresSkj,
      requiresKvk:  !!requiresKvk,
      minExperience: parseInt(minExperience) || 0,
    },
  });

  await prisma.employer.update({
    where: { id: employer.id },
    data: { totalShiftsPosted: { increment: 1 } },
  });

  return NextResponse.json({ id: shift.id });
}
