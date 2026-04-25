// app/api/cron/skj-expiry/route.ts
// Dagelijkse cron: stuur notificatie aan ZZP'ers waarvan de SKJ-registratie
// binnen 30 dagen verloopt (of al verlopen is).
// Vercel schedule: "0 7 * * *" (elke dag 07:00 UTC)

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const DAYS_WARNING  = 30;  // Eerste notificatie: 30 dagen voor verlopen
const DAYS_URGENT   = 7;   // Tweede notificatie: 7 dagen voor verlopen

export async function GET(req: NextRequest) {
  // Beveilig cron endpoint
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now     = new Date();
  const in30    = new Date(now); in30.setDate(in30.getDate() + DAYS_WARNING);
  const in7     = new Date(now); in7.setDate(in7.getDate() + DAYS_URGENT);

  // Haal alle ZZP'ers op met een bekende SKJ verloopdatum
  const profiles = await prisma.workerProfile.findMany({
    where: {
      skjStatus:    "VERIFIED",
      skjExpiresAt: { not: null },
    },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  let notified30 = 0;
  let notified7  = 0;
  let notifiedExpired = 0;

  for (const profile of profiles) {
    if (!profile.skjExpiresAt || !profile.user.email) continue;

    const expiresAt  = new Date(profile.skjExpiresAt);
    const daysLeft   = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const naam       = profile.user.name?.split(" ")[0] ?? "Professional";
    const datumStr   = expiresAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

    if (daysLeft <= 0) {
      // Verlopen
      await sendEmail(
        profile.user.email,
        "⚠️ Je SKJ-registratie is verlopen",
        emailVerlopen(naam, datumStr)
      );
      // Zet status op UNVERIFIED zodat instelling het ook ziet
      await prisma.workerProfile.update({
        where: { id: profile.id },
        data:  { skjStatus: "UNVERIFIED" },
      });
      notifiedExpired++;
    } else if (daysLeft <= DAYS_URGENT) {
      // Urgente herinnering: 7 dagen
      await sendEmail(
        profile.user.email,
        `🚨 Nog ${daysLeft} dagen — vernieuw je SKJ-registratie`,
        emailHerinnering(naam, datumStr, daysLeft, true)
      );
      notified7++;
    } else if (daysLeft <= DAYS_WARNING) {
      // Eerste waarschuwing: 30 dagen
      await sendEmail(
        profile.user.email,
        `📋 Je SKJ-registratie verloopt over ${daysLeft} dagen`,
        emailHerinnering(naam, datumStr, daysLeft, false)
      );
      notified30++;
    }
  }

  return NextResponse.json({
    ok:             true,
    gecontroleerd:  profiles.length,
    notified30,
    notified7,
    notifiedExpired,
    timestamp:      now.toISOString(),
  });
}

// ─── Email templates ─────────────────────────────────────────────────────────

function emailHerinnering(naam: string, datum: string, daysLeft: number, urgent: boolean): string {
  const urgentClass = urgent ? "color:#DC2626;" : "color:#D97706;";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
      <div style="margin-bottom:24px;">
        <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5DB8A4;">CaredIn</span>
      </div>
      <h1 style="font-size:24px;font-weight:700;color:#0F1117;margin:0 0 8px;">
        Hoi ${naam}, je SKJ-registratie verloopt binnenkort
      </h1>
      <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Je SKJ-registratie verloopt op <strong>${datum}</strong> — dat is over
        <strong style="${urgentClass}font-weight:700;">${daysLeft} ${daysLeft === 1 ? "dag" : "dagen"}</strong>.
      </p>
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#92400E;font-weight:600;">
          ${urgent ? "🚨 Urgente actie vereist" : "📋 Actie vereist"}
        </p>
        <p style="margin:8px 0 0;font-size:13px;color:#92400E;">
          Zonder een geldige SKJ-registratie kun je niet worden ingepland voor diensten die SKJ vereisen.
          Verleng je registratie tijdig via SKJ Jeugd.
        </p>
      </div>
      <a href="https://register.skjeugd.nl"
         style="display:inline-block;background:#5DB8A4;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px;">
        SKJ registratie verlengen →
      </a>
      <p style="color:#9CA3AF;font-size:12px;margin-top:32px;">
        Na verlenging kun je je nieuwe verloopdatum bijwerken in je
        <a href="https://caredin.nl/dashboard/zzper/profiel" style="color:#5DB8A4;">CaredIn profiel</a>.
      </p>
    </div>
  `;
}

function emailVerlopen(naam: string, datum: string): string {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
      <div style="margin-bottom:24px;">
        <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5DB8A4;">CaredIn</span>
      </div>
      <h1 style="font-size:24px;font-weight:700;color:#0F1117;margin:0 0 8px;">
        Je SKJ-registratie is verlopen
      </h1>
      <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Hoi ${naam}, je SKJ-registratie is op <strong>${datum}</strong> verlopen.
        Je profiel is tijdelijk op <strong style="color:#DC2626;">Aandacht vereist</strong> gezet.
      </p>
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#991B1B;font-weight:600;">⚠️ Profiel tijdelijk niet actief</p>
        <p style="margin:8px 0 0;font-size:13px;color:#991B1B;">
          Zorginstellingen kunnen je niet meer boeken voor SKJ-vereiste diensten totdat je registratie
          is vernieuwd en bijgewerkt in je profiel.
        </p>
      </div>
      <a href="https://register.skjeugd.nl"
         style="display:inline-block;background:#DC2626;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px;">
        Direct verlengen →
      </a>
      <p style="color:#9CA3AF;font-size:12px;margin-top:32px;">
        Na verlenging kun je je nieuwe verloopdatum bijwerken in je
        <a href="https://caredin.nl/dashboard/zzper/profiel" style="color:#5DB8A4;">CaredIn profiel</a>.
        Heb je vragen? Neem contact op via support@caredin.nl.
      </p>
    </div>
  `;
}
