export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  new_application:  true,
  checkout_pending: true,
  auto_approved:    true,
  shift_reminder:   true,
  no_applicants:    true,
  platform_updates: true,
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const employer = await prisma.employer.findUnique({
    where:  { userId },
    select: { notificationSettings: true },
  });

  if (!employer) return NextResponse.json({ error: "Geen instelling account" }, { status: 403 });

  const settings = (employer.notificationSettings as Record<string, boolean> | null) ?? DEFAULT_SETTINGS;
  return NextResponse.json({ settings: { ...DEFAULT_SETTINGS, ...settings } });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const userId  = (session.user as any).id as string;
  const body    = await req.json().catch(() => ({}));

  // Alleen bekende keys toestaan
  const allowed = Object.keys(DEFAULT_SETTINGS);
  const settings: Record<string, boolean> = {};
  for (const key of allowed) {
    if (key in body) settings[key] = Boolean(body[key]);
  }

  await prisma.employer.update({
    where: { userId },
    data:  { notificationSettings: settings },
  });

  return NextResponse.json({ ok: true, settings: { ...DEFAULT_SETTINGS, ...settings } });
}
