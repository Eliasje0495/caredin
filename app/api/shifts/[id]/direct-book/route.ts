export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";
import { dispatchWebhook } from "@/lib/webhook";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const employerUserId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId: employerUserId } });
  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });

  const { workerId } = await req.json();
  if (!workerId) return NextResponse.json({ error: "workerId verplicht" }, { status: 400 });

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift || shift.employerId !== employer.id)
    return NextResponse.json({ error: "Dienst niet gevonden" }, { status: 404 });
  if (shift.status !== "OPEN")
    return NextResponse.json({ error: "Dienst niet meer beschikbaar" }, { status: 400 });

  // Check if already applied
  const existing = await prisma.shiftApplication.findUnique({
    where: { shiftId_userId: { shiftId: params.id, userId: workerId } },
  });
  if (existing) {
    // Just accept if pending
    if (existing.status === "PENDING") {
      await prisma.shiftApplication.update({ where: { id: existing.id }, data: { status: "ACCEPTED" } });
      await prisma.shift.update({ where: { id: params.id }, data: { status: "FILLED", filledAt: new Date() } });
      return NextResponse.json({ ok: true, applicationId: existing.id });
    }
    return NextResponse.json({ error: "Professional al aangemeld" }, { status: 409 });
  }

  const origin = req.headers.get("origin") ?? "https://caredin.nl";
  const overeenkomstUrl = `${origin}/api/shifts/${params.id}/overeenkomst`;

  const [application] = await prisma.$transaction([
    prisma.shiftApplication.create({
      data: { shiftId: params.id, userId: workerId, status: "ACCEPTED", overeenkomstUrl },
    }),
    prisma.shift.update({ where: { id: params.id }, data: { status: "FILLED", filledAt: new Date() } }),
  ]);

  // Notify worker
  const worker = await prisma.user.findUnique({ where: { id: workerId }, select: { email: true, name: true } });
  const NL_DATE = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" });
  if (worker?.email) {
    emails.applicationAccepted(worker.email, shift.title, NL_DATE.format(shift.startTime)).catch(() => {});
  }

  dispatchWebhook(employer.id, "shift.filled", { shiftId: params.id, applicationId: application.id, workerId }).catch(() => {});

  return NextResponse.json({ ok: true, applicationId: application.id });
}
