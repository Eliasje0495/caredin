export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) return NextResponse.json({ error: "Not employer" }, { status: 403 });

  const { shifts } = await req.json();
  let created = 0; let failed = 0;

  for (const s of shifts) {
    try {
      await prisma.shift.create({
        data: {
          employerId:   employer.id,
          title:        s.title,
          description:  s.description || null,
          function:     s.function,
          sector:       s.sector,
          address:      s.address,
          city:         s.city,
          postalCode:   s.postalCode,
          startTime:    new Date(s.startTime),
          endTime:      new Date(s.endTime),
          hourlyRate:   parseFloat(s.hourlyRate),
          breakMinutes: s.breakMinutes ?? 30,
          status:       "OPEN",
        },
      });
      created++;
    } catch (e) {
      console.error("Bulk import fout:", e);
      failed++;
    }
  }

  return NextResponse.json({ created, failed });
}
