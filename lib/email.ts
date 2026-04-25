import { Resend } from "resend";

const FROM = "CaredIn <noreply@caredin.nl>";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: FROM, to, subject, html });
}

function emailTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F5F7F6;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2EAE8;">
        <!-- Header -->
        <tr><td style="background:#0F1C1A;padding:28px 40px;">
          <span style="font-size:22px;font-weight:700;color:#1A7A6A;">Care</span><span style="font-size:22px;font-weight:700;color:#fff;">din</span>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F5F7F6;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#7A9994;">CaredIn · caredin.nl · Dit is een automatisch bericht</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const emails = {
  applicationReceived: (to: string, workerName: string, shiftTitle: string) =>
    sendEmail(
      to,
      `Nieuwe aanmelding: ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Nieuwe aanmelding ontvangen</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Goed nieuws! <strong style="color:#0F1C1A;">${workerName}</strong> heeft zich aangemeld voor je dienst
          <strong style="color:#0F1C1A;">${shiftTitle}</strong>.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Bekijk het profiel en beslis of je de aanmelding wilt accepteren of afwijzen.
        </p>
        <a href="https://caredin.nl/dashboard/organisatie/diensten"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk aanmeldingen →
        </a>
      `)
    ),

  applicationAccepted: (to: string, shiftTitle: string, date: string) =>
    sendEmail(
      to,
      `Je aanmelding is geaccepteerd: ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Je aanmelding is geaccepteerd!</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Gefeliciteerd! Je aanmelding voor <strong style="color:#0F1C1A;">${shiftTitle}</strong> op
          <strong style="color:#0F1C1A;">${date}</strong> is goedgekeurd.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Vergeet niet om op tijd in te checken op de locatie. Veel succes met je dienst!
        </p>
        <a href="https://caredin.nl/dashboard/zzper/timesheets"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk je diensten →
        </a>
      `)
    ),

  applicationRejected: (to: string, shiftTitle: string) =>
    sendEmail(
      to,
      `Aanmelding niet doorgegaan: ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Aanmelding niet doorgegaan</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Helaas is je aanmelding voor <strong style="color:#0F1C1A;">${shiftTitle}</strong> niet doorgegaan.
          De organisatie heeft een andere kandidaat gekozen.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Er staan genoeg andere diensten voor je klaar — bekijk het aanbod en meld je aan!
        </p>
        <a href="https://caredin.nl/vacatures"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk andere diensten →
        </a>
      `)
    ),

  checkoutApproved: (to: string, shiftTitle: string, amount: string) =>
    sendEmail(
      to,
      `Uren goedgekeurd: ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Je uren zijn goedgekeurd</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Je uren voor <strong style="color:#0F1C1A;">${shiftTitle}</strong> zijn goedgekeurd door de opdrachtgever.
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#374846;">
          Uitbetaling van:
        </p>
        <p style="margin:0 0 24px;font-size:28px;font-weight:700;color:#1A7A6A;">€${amount}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Dit bedrag wordt binnen 48 uur overgemaakt naar je rekening.
        </p>
        <a href="https://caredin.nl/dashboard/zzper/timesheets"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk je timesheets →
        </a>
      `)
    ),

  checkoutReminder: (to: string, shiftTitle: string, daysLeft: number) =>
    sendEmail(
      to,
      `Herinnering: checkout goedkeuren voor ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Actie vereist: checkout goedkeuren</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Je hebt nog <strong style="color:#1A7A6A;">${daysLeft} dag${daysLeft !== 1 ? "en" : ""}</strong> om de checkout
          voor <strong style="color:#0F1C1A;">${shiftTitle}</strong> goed te keuren.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Daarna worden de uren automatisch goedgekeurd en wordt de uitbetaling verwerkt.
        </p>
        <a href="https://caredin.nl/dashboard/organisatie/checkouts"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Checkouts goedkeuren →
        </a>
      `)
    ),

  overeenkomstWorker: (to: string, name: string, shiftTitle: string, pdfUrl: string) =>
    sendEmail(
      to,
      `Modelovereenkomst voor ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Je aanmelding is ontvangen</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Hoi ${name.split(" ")[0]}, je aanmelding voor <strong style="color:#0F1C1A;">${shiftTitle}</strong> is ontvangen.
          Hieronder vind je de modelovereenkomst voor deze opdracht.
        </p>
        <div style="background:#F0F7F5;border-radius:12px;padding:20px;margin:0 0 24px;">
          <div style="font-size:13px;font-weight:700;color:#0F1C1A;margin-bottom:4px;">📄 Modelovereenkomst van Opdracht</div>
          <div style="font-size:12px;color:#5A7472;">Op basis van Belastingdienst modelovereenkomst nr. 9015550000-09-2</div>
        </div>
        <a href="${pdfUrl}"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Overeenkomst bekijken & downloaden →
        </a>
        <p style="margin:20px 0 0;font-size:12px;color:#7A9994;">
          De overeenkomst is ook te vinden in je dashboard. Vragen? Mail naar <a href="mailto:support@caredin.nl" style="color:#1A7A6A;">support@caredin.nl</a>
        </p>
      `)
    ),

  declaratieIngediend: (to: string, companyName: string, workerName: string, nummer: string, bedrag: string) =>
    sendEmail(
      to,
      `Declaratie ${nummer} ingediend door ${workerName}`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Nieuwe declaratie ontvangen</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          <strong style="color:#0F1C1A;">${workerName}</strong> heeft declaratie
          <strong style="color:#0F1C1A;">${nummer}</strong> ingediend voor een bedrag van
          <strong style="color:#1A7A6A;">€${bedrag}</strong>.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Bekijk de declaratie in je dashboard en keur deze goed of wijs hem af.
        </p>
        <a href="https://caredin.nl/dashboard/organisatie/declaraties"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Declaraties bekijken →
        </a>
      `)
    ),

  declaratieGoedgekeurd: (to: string, workerName: string, nummer: string, bedrag: string) =>
    sendEmail(
      to,
      `Declaratie ${nummer} goedgekeurd`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Je declaratie is goedgekeurd ✅</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Hoi ${workerName.split(" ")[0]}, declaratie <strong style="color:#0F1C1A;">${nummer}</strong> is goedgekeurd
          voor een bedrag van <strong style="color:#1A7A6A;">€${bedrag}</strong>.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          De opdrachtgever verwerkt de betaling zo spoedig mogelijk.
        </p>
        <a href="https://caredin.nl/dashboard/zzper/declaraties"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk je declaraties →
        </a>
      `)
    ),

  declaratieAfgewezen: (to: string, workerName: string, nummer: string, reden: string) =>
    sendEmail(
      to,
      `Declaratie ${nummer} afgewezen`,
      emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:22px;color:#0F1C1A;">Declaratie niet goedgekeurd</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Hoi ${workerName.split(" ")[0]}, declaratie <strong style="color:#0F1C1A;">${nummer}</strong> is helaas afgewezen.
        </p>
        <div style="background:#FEF2F2;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
          <div style="font-size:12px;font-weight:700;color:#991B1B;margin-bottom:4px;">Reden</div>
          <div style="font-size:14px;color:#374846;">${reden}</div>
        </div>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Je kunt de declaratie herroepen, aanpassen en opnieuw indienen.
        </p>
        <a href="https://caredin.nl/dashboard/zzper/declaraties"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Naar mijn declaraties →
        </a>
      `)
    ),

  shiftReminder: (
    to: string,
    workerName: string,
    shiftTitle: string,
    companyName: string,
    dateStr: string,
    timeStr: string,
    address: string,
    hourlyRate: string,
  ) =>
    sendEmail(
      to,
      `⏰ Morgen: ${shiftTitle} bij ${companyName}`,
      emailTemplate(`
        <h2 style="margin:0 0 8px;font-size:22px;color:#0F1C1A;">Herinnering: morgen heb je een dienst</h2>
        <p style="margin:0 0 20px;font-size:13px;color:#7A9994;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
          ${shiftTitle} · ${companyName}
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Hoi ${workerName.split(" ")[0]}, vergeet je dienst van morgen niet!
        </p>
        <div style="background:#F0F7F5;border-radius:12px;padding:20px;margin:0 0 24px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:6px 0;">
                <span style="font-size:13px;font-weight:700;color:#0F1C1A;">📅 Datum &amp; tijd</span>
              </td>
              <td style="padding:6px 0;text-align:right;">
                <span style="font-size:13px;color:#374846;">${dateStr} · ${timeStr}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;">
                <span style="font-size:13px;font-weight:700;color:#0F1C1A;">📍 Locatie</span>
              </td>
              <td style="padding:6px 0;text-align:right;">
                <span style="font-size:13px;color:#374846;">${address}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;">
                <span style="font-size:13px;font-weight:700;color:#0F1C1A;">💶 Tarief</span>
              </td>
              <td style="padding:6px 0;text-align:right;">
                <span style="font-size:13px;color:#374846;">€${hourlyRate}/uur</span>
              </td>
            </tr>
          </table>
        </div>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374846;">
          Zorg dat je op tijd bent en vergeet je urenregistratie niet na afloop.
        </p>
        <a href="https://caredin.nl/dashboard/zzper/timesheets"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px;">
          Bekijk je timesheets →
        </a>
      `)
    ),

  identityCheck: (to: string, name: string, shiftTitle: string, startTime: string, verifyUrl: string) =>
    sendEmail(
      to,
      `⏱ Actie vereist: identiteitscheck voor ${shiftTitle}`,
      emailTemplate(`
        <h2 style="margin:0 0 8px;font-size:22px;color:#0F1C1A;">Je dienst begint over 10 minuten</h2>
        <p style="margin:0 0 20px;font-size:13px;color:#7A9994;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
          ${shiftTitle} · ${startTime}
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374846;">
          Hoi ${name.split(" ")[0]}, voordat je begint moet je een snelle biometrische check doen.
          Dit duurt minder dan <strong style="color:#0F1C1A;">60 seconden</strong> en bevestigt je identiteit voor de instelling.
        </p>
        <div style="background:#F5F7F6;border-radius:12px;padding:20px;margin:0 0 24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span style="font-size:20px;">📷</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#0F1C1A;">Selfie + ID-scan</div>
              <div style="font-size:12px;color:#7A9994;">Via Stripe Identity — veilig en versleuteld</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:20px;">🔒</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#0F1C1A;">Privacy gegarandeerd</div>
              <div style="font-size:12px;color:#7A9994;">Gegevens worden niet opgeslagen bij de instelling</div>
            </div>
          </div>
        </div>
        <a href="${verifyUrl}"
           style="display:inline-block;background:#1A7A6A;color:#fff;padding:16px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:15px;">
          Identiteit bevestigen →
        </a>
        <p style="margin:20px 0 0;font-size:12px;color:#7A9994;">
          Deze link is eenmalig en verloopt na de dienst. Problemen? Mail naar <a href="mailto:support@caredin.nl" style="color:#1A7A6A;">support@caredin.nl</a>
        </p>
      `)
    ),
};
