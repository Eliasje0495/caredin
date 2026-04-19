import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { VerifyStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const body = await req.json();
  const { step, ...data } = body;
  const role = (session!.user as any).role as string;

  if (role === "WORKER") {
    const workerData = buildWorkerData(step, data);
    if (step === 1 && data.phone) {
      await prisma.user.update({ where: { id: userId }, data: { phone: data.phone } });
    }
    await prisma.workerProfile.upsert({
      where: { userId },
      create: { userId, ...workerData },
      update: workerData,
    });
  } else if (role === "EMPLOYER") {
    await prisma.employer.update({
      where: { userId },
      data: buildEmployerData(step, data),
    });
  }

  return NextResponse.json({ ok: true });
}

function buildWorkerData(step: number, data: any) {
  if (step === 1) return {
    bio:         data.bio,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    address:     data.address,
    city:        data.city,
    postalCode:  data.postalCode,
  };
  if (step === 2) return {}; // file upload — handled separately
  if (step === 3) return {
    bigNumber:    data.bigNumber    || undefined,
    bigStatus:    data.bigNumber    ? VerifyStatus.PENDING : undefined,
    skjNumber:    data.skjNumber    || undefined,
    skjStatus:    data.skjNumber    ? VerifyStatus.PENDING : undefined,
    kabizNumber:  data.kabizNumber  || undefined,
    kabizStatus:  data.kabizNumber  ? VerifyStatus.PENDING : undefined,
    agbCode:      data.agbCode      || undefined,
    crkboNumber:  data.crkboNumber  || undefined,
    nvpaNipNumber: data.nvpaNipNumber || undefined,
  };
  if (step === 4) return {
    contractType:   data.contractType || "ZZP",
    kvkNumber:      data.kvkNumber     || undefined,
    kvkCompanyName: data.kvkCompanyName || undefined,
    kvkStatus:      data.kvkNumber     ? VerifyStatus.PENDING : undefined,
    hourlyRate:     data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
  };
  return {};
}

function buildEmployerData(step: number, data: any) {
  if (step === 1) return {
    description: data.description,
    address:     data.address,
    city:        data.city,
    postalCode:  data.postalCode,
    website:     data.website,
  };
  if (step === 2) return {}; // logo upload
  if (step === 3) return {
    kvkNumber: data.kvkNumber,
    kvkStatus: data.kvkNumber ? VerifyStatus.PENDING : undefined,
  };
  if (step === 4) return {}; // billing
  return {};
}
