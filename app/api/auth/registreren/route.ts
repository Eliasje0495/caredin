export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }
  const { name, email, password, rol, companyName } = body;

  if (!name || !email || !password || !rol) {
    return NextResponse.json({ error: "Alle velden zijn verplicht." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Wachtwoord moet minimaal 8 tekens bevatten." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Er bestaat al een account met dit e-mailadres." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const role = (rol === "instelling" || rol === "bedrijf") ? "EMPLOYER" : "WORKER";

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      ...(role === "WORKER" ? {
        workerProfile: { create: {} },
      } : {
        employer: { create: { companyName: companyName ?? name, kvkNumber: `PENDING-${Date.now()}` } },
      }),
    },
  });

  return NextResponse.json({ id: user.id });
}
