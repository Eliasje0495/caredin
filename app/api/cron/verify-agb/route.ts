import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAgbCode } from "@/lib/agb";

export const dynamic = "force-dynamic";

// Runs daily via Vercel Cron — re-validates all worker AGB codes against Vektis
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const workers = await prisma.workerProfile.findMany({
    where: { agbCode: { not: null } },
    select: { id: true, agbCode: true, agbStatus: true },
  });

  let verified = 0;
  let rejected = 0;
  let unchanged = 0;

  for (const worker of workers) {
    if (!worker.agbCode) continue;

    const result = await verifyAgbCode(worker.agbCode);

    if (result.valid) {
      if (worker.agbStatus !== "VERIFIED") {
        await prisma.workerProfile.update({
          where: { id: worker.id },
          data: { agbStatus: "VERIFIED", agbVerifiedAt: new Date() },
        });
        verified++;
      } else {
        // Already verified — just refresh the timestamp
        await prisma.workerProfile.update({
          where: { id: worker.id },
          data: { agbVerifiedAt: new Date() },
        });
        unchanged++;
      }
    } else {
      // Not found or invalid — mark as REJECTED if it was previously verified or pending
      if (worker.agbStatus !== "UNVERIFIED") {
        await prisma.workerProfile.update({
          where: { id: worker.id },
          data: { agbStatus: "REJECTED" },
        });
        rejected++;
      }
    }
  }

  return NextResponse.json({
    checked: workers.length,
    verified,
    rejected,
    unchanged,
    at: new Date().toISOString(),
  });
}
