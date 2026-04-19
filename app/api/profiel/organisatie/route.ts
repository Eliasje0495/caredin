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

  await prisma.employer.update({
    where: { userId },
    data: {
      companyName:  body.companyName  || undefined,
      description:  body.description  || undefined,
      address:      body.address      || undefined,
      city:         body.city         || undefined,
      postalCode:   body.postalCode   || undefined,
      website:      body.website      || undefined,
      kvkNumber:    body.kvkNumber    || undefined,
      sector:       body.sector       || undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
