export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getDatesForRecurrence(
  startDate: Date,
  endDate: Date,
  days: number[], // 0=sun,1=mon,...,6=sat
  until: Date
): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);
  while (current <= until && dates.length < 52) {
    if (days.includes(current.getDay())) {
      dates.push(new Date(current));
    }
    current = addDays(current, 1);
  }
  return dates;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });

  const body = await req.json();
  // body: { base: ShiftCreateInput, recurrence: { days: number[], until: string } }
  const { base, recurrence } = body;

  if (!base || !recurrence?.days?.length || !recurrence?.until)
    return NextResponse.json({ error: "base en recurrence verplicht" }, { status: 400 });

  const templateStart = new Date(base.startTime);
  const templateEnd = new Date(base.endTime);
  const shiftDuration = templateEnd.getTime() - templateStart.getTime();
  const until = new Date(recurrence.until);

  const dates = getDatesForRecurrence(templateStart, templateEnd, recurrence.days, until);
  if (dates.length === 0) return NextResponse.json({ error: "Geen datums gevonden voor deze herhaling" }, { status: 422 });

  // Create parent template shift first
  const parent = await prisma.shift.create({
    data: {
      employerId: employer.id,
      title: base.title, description: base.description ?? null,
      sector: base.sector, function: base.function,
      address: base.address, city: base.city, postalCode: base.postalCode,
      startTime: templateStart, endTime: templateEnd,
      breakMinutes: base.breakMinutes ?? 30,
      hourlyRate: base.hourlyRate,
      requiresBig: base.requiresBig ?? false,
      requiresSkj: base.requiresSkj ?? false,
      requiresKvk: base.requiresKvk ?? true,
      isUrgent: base.isUrgent ?? false,
      minExperience: base.minExperience ?? 0,
      isRecurring: true,
      recurrenceRule: JSON.stringify({ freq: "weekly", days: recurrence.days, until: recurrence.until }),
    },
  });

  // Create instances (skip the first date since it's the parent)
  const instanceDates = dates.slice(1);
  await prisma.shift.createMany({
    data: instanceDates.map((date) => ({
      employerId: employer.id,
      title: base.title, description: base.description ?? null,
      sector: base.sector, function: base.function,
      address: base.address, city: base.city, postalCode: base.postalCode,
      startTime: date,
      endTime: new Date(date.getTime() + shiftDuration),
      breakMinutes: base.breakMinutes ?? 30,
      hourlyRate: base.hourlyRate,
      requiresBig: base.requiresBig ?? false,
      requiresSkj: base.requiresSkj ?? false,
      requiresKvk: base.requiresKvk ?? true,
      isUrgent: base.isUrgent ?? false,
      minExperience: base.minExperience ?? 0,
      isRecurring: true,
      parentShiftId: parent.id,
    })),
  });

  const total = 1 + instanceDates.length;
  return NextResponse.json({ ok: true, created: total, parentId: parent.id }, { status: 201 });
}
