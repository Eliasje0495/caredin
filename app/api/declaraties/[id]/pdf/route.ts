export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const userId = (session.user as any).id;

  const dec = await prisma.declaratie.findUnique({
    where: { id: params.id },
    include: {
      regels: { orderBy: { datum: "asc" } },
      user:   { select: { name: true, email: true, phone: true } },
      employer: { select: { companyName: true, address: true, city: true } },
    },
  });

  if (!dec || dec.userId !== userId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const rows = dec.regels.map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${new Date(r.datum).toLocaleDateString("nl-NL")}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${r.omschrijving}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${Number(r.uren).toFixed(2)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">€${Number(r.tarief).toFixed(2)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">€${Number(r.bedrag).toFixed(2)}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8"/>
  <title>Declaratie ${dec.nummer}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; font-size:13px; color:#111; padding:48px; background:#fff; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
    .logo { font-size:22px; font-weight:900; color:#1A7A6A; }
    .logo span { color:#111; }
    h1 { font-size:28px; font-weight:800; color:#111; margin-bottom:4px; }
    .meta { color:#555; font-size:12px; }
    .section { margin-bottom:24px; }
    .label { font-size:11px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:#888; margin-bottom:6px; }
    table { width:100%; border-collapse:collapse; margin-top:8px; }
    thead tr { background:#f9fafb; }
    th { padding:10px 12px; text-align:left; font-size:11px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:#888; border-bottom:2px solid #e5e7eb; }
    th:last-child, td:last-child { text-align:right; }
    .total-row td { padding:12px; font-weight:700; font-size:15px; border-top:2px solid #111; }
    .status { display:inline-block; padding:3px 12px; border-radius:999px; font-size:12px; font-weight:700; background:#D1FAE5; color:#065F46; }
    .footer { margin-top:48px; padding-top:16px; border-top:1px solid #e5e7eb; font-size:11px; color:#888; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Care<span>din</span></div>
      <p style="color:#888;font-size:11px;margin-top:2px">caredin.nl</p>
    </div>
    <div style="text-align:right">
      <h1>${dec.nummer}</h1>
      <p class="meta">Ingediend: ${dec.ingediendAt ? new Date(dec.ingediendAt).toLocaleDateString("nl-NL") : "—"}</p>
      <div class="status" style="margin-top:6px">${dec.status}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px">
    <div class="section">
      <div class="label">Van</div>
      <div style="font-weight:700">${dec.user.name ?? "—"}</div>
      <div style="color:#555">${dec.user.email}</div>
      ${dec.user.phone ? `<div style="color:#555">${dec.user.phone}</div>` : ""}
    </div>
    <div class="section">
      <div class="label">Aan</div>
      <div style="font-weight:700">${dec.employer.companyName}</div>
      ${dec.employer.address ? `<div style="color:#555">${dec.employer.address}</div>` : ""}
      ${dec.employer.city ? `<div style="color:#555">${dec.employer.city}</div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="label">Periode</div>
    <div>${new Date(dec.periodeStart).toLocaleDateString("nl-NL")} – ${new Date(dec.periodeEinde).toLocaleDateString("nl-NL")}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Datum</th>
        <th>Omschrijving</th>
        <th style="text-align:right">Uren</th>
        <th style="text-align:right">Tarief</th>
        <th style="text-align:right">Bedrag</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4">Totaal</td>
        <td>€${Number(dec.totaalBedrag).toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>

  ${dec.notitie ? `<div class="section" style="margin-top:24px"><div class="label">Notitie</div><p style="color:#555">${dec.notitie}</p></div>` : ""}

  <div class="footer">Gegenereerd door Caredin.nl · ${new Date().toLocaleDateString("nl-NL")}</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${dec.nummer}.html"`,
    },
  });
}
