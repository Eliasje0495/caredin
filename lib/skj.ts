// lib/skj.ts — SKJ-register verificatie (register.skjeugd.nl via Livewire scraping)

const BASE = "https://register.skjeugd.nl";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export interface SkjResult {
  valid: boolean;
  naam?: string;
  status?: string;
  register?: string;
  niveau?: string;
  functie?: string;
  stad?: string;
  geldigTot?: string | null;
  error?: string;
}

async function loadPage(): Promise<{ snapshotStr: string; cookieHeader: string; xsrf: string } | null> {
  const res = await fetch(BASE, {
    headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "nl-NL" },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const rawCookies = (res.headers as any).getSetCookie?.() ?? [res.headers.get("set-cookie") ?? ""];
  const cookieMap: Record<string, string> = {};
  for (const c of rawCookies) {
    const [pair] = c.split(";");
    const [k, v] = pair.split("=");
    if (k && v) cookieMap[k.trim()] = v.trim();
  }
  const cookieHeader = Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join("; ");
  const xsrf = decodeURIComponent(cookieMap["XSRF-TOKEN"] ?? "");

  const snapshotMatch = html.match(/wire:snapshot="([^"]+)"/);
  if (!snapshotMatch) return null;
  const snapshotStr = snapshotMatch[1]
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");

  return { snapshotStr, cookieHeader, xsrf };
}

async function searchSKJ(keyword: string, ctx: { snapshotStr: string; cookieHeader: string; xsrf: string }) {
  const payload = {
    components: [{
      snapshot: ctx.snapshotStr,
      updates: { keyword },
      calls: [{ path: "", method: "search", params: [] }],
    }],
  };
  const res = await fetch(`${BASE}/livewire/update`, {
    method: "POST",
    headers: {
      "User-Agent": UA, "Content-Type": "application/json",
      "Accept": "text/html, application/xhtml+xml", "X-Livewire": "true",
      "X-XSRF-TOKEN": ctx.xsrf, "Cookie": ctx.cookieHeader,
      "Referer": BASE, "Origin": BASE,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return [];

  const data = await res.json().catch(() => null);
  const newSnapshot = data?.components?.[0]?.snapshot;
  if (!newSnapshot) return [];
  const snap = typeof newSnapshot === "string" ? JSON.parse(newSnapshot) : newSnapshot;
  const rawResults = snap?.data?.rawResults;
  if (!rawResults) return [];

  const paginatorData = rawResults[0]?.data;
  const itemTuples: unknown[] = Array.isArray(paginatorData?.[0]) ? paginatorData[0] : [];
  return itemTuples.map((t) => (Array.isArray(t) ? t[0] : t)).filter((i) => i && typeof i === "object" && "registration_number" in i);
}

export async function verifySkjNumber(nummer: string): Promise<SkjResult> {
  try {
    const ctx = await loadPage();
    if (!ctx) return { valid: false, error: "SKJ register niet bereikbaar" };

    const results = await searchSKJ(nummer, ctx);
    if (results.length === 0) return { valid: false, error: "SKJ-nummer niet gevonden" };

    const numericNummer = parseInt(nummer, 10);
    const match: any = (!isNaN(numericNummer)
      ? results.find((r: any) => r.registration_number === numericNummer)
      : null) ?? results[0];

    const geregistreerd = match.status === "registered";
    return {
      valid: geregistreerd,
      naam: match.full_name,
      status: match.status,
      register: match.register,
      niveau: match.level,
      functie: match.job_title,
      stad: match.company_city,
      geldigTot: match.registration_till_date,
      error: geregistreerd ? undefined : "SKJ-registratie is niet actief",
    };
  } catch (e) {
    console.error("[SKJ verify]", e);
    return { valid: false, error: "SKJ-register tijdelijk niet beschikbaar" };
  }
}
