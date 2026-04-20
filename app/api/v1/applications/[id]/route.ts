export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/apiAuth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const employer = await authenticateApiKey(req);
  if (!employer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const app = await prisma.shiftApplication.findUnique({
    where: { id: params.id },
    include: { shift: true },
  });
  if (!app || app.shift.employerId !== employer.id)
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!["ACCEPTED","REJECTED"].includes(body.status))
    return NextResponse.json({ error: "Status moet ACCEPTED of REJECTED zijn" }, { status: 422 });

  const updated = await prisma.shiftApplication.update({
    where: { id: params.id },
    data: { status: body.status },
  });

  return NextResponse.json({ data: updated });
}
