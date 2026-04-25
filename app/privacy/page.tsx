import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid | CaredIn",
  description: "Hoe CaredIn omgaat met de persoonsgegevens van zorgprofessionals en zorginstellingen — volledig conform de AVG.",
};

const ARTICLES = [
  {
    title: "1. Verwerkingsverantwoordelijke",
    body: `CaredIn is de handelsnaam van:

**Elias Lachhab**
KvK-nummer: 76695808
E-mail: info@caredin.nl
Website: https://caredin.nl

CaredIn is de verwerkingsverantwoordelijke in de zin van de Algemene Verordening Gegevensbescherming (AVG / GDPR) voor alle verwerkingen beschreven in dit privacybeleid.`,
  },
  {
    title: "2. Over CaredIn en de aard van de verwerking",
    body: `CaredIn is een digitaal platform dat zorgprofessionals (ZZP-ers en loondienst-professionals) koppelt aan zorginstellingen voor flexibele diensten. Vanwege de aard van dit platform verwerkt CaredIn bijzondere categorieën persoonsgegevens, waaronder:

- **Beroepsregistraties in de zorg** (BIG-nummer, SKJ-nummer, KABIZ-nummer, AGB-code) — dit zijn wettelijk vereiste registraties voor het uitoefenen van bepaalde beroepen in de zorg;
- **Identiteitsgegevens** ter verificatie van de identiteit van professionals;
- **Financiële gegevens** voor uitbetaling van diensten.

CaredIn verwerkt deze gegevens uitsluitend voor de in dit beleid beschreven doeleinden en op basis van geldige rechtsgrondslagen.`,
  },
  {
    title: "3. Welke persoonsgegevens verwerken wij?",
    body: `**A. Zorgprofessionals (werknemers/ZZP-ers)**

*Accountgegevens*
- E-mailadres, voor- en achternaam
- Wachtwoord (bcrypt-hash — nooit leesbaar opgeslagen)
- Geboortedatum
- Telefoonnummer
- Adres, postcode, woonplaats

*Professionele gegevens*
- BIG-registratienummer en verificatiestatus
- SKJ-registratienummer en verificatiestatus
- KABIZ-registratienummer en verificatiestatus
- AGB-code en verificatiestatus
- KvK-nummer (voor ZZP-ers) en verificatiestatus
- Contractvorm (ZZP of loondienst)
- Sector(en) en functie(s)
- Uurtarief
- Zoekradius en beschikbaarheid
- Biografie / profieltekst
- Profielfoto (optioneel)

*VOG (Verklaring Omtrent Gedrag)*
- Documentreferentie en verificatiestatus
- Datum van afgifte

*Identiteitsverificatie*
- Verificatieproces via Stripe Identity (identiteitsdocument — paspoort, rijbewijs, ID-kaart)
- Uitkomst van verificatie (geverifieerd / niet geverifieerd)
- Opgeslagen door Stripe onder eigen privacybeleid; CaredIn ontvangt alleen de verificatie-uitkomst

*Dienstgerelateerde gegevens*
- Aanmeldingen op diensten (datum, status, urenregistratie)
- Check-in en check-out tijden
- Uren gewerkt en uitbetaald bedrag per dienst
- Beoordelingen en gemiddelde score
- Totale verdiensten, uren en diensten (statistieken)

*Financiële gegevens*
- Stripe Connect account-ID voor uitbetaling
- Bankgegevens (via Stripe — niet rechtstreeks opgeslagen bij CaredIn)

**B. Zorginstellingen (opdrachtgevers)**

*Accountgegevens*
- E-mailadres en naam contactpersoon
- Bedrijfsnaam, adres, postcode, stad
- KvK-nummer en verificatiestatus
- Sector
- Website (optioneel)

*Dienstgegevens*
- Geplaatste diensten (datum, tijd, functie, tarief, locatie)
- Aanmeldingen en acceptaties per dienst
- Checkout-gegevens (goedgekeurde uren)

*Financiële gegevens*
- Stripe-klant-ID voor facturering
- Factuurgegevens

**C. Bezoekers van de website**
- Technische loggegevens (IP-adres, browser, bezochte pagina's — geanonimiseerd)
- Sessiecookies`,
  },
  {
    title: "4. Grondslagen voor verwerking",
    body: `Wij verwerken jouw persoonsgegevens uitsluitend op basis van een van de volgende rechtsgrondslagen:

**Uitvoering van een overeenkomst (art. 6 lid 1 sub b AVG)**
- Verwerking van accountgegevens, professionele gegevens en dienstgegevens voor de kernfunctionaliteit van het platform;
- Uitbetaling via Stripe Connect na afgeronde en goedgekeurde diensten;
- E-mailcommunicatie over aanmeldingen, acceptaties en uitbetalingen;
- Verificatie van BIG/SKJ/KvK en overige registraties als contractuele vereiste.

**Wettelijke verplichting (art. 6 lid 1 sub c AVG)**
- Verificatie van BIG-registraties conform de Wet BIG (Wet op de Beroepen in de Individuele Gezondheidszorg);
- Bewaring van financiële administratie conform de fiscale bewaarplicht (7 jaar);
- Melding bij autoriteiten indien wettelijk vereist.

**Gerechtvaardigd belang (art. 6 lid 1 sub f AVG)**
- Beveiliging van het platform;
- Voorkomen van misbruik en fraude;
- Kwaliteitsborging via beoordelingssysteem.

**Toestemming (art. 6 lid 1 sub a AVG)**
- Push-notificaties (alleen na uitdrukkelijke toestemming);
- Marketingcommunicatie.

**Zwaarwegende publieke taak / gerechtvaardigde verwerking van bijzondere gegevens (art. 9 lid 2 sub g en h AVG)**
- Verwerking van beroepsregistraties (BIG, SKJ) als noodzakelijk onderdeel van de veiligheidsverplichting in de zorgsector.`,
  },
  {
    title: "5. Doeleinden van verwerking",
    body: `CaredIn verwerkt persoonsgegevens voor de volgende doeleinden:

**Platformfunctionaliteit**
Het mogelijk maken van de koppeling tussen zorgprofessionals en zorginstellingen, inclusief het plaatsen en aannemen van diensten, aanmeldingen, acceptaties en beoordelingen.

**Verificatie van registraties**
Het verifiëren van BIG-, SKJ-, KvK-, KABIZ- en AGB-registraties als vereiste voor deelname aan bepaalde diensten. Dit dient de veiligheid van patiënten en cliënten.

**Identiteitsverificatie**
Het verifiëren van de identiteit van professionals via Stripe Identity om fraude te voorkomen en de betrouwbaarheid van het platform te waarborgen.

**VOG-verificatie**
Het controleren van de geldigheid van de Verklaring Omtrent Gedrag als vereiste in de zorgsector.

**Uitbetaling en facturering**
Het verwerken van uitbetalingen aan professionals en facturering aan zorginstellingen via Stripe.

**Communicatie**
Het verzenden van transactionele e-mails (aanmelding, acceptatie, uitbetaling, herinneringen) en push-notificaties (met toestemming).

**Kwaliteitsborging**
Het bijhouden van beoordelingen en statistieken om de kwaliteit van het platform te waarborgen.

**Naleving van wet- en regelgeving**
Het voldoen aan wettelijke verplichtingen, waaronder de Wet BIG, fiscale bewaarplicht en AVG.`,
  },
  {
    title: "6. Verwerkers en ontvangers",
    body: `Wij delen je persoonsgegevens met de volgende partijen:

**Verwerkers (verwerken gegevens in onze opdracht)**

| Partij | Doel | Locatie |
|--------|------|---------|
| Supabase Inc. | Databasehosting (PostgreSQL) | VS (SCCs van toepassing) |
| Vercel Inc. | Hostingplatform | VS (SCCs van toepassing) |
| Resend Inc. | Transactionele e-mailverzending | VS (SCCs van toepassing) |
| Stripe Inc. | Betalingsverwerking en identiteitsverificatie | VS/EU (SCCs van toepassing) |

**Ontvangers op basis van wettelijke verplichting**
- Inspectie Gezondheidszorg en Jeugd (IGJ) of andere autoriteiten bij wettelijke vordering;
- Belastingdienst / fiscale autoriteiten;
- Politie en justitie bij strafrechtelijk onderzoek, na rechtsgeldige vordering.

**Zichtbaarheid voor andere gebruikers**
- Naam, functie, sector, uurtarief, verificatiebadges en beoordeling van professionals zijn zichtbaar voor ingelogde zorginstellingen;
- Bedrijfsnaam en locatie van instellingen zijn zichtbaar voor ingelogde professionals.

Wij verkopen jouw persoonsgegevens nooit aan derden.`,
  },
  {
    title: "7. Internationale doorgifte",
    body: `Een deel van onze verwerkers is gevestigd buiten de Europese Economische Ruimte (EER). Voor deze doorgiften gelden de volgende waarborgen:

- **Standard Contractual Clauses (SCCs)**: Alle doorgiften buiten de EER zijn gebaseerd op door de Europese Commissie goedgekeurde modelcontractbepalingen.
- **Adequaatheidsbesluit**: Waar van toepassing maken wij gebruik van erkende doorgifte-mechanismen.
- **Stripe en identiteitsverificatie**: Identiteitsdocumenten worden verwerkt door Stripe Inc. onder hun eigen privacybeleid en beveiligingsstandaarden; CaredIn ontvangt enkel de verificatie-uitkomst.

Je kunt de specifieke waarborgen per verwerker opvragen via info@caredin.nl.`,
  },
  {
    title: "8. Bewaartermijnen",
    body: `Wij bewaren persoonsgegevens niet langer dan noodzakelijk:

| Categorie | Bewaartermijn | Grondslag |
|-----------|--------------|-----------|
| Accountgegevens professional | Tot verwijdering account + 1 jaar | Overeenkomst |
| Accountgegevens instelling | Tot verwijdering account + 1 jaar | Overeenkomst |
| BIG/SKJ/KvK verificatiegegevens | Looptijd account + 2 jaar | Wettelijke verplichting |
| VOG-documentreferentie | Looptijd account + 2 jaar | Gerechtvaardigd belang |
| Dienstgegevens en urenregistraties | 7 jaar | Fiscale bewaarplicht |
| Financiële gegevens (facturen, uitbetalingen) | 7 jaar | Fiscale bewaarplicht |
| Beoordelingen | Tot verwijdering account | Overeenkomst |
| E-mailcorrespondentie | 2 jaar | Gerechtvaardigd belang |
| Push-notificatieabonnementen | Tot intrekking toestemming | Toestemming |
| Loggegevens (geanonimiseerd) | 90 dagen | Beveiliging |

Bij verwijdering van een account worden persoonlijk herleidbare gegevens geanonimiseerd of verwijderd, tenzij een wettelijke bewaarplicht geldt.`,
  },
  {
    title: "9. Beveiliging",
    body: `CaredIn treft passende technische en organisatorische maatregelen:

**Technische maatregelen**
- Alle verbindingen zijn beveiligd via HTTPS/TLS 1.3
- Wachtwoorden worden opgeslagen als bcrypt-hash (cost factor 12)
- Databasetoegang is beperkt via Row Level Security (Supabase)
- Stripe verwerkt alle betalings- en identiteitsgegevens in een PCI-DSS gecertificeerde omgeving
- Vercel edge-beveiliging en automatische HTTPS

**Organisatorische maatregelen**
- Toegang tot productiedata is beperkt tot de verwerkingsverantwoordelijke
- Verwerkers zijn gebonden aan verwerkersovereenkomsten
- Geen onnodige verwerking van bijzondere persoonsgegevens

**Datalekken**
Bij een datalek dat risico oplevert voor betrokkenen zullen wij dit binnen 72 uur melden bij de Autoriteit Persoonsgegevens en betrokkenen zo snel mogelijk informeren conform art. 33-34 AVG.`,
  },
  {
    title: "10. Cookies en push-notificaties",
    body: `**Cookies**

CaredIn gebruikt de volgende cookies:

- **Sessiecookies (strikt noodzakelijk)**: Voor authenticatie via NextAuth.js. Vereist voor inlogfunctionaliteit.
- **CSRF-cookies (strikt noodzakelijk)**: Voor beveiliging van formulieren.

Wij gebruiken geen analytische cookies van derden, geen marketing cookies en geen cross-site tracking.

**Push-notificaties**

CaredIn biedt de mogelijkheid push-notificaties te ontvangen via de browser (Web Push API). Dit vereist jouw uitdrukkelijke toestemming. Je kunt toestemming te allen tijde intrekken via je browserinstellingen of via je dashboard (Instellingen → Notificaties).

Pushberichten worden verwerkt via de Web Push API van je browser en worden niet doorgegeven aan derden.`,
  },
  {
    title: "11. Minderjarigen",
    body: `CaredIn is uitsluitend bestemd voor personen van 18 jaar en ouder. Wij verwerken niet bewust persoonsgegevens van personen onder de 18 jaar. Indien wij vaststellen dat gegevens van een minderjarige zijn verwerkt, zullen wij deze onmiddellijk verwijderen. Meld dit via info@caredin.nl.`,
  },
  {
    title: "12. Jouw rechten",
    body: `Op grond van de AVG heb je de volgende rechten:

**Recht op inzage (art. 15 AVG)**
Je kunt een overzicht opvragen van alle persoonsgegevens die CaredIn van jou verwerkt.

**Recht op rectificatie (art. 16 AVG)**
Je kunt onjuiste of onvolledige gegevens laten corrigeren. Veel gegevens kun je zelf aanpassen via je dashboard.

**Recht op verwijdering ("recht op vergetelheid") (art. 17 AVG)**
Je kunt verzoeken jouw account en gegevens te verwijderen. Gegevens die wij op grond van een wettelijke verplichting moeten bewaren (bijv. financiële gegevens, 7 jaar) kunnen niet worden verwijderd maar worden wel geanonimiseerd.

**Recht op beperking van verwerking (art. 18 AVG)**
Je kunt in bepaalde situaties verzoeken de verwerking van jouw gegevens te beperken.

**Recht op gegevensoverdraagbaarheid (art. 20 AVG)**
Je kunt een kopie van jouw gegevens in een machineleesbaar formaat (JSON/CSV) opvragen.

**Recht van bezwaar (art. 21 AVG)**
Je kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang.

**Rechten met betrekking tot geautomatiseerde besluitvorming (art. 22 AVG)**
CaredIn maakt geen gebruik van volledig geautomatiseerde besluitvorming met rechtsgevolgen.

**Hoe een verzoek indienen**
Stuur een e-mail naar info@caredin.nl met vermelding van je naam, e-mailadres en het specifieke verzoek. Wij reageren binnen 30 dagen. Voor de bescherming van jouw privacy kunnen wij je identiteit verifiëren voordat wij een verzoek inwilligen.`,
  },
  {
    title: "13. Klachten",
    body: `Als je een klacht hebt over de manier waarop CaredIn jouw persoonsgegevens verwerkt, neem dan eerst contact met ons op via info@caredin.nl.

Als je niet tevreden bent met onze reactie, heb je het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens:

**Autoriteit Persoonsgegevens (AP)**
Website: autoriteitpersoonsgegevens.nl
Postadres: Postbus 93374, 2509 AJ Den Haag
Telefoon: 0900 - 2001 201`,
  },
  {
    title: "14. Wijzigingen",
    body: `CaredIn behoudt zich het recht voor dit privacybeleid te allen tijde te wijzigen. Gewijzigde versies worden gepubliceerd op caredin.nl/privacy met vermelding van de ingangsdatum. Bij wezenlijke wijzigingen ontvang je hierover een e-mailnotificatie.

Dit privacybeleid is voor het laatst bijgewerkt op **20 april 2026**.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>
            Juridisch
          </p>
          <h1 className="text-[36px] font-bold tracking-[-1px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Privacybeleid
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            caredin.nl · KVK: 76695808 · Laatst bijgewerkt: 20 april 2026
          </p>
        </div>

        {/* Inhoudsopgave */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: "white", border: "0.5px solid var(--border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
            Inhoudsopgave
          </p>
          <ol className="space-y-1">
            {ARTICLES.map(({ title }) => (
              <li key={title}>
                <a
                  href={`#art-${title.split(".")[0].replace(/\s/g, "")}`}
                  className="text-sm no-underline hover:underline"
                  style={{ color: "var(--teal)" }}
                >
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {ARTICLES.map(({ title, body }) => (
            <div key={title} id={`art-${title.split(".")[0].replace(/\s/g, "")}`}>
              <h2 className="text-[15px] font-bold mb-3" style={{ color: "var(--dark)" }}>{title}</h2>
              <div className="space-y-3">
                {body.split("\n\n").map((para, i) => {
                  if (para.startsWith("|")) {
                    const rows = para.trim().split("\n").filter(r => !r.match(/^\|[-|]+\|$/));
                    return (
                      <div key={i} className="overflow-x-auto rounded-xl" style={{ border: "0.5px solid var(--border)" }}>
                        <table className="w-full text-xs border-collapse">
                          {rows.map((row, ri) => {
                            const cells = row.split("|").filter(c => c.trim() !== "");
                            const Tag = ri === 0 ? "th" : "td";
                            return (
                              <tr key={ri} style={{ background: ri === 0 ? "var(--teal-light)" : ri % 2 === 0 ? "#fafafa" : "white" }}>
                                {cells.map((cell, ci) => (
                                  <Tag key={ci} className="px-3 py-2 text-left font-normal"
                                    style={{ borderBottom: "0.5px solid var(--border)", color: ri === 0 ? "var(--teal)" : "var(--muted)" }}
                                    dangerouslySetInnerHTML={{ __html: cell.trim().replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                                ))}
                              </tr>
                            );
                          })}
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.+?)\*\*/g, "<strong style='color:var(--dark)'>$1</strong>")
                        .replace(/^- (.+)/gm, "• $1")
                    }} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 text-xs space-y-1" style={{ borderTop: "0.5px solid var(--border)", color: "var(--muted)" }}>
          <p>CaredIn · caredin.nl · KVK: 76695808</p>
          <p>E-mail: info@caredin.nl</p>
        </div>
      </div>
    </div>
  );
}
