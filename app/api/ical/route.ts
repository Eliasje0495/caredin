export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function pad(n: number) { return String(n).padStart(2, "0"); }
function icsDate(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}
function escIcs(s: string) { return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const userId = (session.user as any).id;
  const apps = await prisma.shiftApplication.findMany({
    where: { userId, status: { in: ["ACCEPTED", "COMPLETED", "APPROVED"] } },
    include: { shift: { include: { employer: { select: { companyName: true } } } } },
    orderBy: { shift: { startTime: "asc" } },
  });

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Caredin//Mijn Diensten//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Caredin Diensten",
    "X-WR-TIMEZONE:Europe/Amsterdam",
  ];

  for (const app of apps) {
    const s = app.shift;
    const uid = `caredin-shift-${app.id}@caredin.nl`;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTART:${icsDate(new Date(s.startTime))}`);
    lines.push(`DTEND:${icsDate(new Date(s.endTime))}`);
    lines.push(`SUMMARY:${escIcs(s.title)}`);
    lines.push(`LOCATION:${escIcs(s.address + ", " + s.city)}`);
    lines.push(`DESCRIPTION:${escIcs(s.employer.companyName + " · €" + Number(s.hourlyRate).toFixed(2) + "/uur")}`);
    lines.push(`STATUS:${app.status === "ACCEPTED" ? "CONFIRMED" : "COMPLETED"}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="caredin-diensten.ics"',
    },
  });
}
