export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

// GET /api/v1/timesheets/export?format=csv|json&since=ISO_DATE
export async function GET(req: NextRequest) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "json";
  const since = searchParams.get("since") ? new Date(searchParams.get("since")!) : undefined;

  const timesheets = await prisma.shiftApplication.findMany({
    where: {
      shift: { employerId: employer.id },
      status: "APPROVED",
      hoursWorked: { not: null },
      ...(since ? { updatedAt: { gte: since } } : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      shift: { select: { id: true, title: true, startTime: true, endTime: true, hourlyRate: true } },
    },
    orderBy: { shift: { startTime: "asc" } },
  });

  if (format === "csv") {
    const rows = [
      ["id", "worker_name", "worker_email", "shift_title", "shift_date", "start_time", "end_time", "hours_worked", "hourly_rate", "payout_amount", "paid_at"].join(","),
      ...timesheets.map((t) => [
        t.id,
        `"${t.user.name ?? ""}"`,
        t.user.email,
        `"${t.shift.title}"`,
        new Date(t.shift.startTime).toISOString().split("T")[0],
        new Date(t.shift.startTime).toISOString(),
        new Date(t.shift.endTime).toISOString(),
        t.hoursWorked,
        t.shift.hourlyRate,
        t.payoutAmount,
        t.paidAt?.toISOString() ?? "",
      ].join(",")),
    ].join("\n");

    return new NextResponse(rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="caredin-timesheets-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ data: timesheets });
}
