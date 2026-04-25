export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Shifts that start between 20 and 28 hours from now
  const from = new Date(now.getTime() + 20 * 3600000);
  const to   = new Date(now.getTime() + 28 * 3600000);

  const applications = await prisma.shiftApplication.findMany({
    where: {
      status: "ACCEPTED",
      shift: { startTime: { gte: from, lte: to } },
    },
    include: {
      shift: { include: { employer: { select: { companyName: true } } } },
      user:  { select: { email: true, name: true } },
    },
  });

  let sent = 0;
  for (const app of applications) {
    if (!app.user.email) continue;
    try {
      const shift = app.shift;
      const startDate = new Date(shift.startTime);
      const endDate = new Date(shift.endTime);
      const dateStr = startDate.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      const timeStr =
        startDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) +
        "–" +
        endDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
      const address = [(shift as any).address, (shift as any).postalCode, shift.city]
        .filter(Boolean)
        .join(", ") || shift.city || "Zie dashboard";
      const hourlyRate = Number(shift.hourlyRate).toFixed(2);

      // Send email reminder
      await emails.shiftReminder(
        app.user.email,
        app.user.name ?? "Professional",
        shift.title,
        shift.employer.companyName,
        dateStr,
        timeStr,
        address,
        hourlyRate,
      );

      // Also send in-app notification
      await prisma.notification.create({
        data: {
          userId: app.userId,
          type:   "SHIFT_REMINDER",
          title:  `Herinnering: morgen heb je een dienst`,
          body:   `${shift.title} bij ${shift.employer.companyName} — ${startDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`,
          href:   `/dashboard/zzper/timesheets`,
        },
      });
      sent++;
    } catch (e) {
      console.error("Shift reminder fout:", e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
