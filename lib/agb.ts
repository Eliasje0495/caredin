// lib/agb.ts — Vektis AGB Raadpleegdienst
// Public REST API: https://api.vektis.nl/public/agb-register/v1/

const AGB_BASE = "https://api.vektis.nl/public/agb-register/v1";

export interface AgbResult {
  valid: boolean;
  naam?: string;
  specialisme?: string;
  agbCode?: string;
  error?: string;
}

export async function verifyAgbCode(agbCode: string): Promise<AgbResult> {
  const cleaned = agbCode.replace(/[-\s]/g, "");
  if (cleaned.length < 8) return { valid: false, error: "Ongeldig AGB-code formaat" };

  try {
    const res = await fetch(`${AGB_BASE}/zorgverleners/${cleaned}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (res.status === 404) return { valid: false, error: "AGB-code niet gevonden" };
    if (!res.ok) return { valid: false, error: `API fout (${res.status})` };

    const data = await res.json();
    return {
      valid: true,
      naam: data.naam ?? data.name,
      specialisme: data.specialisme ?? data.weergavenaam,
      agbCode: cleaned,
    };
  } catch {
    return { valid: false, error: "Verbinding met Vektis mislukt" };
  }
}
