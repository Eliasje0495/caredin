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
};
