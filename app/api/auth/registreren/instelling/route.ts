export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const {
    name,
    email,
    password,
    companyName,
    kvkNumber,
    phone,
    sector,
    address,
    postalCode,
    city,
  } = await req.json();

  // ── Validate required fields
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Naam, e-mailadres en wachtwoord zijn verplicht." },
      { status: 400 }
    );
  }
  if (!companyName) {
    return NextResponse.json(
      { error: "Instellingsnaam is verplicht." },
      { status: 400 }
    );
  }
  if (!kvkNumber) {
    return NextResponse.json(
      { error: "KvK-nummer is verplicht." },
      { status: 400 }
    );
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Telefoonnummer is verplicht." },
      { status: 400 }
    );
  }
  if (!sector) {
    return NextResponse.json(
      { error: "Sector is verplicht." },
      { status: 400 }
    );
  }
  if (!address || !postalCode || !city) {
    return NextResponse.json(
      { error: "Adres, postcode en stad zijn verplicht." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Wachtwoord moet minimaal 8 tekens bevatten." },
      { status: 400 }
    );
  }

  // ── Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Er bestaat al een account met dit e-mailadres." },
      { status: 409 }
    );
  }

  // ── Hash password
  const hashed = await bcrypt.hash(password, 12);

  // ── Create User with role EMPLOYER and nested Employer record
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      role: "EMPLOYER",
      employer: {
        create: {
          companyName,
          kvkNumber,
          sector,
          address,
          postalCode,
          city,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, id: user.id });
}
