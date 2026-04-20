import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { OvereenkomstDocument, OvereenkomstData } from "@/lib/overeenkomst";
import React from "react";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const userId  = (session.user as any).id as string;
  const shiftId = params.id;

  // Load all needed data
  const application = await prisma.shiftApplication.findUnique({
    where: { shiftId_userId: { shiftId, userId } },
    include: {
      user: {
        select: { name: true, email: true },
      },
      shift: {
        include: {
          employer: {
            select: {
              companyName: true,
              address: true,
              city: true,
              kvkNumber: true,
            },
          },
        },
      },
    },
  });

  if (!application) return NextResponse.json({ error: "Aanmelding niet gevonden." }, { status: 404 });

  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
    select: { address: true, city: true, kvkNumber: true, kvkCompanyName: true, contractType: true },
  });

  const shift = application.shift;
  const employer = shift.employer;

  const NL_DATE = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam",
  });
  const NL_TIME = new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam",
  });

  const data: OvereenkomstData = {
    workerName:    application.user.name ?? "Onbekend",
    workerEmail:   application.user.email ?? "",
    workerAddress: profile?.address ?? undefined,
    workerCity:    profile?.city ?? undefined,
    kvkNumber:     profile?.kvkNumber ?? undefined,
    kvkCompanyName: profile?.kvkCompanyName ?? undefined,
    companyName:   employer.companyName,
    companyAddress: employer.address ?? undefined,
    companyCity:   employer.city ?? undefined,
    companyKvk:    employer.kvkNumber ?? undefined,
    shiftTitle:    shift.title,
    shiftDate:     NL_DATE.format(shift.startTime),
    startTime:     NL_TIME.format(shift.startTime),
    endTime:       NL_TIME.format(shift.endTime),
    address:       shift.address,
    city:          shift.city,
    hourlyRate:    Number(shift.hourlyRate).toFixed(2),
    contractType:  profile?.contractType ?? "ZZP",
    applicationId: application.id,
    generatedAt:   NL_DATE.format(application.appliedAt),
    generatedTime: NL_TIME.format(application.appliedAt),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(React.createElement(OvereenkomstDocument, { d: data }) as any);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Modelovereenkomst-CaredIn-${data.applicationId.slice(-8).toUpperCase()}.pdf"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
