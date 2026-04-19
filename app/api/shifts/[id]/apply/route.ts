export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const userId = (session.user as any).id as string;
  const shiftId = params.id;

  // Fetch shift
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift)
    return NextResponse.json({ error: "Dienst niet gevonden." }, { status: 404 });
  if (shift.status !== "OPEN")
    return NextResponse.json(
      { error: "Deze dienst is niet meer beschikbaar." },
      { status: 400 }
    );

  // Check worker profile
  const profile = await prisma.workerProfile.findUnique({ where: { userId } });
  if (!profile)
    return NextResponse.json(
      { error: "Vul eerst je profiel in." },
      { status: 400 }
    );

  // Check BIG requirement
  if (shift.requiresBig && profile.bigStatus !== "VERIFIED") {
    return NextResponse.json(
      { error: "Deze dienst vereist een geverifieerd BIG-nummer." },
      { status: 400 }
    );
  }

  // Check duplicate
  const existing = await prisma.shiftApplication.findUnique({
    where: { shiftId_userId: { shiftId, userId } },
  });
  if (existing)
    return NextResponse.json(
      { error: "Je hebt je al aangemeld voor deze dienst." },
      { status: 409 }
    );

  // Create application
  const application = await prisma.shiftApplication.create({
    data: { shiftId, userId, status: "PENDING" },
  });

  // Notify employer
  const employer = await prisma.employer.findUnique({
    where: { id: shift.employerId },
    include: { user: { select: { email: true } } },
  });
  if (employer?.user?.email) {
    emails.applicationReceived(
      employer.user.email,
      session.user?.name ?? "Een professional",
      shift.title
    ).catch(() => {});
  }

  return NextResponse.json({ id: application.id });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const userId = (session.user as any).id as string;

  const app = await prisma.shiftApplication.findUnique({
    where: { shiftId_userId: { shiftId: params.id, userId } },
  });
  if (!app)
    return NextResponse.json(
      { error: "Aanmelding niet gevonden." },
      { status: 404 }
    );

  await prisma.shiftApplication.update({
    where: { id: app.id },
    data: { status: "WITHDRAWN" },
  });

  return NextResponse.json({ ok: true });
}
