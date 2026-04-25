import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emails } from "@/lib/email";

export const dynamic = "force-dynamic";

function getEmail(session: unknown): string | null {
  return (session as { user?: { email?: string } } | null)?.user?.email ?? null;
}

// PATCH — status bijwerken (indienen / goedkeuren / afwijzen / betaald)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const email = getEmail(session);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, afwijzingReden } = await req.json();
  const { id } = params;

  const declaratie = await prisma.declaratie.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      employer: { select: { companyName: true, user: { select: { email: true } } } },
    },
  });
  if (!declaratie) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const isOwner    = declaratie.user.email === email;
  const isEmployer = declaratie.employer.user.email === email;
  const bedrag     = Number(declaratie.totaalBedrag).toFixed(2);
  const workerName = declaratie.user.name ?? declaratie.user.email;

  if (action === "indienen" && isOwner) {
    await prisma.declaratie.update({ where: { id }, data: { status: "INGEDIEND", ingediendAt: new Date() } });
    emails.declaratieIngediend(declaratie.employer.user.email, declaratie.employer.companyName, workerName, declaratie.nummer, bedrag).catch(() => {});
  } else if (action === "goedkeuren" && isEmployer) {
    await prisma.declaratie.update({ where: { id }, data: { status: "GOEDGEKEURD", goedgekeurdAt: new Date() } });
    emails.declaratieGoedgekeurd(declaratie.user.email, workerName, declaratie.nummer, bedrag).catch(() => {});
  } else if (action === "afwijzen" && isEmployer) {
    await prisma.declaratie.update({ where: { id }, data: { status: "AFGEWEZEN", afwijzingReden: afwijzingReden ?? null } });
    emails.declaratieAfgewezen(declaratie.user.email, workerName, declaratie.nummer, afwijzingReden ?? "Geen reden opgegeven").catch(() => {});
  } else if (action === "betaald" && isEmployer) {
    await prisma.declaratie.update({ where: { id }, data: { status: "BETAALD", betaaldAt: new Date() } });
  } else if (action === "herroepen" && isOwner && declaratie.status === "INGEDIEND") {
    await prisma.declaratie.update({ where: { id }, data: { status: "CONCEPT", ingediendAt: null } });
  } else {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — verwijder concept
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const email = getEmail(session);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const declaratie = await prisma.declaratie.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true } } },
  });
  if (!declaratie) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  if (declaratie.user.email !== email || declaratie.status !== "CONCEPT") {
    return NextResponse.json({ error: "Niet toegestaan" }, { status: 403 });
  }

  await prisma.declaratie.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
