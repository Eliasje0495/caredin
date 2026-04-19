import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const body = await req.json();

  await Promise.all([
    prisma.user.update({
      where: { id: userId },
      data: {
        name:  body.name  || undefined,
        phone: body.phone || undefined,
      },
    }),
    prisma.workerProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio:            body.bio          || undefined,
        dateOfBirth:    body.dateOfBirth  ? new Date(body.dateOfBirth) : undefined,
        address:        body.address      || undefined,
        city:           body.city         || undefined,
        postalCode:     body.postalCode   || undefined,
        bigNumber:      body.bigNumber    || undefined,
        skjNumber:      body.skjNumber    || undefined,
        kvkNumber:      body.kvkNumber    || undefined,
        kvkCompanyName: body.kvkCompanyName || undefined,
        contractType:   body.contractType || "ZZP",
        hourlyRate:     body.hourlyRate   ? parseFloat(body.hourlyRate) : 0,
        radius:         body.radius       ? parseInt(body.radius)       : 30,
      },
      update: {
        bio:            body.bio          || undefined,
        dateOfBirth:    body.dateOfBirth  ? new Date(body.dateOfBirth) : undefined,
        address:        body.address      || undefined,
        city:           body.city         || undefined,
        postalCode:     body.postalCode   || undefined,
        bigNumber:      body.bigNumber    || undefined,
        skjNumber:      body.skjNumber    || undefined,
        kvkNumber:      body.kvkNumber    || undefined,
        kvkCompanyName: body.kvkCompanyName || undefined,
        contractType:   body.contractType || undefined,
        hourlyRate:     body.hourlyRate   ? parseFloat(body.hourlyRate) : undefined,
        radius:         body.radius       ? parseInt(body.radius)       : undefined,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
