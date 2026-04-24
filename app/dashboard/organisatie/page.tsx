export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WeekPlanningClient from "./WeekPlanningClient";

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function OrganisatieDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) redirect("/dashboard/onboarding");

  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 7);

  const [shifts, pendingCheckouts, pendingApplications, openShiftsTotal] = await Promise.all([
    prisma.shift.findMany({
      where: { employerId: employer.id, startTime: { gte: monday, lt: sunday } },
      include: {
        _count: { select: { applications: true } },
        applications: {
          where: { status: "ACCEPTED" },
          select: { id: true, user: { select: { name: true } } },
          take: 1,
        },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.shiftApplication.count({ where: { status: "COMPLETED", shift: { employerId: employer.id } } }),
    prisma.shiftApplication.count({ where: { status: "PENDING",   shift: { employerId: employer.id } } }),
    prisma.shift.count({ where: { employerId: employer.id, status: "OPEN" } }),
  ]);

  return (
    <WeekPlanningClient
      initialShifts={JSON.parse(JSON.stringify(shifts))}
      initialWeekStart={monday.toISOString()}
      stats={{ pendingCheckouts, pendingApplications, openShiftsTotal }}
    />
  );
}
