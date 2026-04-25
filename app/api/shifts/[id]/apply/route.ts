export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";
import { dispatchWebhook } from "@/lib/webhook";

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
  if (existing && existing.status !== "WITHDRAWN")
    return NextResponse.json(
      { error: "Je hebt je al aangemeld voor deze dienst." },
      { status: 409 }
    );

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "https://caredin.nl";
  const overeenkomstUrl = `${origin}/api/shifts/${shiftId}/overeenkomst`;

  // Heraanmelden na intrekking — update bestaand record
  let application;
  if (existing?.status === "WITHDRAWN") {
    application = await prisma.shiftApplication.update({
      where: { id: existing.id },
      data: { status: "PENDING", overeenkomstUrl, appliedAt: new Date() },
    });
  } else {
    application = await prisma.shiftApplication.create({
      data: { shiftId, userId, status: "PENDING", overeenkomstUrl },
    });
  }

  // Dispatch webhook
  dispatchWebhook(shift.employerId, "shift.applied", {
    shiftId,
    applicationId: application.id,
    workerName: session.user?.name ?? "Onbekend",
    workerEmail: session.user?.email ?? "",
  }).catch(() => {});

  // Notify employer
  const employer = await prisma.employer.findUnique({
    where: { id: shift.employerId },
    include: { user: { select: { id: true, email: true } } },
  });
  if (employer?.user?.email) {
    emails.applicationReceived(
      employer.user.email,
      session.user?.name ?? "Een professional",
      shift.title
    ).catch(() => {});
  }
  if (employer?.user?.id) {
    const workerName = session.user?.name ?? "Een professional";
    await prisma.notification.create({
      data: {
        userId: employer.user.id,
        type:   "NEW_APPLICATION",
        title:  `Nieuwe aanmelding voor "${shift.title}"`,
        body:   `${workerName} heeft zich aangemeld.`,
        href:   `/dashboard/organisatie/diensten/${shift.id}`,
      },
    });
  }

  // Send overeenkomst to worker
  if (session.user?.email) {
    emails.overeenkomstWorker(
      session.user.email,
      session.user.name ?? "Zorgprofessional",
      shift.title,
      overeenkomstUrl,
    ).catch(() => {});
  }

  return NextResponse.json({ id: application.id, overeenkomstUrl });
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
