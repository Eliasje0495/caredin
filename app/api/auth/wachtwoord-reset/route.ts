import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();

  if (!email || !token || !password || password.length < 8) {
    return NextResponse.json({ error: "Ongeldige gegevens." }, { status: 400 });
  }

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email.toLowerCase(), token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Link is verlopen of ongeldig." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await Promise.all([
    prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashed },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email.toLowerCase(), token } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
