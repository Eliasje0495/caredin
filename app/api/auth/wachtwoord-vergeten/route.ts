import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mailadres vereist." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Always return OK to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token: "" } },
    create: { identifier: email, token, expires },
    update: { token, expires },
  }).catch(async () => {
    // If upsert fails (no existing token), just create
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/wachtwoord-reset?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail(
    email,
    "Wachtwoord opnieuw instellen — CaredIn",
    `
      <p>Hallo,</p>
      <p>Je hebt een verzoek ingediend om je wachtwoord opnieuw in te stellen.</p>
      <p><a href="${resetUrl}">Klik hier om je wachtwoord te resetten →</a></p>
      <p>Deze link is geldig voor 1 uur. Als je geen aanvraag hebt ingediend, kun je dit bericht negeren.</p>
    `
  );

  return NextResponse.json({ ok: true });
}
