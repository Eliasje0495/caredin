import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getEmail(session: unknown): string | null {
  return (session as { user?: { email?: string } } | null)?.user?.email ?? null;
}

// GET — lijst declaraties voor ingelogde user (ZZP'er of werkgever)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = getEmail(session);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = req.nextUrl.searchParams.get("role");

  if (role === "employer" || user.role === "EMPLOYER") {
    const employer = await prisma.employer.findFirst({ where: { userId: user.id }, select: { id: true } });
    if (!employer) return NextResponse.json({ declaraties: [] });
    const declaraties = await prisma.declaratie.findMany({
      where: { employerId: employer.id },
      include: { user: { select: { name: true, email: true } }, regels: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ declaraties });
  }

  const declaraties = await prisma.declaratie.findMany({
    where: { userId: user.id },
    include: { employer: { select: { companyName: true } }, regels: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ declaraties });
}

// POST — nieuwe declaratie aanmaken
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = getEmail(session);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employerId, periodeStart, periodeEinde, regels, notitie, indienen } = await req.json();

  if (!employerId || !periodeStart || !periodeEinde || !regels?.length) {
    return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 });
  }

  // Genereer uniek nummer
  const count = await prisma.declaratie.count();
  const jaar  = new Date().getFullYear();
  const nummer = `DEC-${jaar}-${String(count + 1).padStart(4, "0")}`;

  const totaalBedrag = regels.reduce((s: number, r: { bedrag: number }) => s + Number(r.bedrag), 0);

  const declaratie = await prisma.declaratie.create({
    data: {
      nummer,
      userId:      user.id,
      employerId,
      periodeStart: new Date(periodeStart),
      periodeEinde:  new Date(periodeEinde),
      totaalBedrag,
      notitie:     notitie ?? null,
      status:      indienen ? "INGEDIEND" : "CONCEPT",
      ingediendAt: indienen ? new Date() : null,
      regels: {
        create: regels.map((r: { omschrijving: string; datum: string; uren: number; tarief: number; bedrag: number }) => ({
          omschrijving: r.omschrijving,
          datum:        new Date(r.datum),
          uren:         r.uren,
          tarief:       r.tarief,
          bedrag:       r.bedrag,
        })),
      },
    },
    include: { regels: true },
  });

  return NextResponse.json({ declaratie });
}
