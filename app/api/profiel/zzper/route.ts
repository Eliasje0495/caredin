import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { VerifyStatus } from "@prisma/client";
import { verifyBigNumber } from "@/lib/big";
import { verifySkjNumber } from "@/lib/skj";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const body = await req.json();

  // Haal huidige nummers op om te bepalen of ze gewijzigd zijn
  const existing = await prisma.workerProfile.findUnique({
    where: { userId },
    select: { bigNumber: true, skjNumber: true },
  });

  const bigChanged = body.bigNumber && body.bigNumber !== existing?.bigNumber;
  const skjChanged = body.skjNumber && body.skjNumber !== existing?.skjNumber;

  // Verifieer alleen als het nummer nieuw/gewijzigd is
  const [bigResult, skjResult] = await Promise.all([
    bigChanged ? verifyBigNumber(body.bigNumber) : Promise.resolve(null),
    skjChanged ? verifySkjNumber(body.skjNumber) : Promise.resolve(null),
  ]);

  const bigStatus = bigResult
    ? (bigResult.valid ? VerifyStatus.VERIFIED : VerifyStatus.UNVERIFIED)
    : undefined;
  const skjStatus = skjResult
    ? (skjResult.valid ? VerifyStatus.VERIFIED : VerifyStatus.UNVERIFIED)
    : undefined;

  const profileData = {
    bio:            body.bio          || undefined,
    dateOfBirth:    body.dateOfBirth  ? new Date(body.dateOfBirth) : undefined,
    address:        body.address      || undefined,
    city:           body.city         || undefined,
    postalCode:     body.postalCode   || undefined,
    bigNumber:      body.bigNumber    || undefined,
    bigStatus:      bigStatus,
    skjNumber:      body.skjNumber    || undefined,
    skjStatus:      skjStatus,
    kvkNumber:      body.kvkNumber    || undefined,
    kvkCompanyName: body.kvkCompanyName || undefined,
    contractType:   body.contractType || undefined,
    hourlyRate:     body.hourlyRate   ? parseFloat(body.hourlyRate) : undefined,
    radius:         body.radius       ? parseInt(body.radius)       : undefined,
  };

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
        ...profileData,
        contractType: body.contractType || "ZZP",
        hourlyRate:   body.hourlyRate ? parseFloat(body.hourlyRate) : 0,
        radius:       body.radius     ? parseInt(body.radius)       : 30,
      },
      update: profileData,
    }),
  ]);

  return NextResponse.json({ ok: true, bigStatus, skjStatus });
}
