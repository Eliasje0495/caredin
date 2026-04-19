// lib/big.ts — BIG-register verificatie (bigregister.nl)
// Documentatie: https://www.bigregister.nl/zoekbig/static/resources/ZoekBIGRestfulWebserviceClient.pdf

const BIG_API_BASE = "https://zoekbigregistraties.zorgcsp.nl/api/v1";

export interface BigResult {
  valid:       boolean;
  name?:       string;
  profession?: string;  // bijv. "Verpleegkundige"
  status?:     string;  // "Ingeschreven", "Doorgehaald" etc.
  registrationEnd?: string;
  error?:      string;
}

export async function verifyBigNumber(bigNumber: string): Promise<BigResult> {
  const cleaned = bigNumber.replace(/\s/g, "").trim();

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: "BIG-nummer moet 11 cijfers bevatten" };
  }

  try {
    const res = await fetch(`${BIG_API_BASE}/registrations/${cleaned}`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // cache 1 uur
    });

    if (res.status === 404) {
      return { valid: false, error: "BIG-nummer niet gevonden in het register" };
    }

    if (!res.ok) {
      throw new Error(`BIG API fout: ${res.status}`);
    }

    const data = await res.json();

    // BIG API geeft een array van registraties terug
    const registrations: any[] = data?.registrations ?? [data];
    const active = registrations.find((r: any) =>
      r.status?.toLowerCase().includes("ingeschreven") ||
      r.statusDescription?.toLowerCase().includes("registered")
    );

    if (!active && registrations.length === 0) {
      return { valid: false, error: "Geen actieve BIG-registratie gevonden" };
    }

    const reg = active ?? registrations[0];

    return {
      valid:       !!active,
      name:        [reg.firstName, reg.lastName].filter(Boolean).join(" ") || reg.fullName,
      profession:  reg.professionDescription ?? reg.profession,
      status:      reg.statusDescription ?? reg.status,
      registrationEnd: reg.registrationEnd,
      error:       active ? undefined : "BIG-registratie is niet actief (doorgehaald of verlopen)",
    };
  } catch (err) {
    console.error("[BIG verify]", err);
    return { valid: false, error: "BIG-register tijdelijk niet beschikbaar — probeer later opnieuw" };
  }
}
