import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { emails } from "@/lib/email";
import { dispatchWebhook } from "@/lib/webhook";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Geen werkgeveraccount." }, { status: 403 });

  // Verify the shift belongs to this employer
  const shift = await prisma.shift.findFirst({ where: { id: params.id, employerId: employer.id } });
  if (!shift) return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });

  const { action } = await req.json(); // "accept" | "reject"
  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ongeldige actie." }, { status: 400 });
  }

  const newStatus = action === "accept" ? "ACCEPTED" : "REJECTED";

  const app = await prisma.shiftApplication.update({
    where: { id: params.appId },
    data: { status: newStatus },
    include: { user: { select: { email: true, name: true } } },
  });

  if (action === "accept") {
    await prisma.shift.update({
      where: { id: params.id },
      data: { status: "FILLED", filledAt: new Date() },
    });
    await prisma.shiftApplication.updateMany({
      where: { shiftId: params.id, id: { not: params.appId }, status: "PENDING" },
      data: { status: "REJECTED" },
    });
    const dateStr = new Date(shift.startTime).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
    emails.applicationAccepted(app.user.email!, shift.title, dateStr).catch(() => {});
    await prisma.notification.create({
      data: {
        userId: app.userId,
        type:   "SHIFT_ACCEPTED",
        title:  "Je aanmelding is geaccepteerd!",
        body:   `Je bent geaccepteerd voor "${shift.title}" op ${new Date(shift.startTime).toLocaleDateString("nl-NL")}.`,
        href:   `/dashboard/zzper/timesheets`,
      },
    });
    dispatchWebhook(employer.id, "shift.filled", {
      shiftId: params.id,
      applicationId: params.appId,
      workerName: app.user.name ?? "Onbekend",
      workerEmail: app.user.email ?? "",
    }).catch(() => {});
  } else {
    emails.applicationRejected(app.user.email!, shift.title).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
