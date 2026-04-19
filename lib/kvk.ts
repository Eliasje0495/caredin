// lib/kvk.ts — KvK API verificatie (developers.kvk.nl)
// Vereist KVK_API_KEY in env vars

const KVK_API_BASE = "https://api.kvk.nl/api/v1";

export interface KvkResult {
  valid:        boolean;
  companyName?: string;
  legalForm?:   string;    // bijv. "Eenmanszaak", "BV"
  address?:     string;
  isActive?:    boolean;
  error?:       string;
}

export async function verifyKvkNumber(kvkNumber: string): Promise<KvkResult> {
  const cleaned = kvkNumber.replace(/\s/g, "").trim();

  if (!/^\d{8}$/.test(cleaned)) {
    return { valid: false, error: "KvK-nummer moet 8 cijfers bevatten" };
  }

  const apiKey = process.env.KVK_API_KEY;
  if (!apiKey) {
    console.warn("[KvK] KVK_API_KEY niet geconfigureerd");
    return { valid: true, companyName: "Verificatie tijdelijk niet beschikbaar" };
  }

  try {
    const res = await fetch(`${KVK_API_BASE}/basisprofielen/${cleaned}`, {
      headers: {
        "apikey": apiKey,
        "Accept": "application/json",
      },
    });

    if (res.status === 404) {
      return { valid: false, error: "KvK-nummer niet gevonden" };
    }

    if (!res.ok) {
      throw new Error(`KvK API fout: ${res.status}`);
    }

    const data = await res.json();

    const name    = data.naam ?? data.entityName;
    const address = data.adressen?.[0];
    const adresStr = address
      ? `${address.straatnaam ?? ""} ${address.huisnummer ?? ""}, ${address.postcode ?? ""} ${address.plaats ?? ""}`.trim()
      : undefined;

    return {
      valid:       true,
      companyName: name,
      legalForm:   data.rechtsvorm,
      address:     adresStr,
      isActive:    data.indActiefRegistratie === "Ja" || data.isActive !== false,
    };
  } catch (err) {
    console.error("[KvK verify]", err);
    return { valid: false, error: "KvK-register tijdelijk niet beschikbaar" };
  }
}
