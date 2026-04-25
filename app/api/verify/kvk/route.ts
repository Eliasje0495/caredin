// app/api/verify/kvk/route.ts
// KvK scraper — publieke zoekpagina als fallback wanneer KVK_API_KEY niet beschikbaar is.
// Gebruikt cheerio (al in dependencies) om het handelsregister te parsen.

import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { verifyKvkNumber } from "@/lib/kvk";

export const dynamic = "force-dynamic";

const KVK_SEARCH = "https://www.kvk.nl/zoeken/";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

interface KvkScrapeResult {
  gevonden:     boolean;
  kvkNummer?:   string;
  naam?:        string;
  rechtsvorm?:  string;
  adres?:       string;
  stad?:        string;
  postcode?:    string;
  actief?:      boolean;
  error?:       string;
}

async function scrapeKvk(kvkNumber: string): Promise<KvkScrapeResult> {
  const url = `${KVK_SEARCH}?q=${encodeURIComponent(kvkNumber)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":       UA,
      "Accept":           "text/html,application/xhtml+xml",
      "Accept-Language":  "nl-NL,nl;q=0.9",
      "Referer":          "https://www.kvk.nl/",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return { gevonden: false, error: `KvK zoekpagina niet bereikbaar (${res.status})` };
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // KvK zoekresultaat-kaart
  // Selector werkt op de publieke kvk.nl/zoeken pagina (stand 2024/2025)
  const card = $("[data-kvk-number], .search-result__company, article.company-item").first();

  if (!card.length) {
    // Probeer alternatieve selectors
    const resultText = $("body").text();
    if (resultText.includes("geen resultaten") || resultText.includes("Geen bedrijven gevonden")) {
      return { gevonden: false };
    }
    // Geen kaart gevonden maar ook geen "geen resultaten" — onzeker
    return { gevonden: false, error: "Resultaat kon niet worden geparsed" };
  }

  const naam       = card.find("[data-company-name], .company-name, h2").first().text().trim()
                  || card.attr("data-company-name")
                  || "";
  const rechtsvorm = card.find("[data-legal-form], .legal-form").first().text().trim() || undefined;
  const kvkNum     = card.attr("data-kvk-number") || kvkNumber;

  // Adres parsing
  const adresEl    = card.find(".address, [data-address], .company-address").first();
  const volledigAdres = adresEl.text().replace(/\s+/g, " ").trim() || undefined;

  // Eenvoudige postcode-extractie (bijv. "1234 AB Amsterdam")
  const postcodeMatch = volledigAdres?.match(/(\d{4}\s?[A-Z]{2})/i);
  const postcode  = postcodeMatch ? postcodeMatch[1].replace(/\s/, " ").toUpperCase() : undefined;

  // Stad na postcode
  const stadMatch = volledigAdres?.match(/\d{4}\s?[A-Z]{2}\s+(.+)/i);
  const stad      = stadMatch ? stadMatch[1].trim() : undefined;

  return {
    gevonden:    !!naam,
    kvkNummer:   kvkNum,
    naam:        naam || undefined,
    rechtsvorm,
    adres:       volledigAdres,
    stad,
    postcode,
    actief:      true, // publieke pagina toont alleen actieve inschrijvingen standaard
  };
}

export async function GET(req: NextRequest) {
  const nummer = req.nextUrl.searchParams.get("nummer")?.replace(/\s/g, "").trim();
  if (!nummer) {
    return NextResponse.json({ error: "nummer parameter verplicht" }, { status: 400 });
  }

  if (!/^\d{8}$/.test(nummer)) {
    return NextResponse.json({ gevonden: false, error: "KvK-nummer moet precies 8 cijfers bevatten" }, { status: 400 });
  }

  // 1. Probeer eerst de officiële API als KVK_API_KEY beschikbaar is
  if (process.env.KVK_API_KEY) {
    const apiResult = await verifyKvkNumber(nummer);
    if (apiResult.valid) {
      return NextResponse.json({
        gevonden:    true,
        bron:        "api",
        kvkNummer:   nummer,
        naam:        apiResult.companyName,
        rechtsvorm:  apiResult.legalForm,
        adres:       apiResult.address,
        actief:      apiResult.isActive,
      });
    }
    if (apiResult.error?.includes("niet gevonden")) {
      return NextResponse.json({ gevonden: false, bron: "api" });
    }
    // API fout — val terug op scraper
  }

  // 2. Scraper fallback
  try {
    const result = await scrapeKvk(nummer);
    return NextResponse.json({ ...result, bron: "scraper" });
  } catch (e) {
    console.error("[KvK scraper]", e);
    return NextResponse.json(
      { gevonden: false, error: "KvK verificatie tijdelijk niet beschikbaar" },
      { status: 502 }
    );
  }
}
