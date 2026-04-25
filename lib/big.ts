// lib/big.ts — BIG-register verificatie via SOAP API (api.bigregister.nl)
// Endpoint gewijzigd april 2023: https://www.bigregister.nl/actueel/nieuws/2023/04/26/wijziging-endpoint-webservice
// WSDL: https://api.bigregister.nl/zksrv/soap/4?wsdl
// Operatie: ListHcpApprox4

const BIG_SOAP_URL    = "https://api.bigregister.nl/zksrv/soap/4";
const BIG_SOAP_ACTION = "http://services.cibg.nl/ExternalUser/ListHcpApprox4";
const BIG_NS          = "http://services.cibg.nl/ExternalUser";

export interface BigResult {
  valid:       boolean;
  name?:       string;
  profession?: string;  // bijv. "Verpleegkundige"
  status?:     string;  // "Ingeschreven", "Doorgehaald" etc.
  registrationEnd?: string;
  error?:      string;
}

// Professionele groep codes → leesbare naam
const PROF_GROUP: Record<string, string> = {
  "01": "Arts",
  "02": "Tandarts",
  "03": "Apotheker",
  "04": "Gezondheidspsycholoog",
  "05": "Psychotherapeut",
  "06": "Fysiotherapeut",
  "07": "Verloskundige",
  "08": "Verpleegkundige",
  "09": "Physician assistant",
  "10": "Orthopedagoog-generalist",
  "25": "Verpleegkundig specialist",
};

export async function verifyBigNumber(bigNumber: string): Promise<BigResult> {
  const cleaned = bigNumber.replace(/\s/g, "").trim();

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: "BIG-nummer moet 11 cijfers bevatten" };
  }

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${BIG_NS}">
  <soap:Body>
    <tns:listHcpApproxRequest>
      <tns:WebSite>None</tns:WebSite>
      <tns:RegistrationNumber>${cleaned}</tns:RegistrationNumber>
    </tns:listHcpApproxRequest>
  </soap:Body>
</soap:Envelope>`;

  try {
    const res = await fetch(BIG_SOAP_URL, {
      method:  "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction":   BIG_SOAP_ACTION,
      },
      body:   soapBody,
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      throw new Error(`BIG SOAP fout: HTTP ${res.status}`);
    }

    const xml = await res.text();

    // Parse naam
    const mailingName = xml.match(/<(?:[^:]+:)?MailingName>([^<]*)<\/(?:[^:]+:)?MailingName>/)?.[1]?.trim() ?? "";
    const initial     = xml.match(/<(?:[^:]+:)?Initial>([^<]*)<\/(?:[^:]+:)?Initial>/)?.[1]?.trim() ?? "";
    const prefix      = xml.match(/<(?:[^:]+:)?Prefix>([^<]*)<\/(?:[^:]+:)?Prefix>/)?.[1]?.trim() ?? "";
    const name        = [initial, prefix, mailingName].filter(Boolean).join(" ") || undefined;

    // Registraties uitlezen
    const regMatches = Array.from(xml.matchAll(/<(?:[^:]+:)?ArticleRegistrationExtApp[^>]*>([\s\S]*?)<\/(?:[^:]+:)?ArticleRegistrationExtApp>/g));

    if (regMatches.length === 0) {
      return { valid: false, name, error: "BIG-nummer niet gevonden in het register" };
    }

    // Zoek actieve registratie (endDate in de toekomst)
    const now = new Date();
    let activeReg: { profCode: string; endDate: string } | null = null;

    for (const match of regMatches) {
      const block    = match[1];
      const endStr   = block.match(/<(?:[^:]+:)?ArticleRegistrationEndDate>([^<]*)<\/(?:[^:]+:)?ArticleRegistrationEndDate>/)?.[1] ?? "";
      const profCode = block.match(/<(?:[^:]+:)?ProfessionalGroupCode>([^<]*)<\/(?:[^:]+:)?ProfessionalGroupCode>/)?.[1]?.trim() ?? "";
      const endDate  = new Date(endStr);
      if (!endStr || endDate > now) {
        activeReg = { profCode, endDate: endStr ? endDate.toISOString().split("T")[0] : "" };
        break;
      }
    }

    if (!activeReg) {
      const lastBlock  = regMatches[regMatches.length - 1][1];
      const profCode   = lastBlock.match(/<(?:[^:]+:)?ProfessionalGroupCode>([^<]*)<\/(?:[^:]+:)?ProfessionalGroupCode>/)?.[1]?.trim() ?? "";
      const endStr     = lastBlock.match(/<(?:[^:]+:)?ArticleRegistrationEndDate>([^<]*)<\/(?:[^:]+:)?ArticleRegistrationEndDate>/)?.[1] ?? "";
      return {
        valid:      false,
        name,
        profession: PROF_GROUP[profCode] ?? profCode,
        status:     "Doorgehaald of verlopen",
        registrationEnd: endStr ? new Date(endStr).toISOString().split("T")[0] : undefined,
        error:      "BIG-registratie is niet meer actief",
      };
    }

    return {
      valid:      true,
      name,
      profession: PROF_GROUP[activeReg.profCode] ?? activeReg.profCode,
      status:     "Ingeschreven",
      registrationEnd: activeReg.endDate || undefined,
    };
  } catch (err) {
    console.error("[BIG verify]", err);
    return { valid: false, error: "BIG-register tijdelijk niet beschikbaar — probeer later opnieuw" };
  }
}
