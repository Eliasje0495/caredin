import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://register.skjeugd.nl";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

interface SKJResult {
  registration_number: number;
  full_name: string;
  company_city: string | null;
  job_title: string | null;
  first_registration_date: string | null;
  status: string; // "registered" | "unsubscribed"
  register: string | null;
  level: string | null;
  registration_from_date: string | null;
  registration_till_date: string | null;
  unsubscribe_date: string | null;
}

async function loadPage(): Promise<{
  snapshotStr: string;
  cookieHeader: string;
  xsrf: string;
} | null> {
  const res = await fetch(BASE, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html",
      "Accept-Language": "nl-NL",
    },
  });
  if (!res.ok) return null;

  const html = await res.text();

  // Parse cookies
  const rawCookies = (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.()
    ?? [res.headers.get("set-cookie") ?? ""];
  const cookieMap: Record<string, string> = {};
  for (const c of rawCookies) {
    const [pair] = c.split(";");
    const [k, v] = pair.split("=");
    if (k && v) cookieMap[k.trim()] = v.trim();
  }
  const cookieHeader = Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join("; ");
  const xsrf = decodeURIComponent(cookieMap["XSRF-TOKEN"] ?? "");

  // Extract wire:snapshot (keep as raw string — Livewire v3 requires string)
  const snapshotMatch = html.match(/wire:snapshot="([^"]+)"/);
  if (!snapshotMatch) return null;

  const snapshotStr = snapshotMatch[1]
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");

  return { snapshotStr, cookieHeader, xsrf };
}

async function searchSKJ(
  keyword: string,
  ctx: { snapshotStr: string; cookieHeader: string; xsrf: string }
): Promise<SKJResult[]> {
  const payload = {
    components: [{
      snapshot: ctx.snapshotStr,   // must be string, not parsed object
      updates: { keyword },
      calls: [{ path: "", method: "search", params: [] }],
    }],
  };

  const res = await fetch(`${BASE}/livewire/update`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/json",
      "Accept": "text/html, application/xhtml+xml",
      "X-Livewire": "true",
      "X-XSRF-TOKEN": ctx.xsrf,
      "Cookie": ctx.cookieHeader,
      "Referer": BASE,
      "Origin": BASE,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return [];

  const data = await res.json().catch(() => null);

  // Results are in the returned snapshot's data.rawResults
  const newSnapshot = data?.components?.[0]?.snapshot;
  if (!newSnapshot) return [];

  const snap = typeof newSnapshot === "string" ? JSON.parse(newSnapshot) : newSnapshot;
  const rawResults = snap?.data?.rawResults;

  if (!rawResults) return [];

  // rawResults structure (Livewire-serialized LengthAwarePaginator):
  // rawResults = [{data: [[[item, {s:"arr"}], ...], {s:"arr"}], ...}, {s:"arr"}]
  // rawResults[0].data[0] = array of [item_object, {s:"arr"}] tuples
  const paginatorData = rawResults[0]?.data;
  const itemTuples: unknown[] = Array.isArray(paginatorData?.[0]) ? paginatorData[0] : [];
  const results: SKJResult[] = [];

  for (const itemTuple of itemTuples) {
    const item = Array.isArray(itemTuple) ? itemTuple[0] : itemTuple;
    if (item && typeof item === "object" && "registration_number" in item) {
      results.push(item as SKJResult);
    }
  }

  return results;
}

export async function GET(req: NextRequest) {
  const nummer = req.nextUrl.searchParams.get("nummer")?.trim();
  if (!nummer) {
    return NextResponse.json({ error: "nummer parameter verplicht" }, { status: 400 });
  }

  try {
    const ctx = await loadPage();
    if (!ctx) {
      return NextResponse.json({ error: "Kon SKJ register niet laden", gevonden: false }, { status: 502 });
    }

    const results = await searchSKJ(nummer, ctx);

    if (results.length === 0) {
      return NextResponse.json({ nummer, gevonden: false });
    }

    // If nummer is purely numeric, try exact match on registration_number
    const numericNummer = parseInt(nummer, 10);
    let match = isNaN(numericNummer)
      ? null
      : results.find(r => r.registration_number === numericNummer);

    // Fallback: first result
    if (!match) match = results[0];

    return NextResponse.json({
      nummer,
      gevonden: true,
      registratienummer: match.registration_number,
      naam: match.full_name,
      status: match.status, // "registered" | "unsubscribed"
      geregistreerd: match.status === "registered",
      register: match.register,
      niveau: match.level,
      functie: match.job_title,
      stad: match.company_city,
      registratieDatum: match.first_registration_date,
      geldigTot: match.registration_till_date,
      uitschrijfDatum: match.unsubscribe_date,
      aantalResultaten: results.length,
    });

  } catch (e) {
    console.error("SKJ scraper error:", e);
    return NextResponse.json({ error: "Scraper fout", gevonden: false }, { status: 500 });
  }
}
