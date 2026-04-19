import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mailadres vereist." }, { status: 400 });

  const normalised = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalised } });

  // Always return OK to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minuten

  // Delete any existing magic-link token for this email, then create fresh
  await prisma.verificationToken.deleteMany({ where: { identifier: normalised } });
  await prisma.verificationToken.create({ data: { identifier: normalised, token, expires } });

  const url = `${process.env.NEXTAUTH_URL}/inloggen/magic?token=${token}&email=${encodeURIComponent(normalised)}`;

  await sendEmail(
    normalised,
    "Je inloglink — CaredIn",
    `
      <p>Hallo ${user.name?.split(" ")[0] ?? ""},</p>
      <p>Klik op de onderstaande link om in te loggen op je CaredIn account. De link is geldig voor <strong>15 minuten</strong>.</p>
      <p style="margin: 24px 0;">
        <a href="${url}" style="background:#1A7A6A;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Inloggen op CaredIn →
        </a>
      </p>
      <p style="color:#888;font-size:13px;">Als je dit niet hebt aangevraagd, kun je dit bericht negeren.</p>
    `
  );

  return NextResponse.json({ ok: true });
}
