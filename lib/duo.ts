// lib/duo.ts — DUO Diplomaregister verificatie
// Documentatie: https://www.duo.nl/zakelijk/aan-de-slag-met-duo-diensten/
// API-key aanvragen: https://www.duo.nl/zakelijk/contact/

const DUO_API_BASE = process.env.DUO_API_BASE ?? "https://api.diplomaregister.duo.nl/v1";
const DUO_API_KEY  = process.env.DUO_API_KEY  ?? "";

export interface DuoResult {
  valid:        boolean;
  name?:        string;
  opleiding?:   string;  // bijv. "Verpleegkunde niveau 4"
  niveau?:      string;  // bijv. "MBO niveau 4"
  instelling?:  string;  // bijv. "ROC Mondriaan"
  behaaldOp?:   string;  // datum
  error?:       string;
}

export async function verifyDiplomaNummer(diplomaNummer: string): Promise<DuoResult> {
  const cleaned = diplomaNummer.replace(/\s/g, "").trim();

  if (cleaned.length < 6) {
    return { valid: false, error: "Ongeldig diplomanummer" };
  }

  if (!DUO_API_KEY) {
    return { valid: false, error: "DUO API-key niet geconfigureerd" };
  }

  try {
    const res = await fetch(`${DUO_API_BASE}/diploma/${encodeURIComponent(cleaned)}`, {
      headers: {
        "Accept":        "application/json",
        "Authorization": `Bearer ${DUO_API_KEY}`,
        "X-Api-Key":     DUO_API_KEY,
      },
      next: { revalidate: 3600 }, // cache 1 uur
    });

    if (res.status === 404) {
      return { valid: false, error: "Diplomanummer niet gevonden in het register" };
    }

    if (res.status === 401) {
      return { valid: false, error: "DUO API-authenticatie mislukt — controleer de API-key" };
    }

    if (!res.ok) {
      throw new Error(`DUO API fout: ${res.status}`);
    }

    const data = await res.json();

    // DUO API response mapping (aanpassen aan echte response-structuur na ontvangst docs)
    const diploma = data?.diploma ?? data;

    return {
      valid:       true,
      name:        [diploma.voornaam, diploma.achternaam].filter(Boolean).join(" ") || diploma.naam,
      opleiding:   diploma.opleidingNaam ?? diploma.opleiding ?? diploma.qualification,
      niveau:      diploma.niveau ?? diploma.level,
      instelling:  diploma.instellingNaam ?? diploma.instelling ?? diploma.institution,
      behaaldOp:   diploma.datumBehaald ?? diploma.dateObtained,
    };
  } catch (err) {
    console.error("[DUO verify]", err);
    return { valid: false, error: "DUO Diplomaregister tijdelijk niet beschikbaar — probeer later opnieuw" };
  }
}
