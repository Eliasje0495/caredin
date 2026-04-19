import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { BLOG_ARTICLES } from "@/app/blog/page";

// ─── Article body content ────────────────────────────────────────────────────

const ARTICLE_CONTENT: Record<string, string> = {
  "zzp-zorg-belastingaangifte-2025": `
    <h2>Waarom de belastingaangifte voor ZZP&apos;ers in de zorg anders is</h2>
    <p>Als ZZP&apos;er in de zorg ben je ondernemer én zorgverlener tegelijk. Dat brengt een unieke fiscale positie met zich mee. Je betaalt inkomstenbelasting over je winst — en die winst kun je flink verlagen met de juiste aftrekposten. Toch laten veel zorgprofessionals elk jaar geld liggen omdat ze niet weten waar ze recht op hebben.</p>

    <h2>De vier belangrijkste aftrekposten</h2>
    <p>Voordat je aangifte doet, is het slim om de volgende posten goed te documenteren:</p>
    <ul>
      <li><strong>Zelfstandigenaftrek:</strong> In 2025 bedraagt deze €3.750. Je hebt hier recht op als je meer dan 1.225 uur per jaar als ondernemer werkt.</li>
      <li><strong>MKB-winstvrijstelling:</strong> 13,31% van je winst na de zelfstandigenaftrek is belastingvrij.</li>
      <li><strong>Startersaftrek:</strong> De eerste drie jaar als starter kun je €2.123 extra aftrekken bovenop de zelfstandigenaftrek.</li>
      <li><strong>Zakelijke kosten:</strong> Denk aan beroepskleding, vakliteratuur, cursussen en bijscholing, kantoorbenodigdheden en reiskosten.</li>
    </ul>

    <h2>Stap voor stap: jouw aangifte invullen</h2>
    <p>Open de aangifte via Mijn Belastingdienst en navigeer naar 'Winst uit onderneming'. Vul je omzet in — dit zijn alle facturen die je hebt verstuurd in 2025, ongeacht of ze al betaald zijn. Trek hier je zakelijke kosten vanaf. Het resultaat is je winst vóór aftrekposten.</p>
    <p>Vervolgens pas je de zelfstandigenaftrek toe, de eventuele startersaftrek en tot slot de MKB-winstvrijstelling. Het resterende bedrag is je belastbare winst.</p>

    <h2>Veelgemaakte fouten</h2>
    <p>Een van de grootste fouten is het niet bijhouden van een kilometerregistratie voor zakelijke ritten. Elke zakelijke rit — naar een instelling, een klant of een cursus — levert je €0,23 per kilometer op als aftrekpost. Bij gemiddeld 10.000 zakelijke kilometers per jaar is dat €2.300 aan aftrek. Zorg ook dat je bonnen bewaart. De Belastingdienst kan zeven jaar teruggaan bij een controle.</p>

    <h2>Hulp nodig?</h2>
    <p>Een belastingadviseur die gespecialiseerd is in ZZP-zorg kost tussen de €150 en €400 per jaar — maar bespaart je doorgaans veel meer. Via CaredIn kun je contact leggen met andere ZZP&apos;ers die ervaringen hebben gedeeld over hun boekhouder.</p>
  `,

  "big-nummer-aanvragen-gids": `
    <h2>Wat is een BIG-nummer en waarom heb je het nodig?</h2>
    <p>BIG staat voor Beroepen in de Individuele Gezondheidszorg. Het BIG-register is een wettelijk verplicht register dat bijhoudt welke zorgverleners bevoegd zijn om bepaalde handelingen te verrichten. Zonder registratie mag je als verpleegkundige, arts, fysiotherapeut of andere BIG-beroepsbeoefenaar niet zelfstandig werken.</p>
    <p>Zorginstellingen en platforms zoals CaredIn zijn wettelijk verplicht te controleren of een professional is geregistreerd. Een BIG-nummer is dan ook letterlijk je toegangspas tot de arbeidsmarkt in de zorg.</p>

    <h2>Wie kan zich registreren?</h2>
    <p>Niet iedereen kan een BIG-registratie aanvragen. Het register is bedoeld voor de volgende beroepsgroepen:</p>
    <ul>
      <li>Artsen (basisartsen en specialisten)</li>
      <li>Verpleegkundigen (niveau 5/6)</li>
      <li>Fysiotherapeuten</li>
      <li>Psychologen (GZ-psycholoog en psychotherapeut)</li>
      <li>Apothekers en apothekersassistenten</li>
      <li>Verloskundigen, tandartsen, orthopedagogen-generalist</li>
    </ul>

    <h2>Stap voor stap aanvragen</h2>
    <p>De aanvraag verloopt digitaal via het CIBG (Centrum Indicatiestelling Zorg voor Beroepsregistratie). Ga naar bigregister.nl en klik op 'Aanmelden'. Je hebt nodig: een geldig identiteitsbewijs, jouw diploma of getuigschrift en een bewijs van je werkadres of Kamer van Koophandel-inschrijving.</p>
    <p>Na het indienen van je aanvraag ontvang je binnen vier tot acht weken een beslissing. In sommige gevallen — bij buitenlandse diploma's — kan dit langer duren.</p>

    <h2>Herregistratie: vergeet het niet</h2>
    <p>Een BIG-registratie is niet voor het leven. Elke vijf jaar moet je herregistreren. Dit doe je door aan te tonen dat je voldoende uren hebt gewerkt in je beroep en dat je scholing hebt gevolgd. De exacte eisen verschillen per beroepsgroep. Stel een reminder in je agenda — een verlopen registratie kan serieuze gevolgen hebben voor je praktijkvoering.</p>
  `,

  "flexibel-werken-zorg-voordelen": `
    <h2>De mythe van baanzekerheid</h2>
    <p>Veel zorgprofessionals houden vast aan een vaste aanstelling omdat het "zekerder" voelt. Maar in een sector waar vrijwel iedereen die wil werken ook werk vindt, is die redenering steeds minder steekhoudend. Flexibel werken heeft een aantal concrete voordelen die vaste medewerkers vaak niet zien.</p>

    <h2>1. Je verdient meer — echt</h2>
    <p>Een ZZP&apos;er in de zorg verdient gemiddeld 20 tot 40% meer per uur dan een vergelijkbare medewerker in loondienst. De uren die je besteedt aan reistijd, administratie en overleg tellen mee als werkuren — en die rekent een instelling door in het tarief. Tel daarbij de zakelijke aftrekposten op en je houdt netto aanzienlijk meer over.</p>

    <h2>2. Jij bepaalt wanneer je werkt</h2>
    <p>Via platforms als CaredIn zie je dagelijks tientallen diensten en kies je zelf welke je aanneemt. Wil je drie nachten per week werken en de rest vrij zijn voor je gezin? Dat kan. Wil je fulltime in de weekenden werken en de rest van de week vrij? Ook dat is mogelijk.</p>

    <h2>3. Meer variatie, minder sleur</h2>
    <p>Werken op verschillende locaties en met verschillende teams houdt je scherp. Veel zorgprofessionals die overstappen naar flexwerk melden dat ze na een paar jaar in een vaste functie nieuwe energie vinden door de afwisseling.</p>

    <h2>4. Snellere professionele groei</h2>
    <p>Door te werken bij meerdere instellingen doe je snel brede ervaring op. Je ziet hoe verschillende organisaties werken, leert van diverse teams en bouwt een professioneel netwerk op dat in loondienst moeilijker te bereiken is.</p>

    <h2>5. Je bouwt een eigen merk op</h2>
    <p>Als ZZP&apos;er ben je geen nummer. Je reputatie is jouw grootste kapitaal. Goede beoordelingen en herhaalde aanvragen van instellingen leveren je op de lange termijn een stabiel, kwalitatief netwerk op — zonder afhankelijkheid van één werkgever.</p>
  `,

  "zzp-tarief-berekenen-zorg": `
    <h2>Waarom zo veel ZZP&apos;ers te laag zitten</h2>
    <p>Een van de meest voorkomende fouten bij nieuwe ZZP&apos;ers in de zorg is het onderprijzen van hun diensten. Het gevoel "ik wil niet te duur zijn" is begrijpelijk, maar gevaarlijk. Een te laag tarief leidt op de lange termijn tot financiële stress, onderwaardering en burnout.</p>

    <h2>De basisformule</h2>
    <p>Een gezond uurtarief dekt minimaal de volgende kosten:</p>
    <ul>
      <li><strong>Gewenst netto-inkomen:</strong> Wat wil je per maand overhouden? Vermenigvuldig dit met 12 voor een jaarbedrag.</li>
      <li><strong>Belastingen en premies:</strong> Reken op circa 30-40% van je bruto-inkomen. Gebruik een fiscale buffer van minimaal 30%.</li>
      <li><strong>Zakelijke kosten:</strong> Beroepsaansprakelijkheidsverzekering, boekhouder, abonnementen, auto, apparatuur.</li>
      <li><strong>Niet-declarabele uren:</strong> Administratie, reistijd, acquisitie en scholing. Reken op 30-40% van je totale werkuren als niet-declarabel.</li>
      <li><strong>Vakantie en ziekte:</strong> Je hebt geen betaald verlof — dit moet je in je tarief inbouwen. Tel minimaal 6 weken per jaar.</li>
    </ul>

    <h2>Een praktisch voorbeeld</h2>
    <p>Je wilt €3.000 netto per maand verdienen. Bruto is dat bij een belastingdruk van 35% ongeveer €4.615 per maand, ofwel €55.385 per jaar. Tel zakelijke kosten van €8.000 per jaar erbij op. Totale omzet die je nodig hebt: circa €63.385 per jaar. Als je 1.000 declarabele uren per jaar werkt (rekening houdend met vakantie en niet-declarabele tijd), is je uurtarief: €63,39. Voeg een marge van 10-15% toe voor onvoorziene kosten: uitkomt op circa €70-73 per uur.</p>

    <h2>Controleer de markt</h2>
    <p>Vergelijk jouw berekende tarief met de markt. Een verpleegkundige niveau 4 werkt doorgaans voor €45-€60 per uur. Niveau 5 ligt tussen €55-€75. Gespecialiseerd personeel (IC, OK, psychiatrie) kan oplopen tot €90 of meer. Als jouw berekende tarief hier fors buiten valt, kijk dan kritisch naar je kostenniveau.</p>
  `,

  "ai-planning-zorg-2025": `
    <h2>Het personeelstekort in cijfers</h2>
    <p>Nederland kampt met een structureel tekort aan zorgpersoneel. Volgens het Capaciteitsorgaan zijn er in 2030 naar schatting 100.000 extra zorgwerkers nodig. Traditionele werving via uitzendbureaus en vaste aanstellingen is onvoldoende om dit gat te dichten. AI-gedreven planningstools worden steeds vaker gezien als deel van de oplossing.</p>

    <h2>Hoe AI-planning werkt</h2>
    <p>Moderne planningsplatforms gebruiken machine learning om vraag en aanbod in real-time op elkaar af te stemmen. Algoritmes analyseren historische bezettingspatronen, voorspellen pieken in zorgvraag (denk aan griepgolven of feestdagen) en matchen dit automatisch met beschikbare professionals in de regio.</p>
    <p>Platforms als CaredIn gaan verder dan simpel matchen. Het systeem leert van elke match: welke professional scoort goed bij welke instellingen? Welke reistijd is acceptabel? Wat zijn de voorkeuren van de professional? Al deze data maakt elke volgende match nauwkeuriger.</p>

    <h2>Voordelen voor zorgprofessionals</h2>
    <ul>
      <li>Minder tijd kwijt aan zoeken: passende diensten komen proactief naar je toe</li>
      <li>Betere matches betekenen meer voldoening in het werk</li>
      <li>Transparantie over tarieven — geen onderhandelingsnadeel meer</li>
      <li>Digitale administratie: roosters, uren, facturen — alles op één plek</li>
    </ul>

    <h2>De keerzijde: wat AI niet kan</h2>
    <p>AI is goed in patronen herkennen en optimaliseren. Maar de zorg draait uiteindelijk om mensen. Een algoritme weet niet dat een verzorgende een bijzondere klik heeft met een bepaalde bewoner, of dat een professional na een zware periode behoefte heeft aan een rustigere afdeling. Menselijk inzicht blijft onmisbaar.</p>

    <h2>De toekomst</h2>
    <p>De verwachting is dat in 2026 meer dan 60% van de flexibele zorgplaatsingen via AI-ondersteunde platforms verloopt. Voor ZZP&apos;ers en flexwerkers die hier vroeg op inspringen, zijn er grote kansen: minder tussenpersonen, hogere tarieven en meer controle over hun eigen loopbaan.</p>
  `,

  "burnout-voorkomen-zzp-zorg": `
    <h2>Waarom ZZP&apos;ers extra kwetsbaar zijn</h2>
    <p>Als ZZP&apos;er in de zorg ben je verantwoordelijk voor alles: je patiënten, je omzet, je administratie, je professionele ontwikkeling en je eigen welzijn. Dat is een zware combinatie, zeker in een sector die al structureel hoge werkdruk kent. Geen collega's die een dienst kunnen overnemen, geen HR-afdeling die ingrijpt als het niet goed gaat. De signalen worden daardoor soms pas laat herkend.</p>

    <h2>De vroege waarschuwingssignalen</h2>
    <p>Burnout begint niet met een crisis. Het begint met kleine verschuivingen die je makkelijk rationaliseert:</p>
    <ul>
      <li>Elke vrije dag werk je toch even bij aan je administratie</li>
      <li>Je accepteert diensten uit angst voor inkomstenverlies, niet omdat je er zin in hebt</li>
      <li>Je wordt cynisch over patiënten of instellingen — terwijl je vroeger echte voldoening voelde</li>
      <li>Lichamelijke klachten: slaapproblemen, spanning in je nek of schouders, prikkelbaarheid</li>
      <li>Je vergeet steeds vaker kleine dingen of maakt fouten die je normaal niet maakt</li>
    </ul>

    <h2>Structurele maatregelen die werken</h2>
    <p>De effectiefste bescherming tegen burnout is structureel, niet reactief. Dat betekent: grenzen stellen voordat je ze nodig hebt.</p>
    <p>Bepaal hoeveel diensten per week jouw maximum is — en houd je eraan, ook als de vraag groter is. Plan elke week minimaal één volledige vrije dag waarop je ook echt niets werkt. Zorg voor een financiële buffer van drie tot zes maanden aan vaste lasten, zodat je een periode kunt werken vanuit keuze in plaats van noodzaak.</p>

    <h2>Verbinding met andere professionals</h2>
    <p>Isolatie is een van de grootste risicofactoren voor ZZP&apos;ers. Zoek actief contact met andere zorgprofessionals — via intervisiegroepen, online communities of platforms als CaredIn. Herkenning van je eigen ervaringen bij anderen heeft een beschermende werking.</p>

    <h2>Wanneer hulp zoeken</h2>
    <p>Als je langer dan twee weken aanhoudend moe bent, je plezier in het werk vrijwel volledig verdwenen is en je sociale contacten vermijdt: zoek professionele hulp. Vroeg ingrijpen voorkomt een langdurig hersteltraject. Je huisarts is het eerste aanspreekpunt.</p>
  `,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: { slug: string };
};

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogArticlePage({ params }: Props) {
  const article = BLOG_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = BLOG_ARTICLES.filter((a) => a.slug !== params.slug).slice(0, 3);
  const bodyHtml = ARTICLE_CONTENT[params.slug] ?? "<p>Artikel wordt binnenkort gepubliceerd.</p>";

  const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
    "ZZP Tips":           { bg: "rgba(26,122,106,0.15)",  color: "#fff" },
    "Wet & Regelgeving":  { bg: "rgba(255,255,255,0.2)",  color: "#fff" },
    "Arbeidsmarkt":       { bg: "rgba(255,255,255,0.2)",  color: "#fff" },
    "Zorg & Technologie": { bg: "rgba(255,255,255,0.2)",  color: "#fff" },
  };
  const catStyle = CATEGORY_STYLE[article.category] ?? { bg: "rgba(255,255,255,0.2)", color: "#fff" };

  return (
    <>
      <Nav />

      {/* Article hero */}
      <div className="px-12 py-14" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium no-underline mb-8"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            ← Terug naar blog
          </Link>

          {/* Category badge */}
          <div className="mb-4">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: catStyle.bg, color: catStyle.color }}
            >
              {article.category}
            </span>
          </div>

          <h1
            className="text-[clamp(28px,3.5vw,48px)] font-bold text-white tracking-[-1px] leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "740px" }}
          >
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                C
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                CaredIn Redactie
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {article.date}
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {article.readTime} leestijd
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* Main content */}
            <article>
              <div
                className="rounded-2xl bg-white p-8 md:p-10"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <div
                  className="article-body"
                  style={{
                    color: "var(--text)",
                    lineHeight: "1.85",
                    fontSize: "15px",
                  }}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>

              {/* Author card */}
              <div
                className="mt-6 rounded-2xl bg-white p-6 flex items-center gap-4"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                  style={{ background: "var(--teal)" }}
                >
                  CR
                </div>
                <div>
                  <div className="text-[14px] font-bold" style={{ color: "var(--dark)" }}>
                    CaredIn Redactie
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                    Praktische kennis voor zorgprofessionals in Nederland
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">

              {/* More reading */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <h3
                  className="text-[13px] font-bold uppercase tracking-[1px] mb-4"
                  style={{ color: "var(--teal)" }}
                >
                  Meer lezen
                </h3>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="block no-underline group"
                    >
                      <div
                        className="flex gap-3 p-3 rounded-xl hover:bg-[var(--teal-light)] transition-colors"
                      >
                        <span className="text-2xl flex-shrink-0">{rel.emoji}</span>
                        <div>
                          <div
                            className="text-[13px] font-semibold leading-snug mb-1"
                            style={{ color: "var(--dark)" }}
                          >
                            {rel.title}
                          </div>
                          <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                            {rel.readTime} leestijd
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--dark)" }}
              >
                <div className="text-3xl mb-3">🚀</div>
                <h3
                  className="text-[16px] font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Begin als ZZP&apos;er
                </h3>
                <p className="text-[12px] mb-5 leading-[1.6]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Meld je gratis aan en vind je eerste dienst binnen 24 uur via CaredIn.
                </p>
                <Link
                  href="/registreren"
                  className="inline-flex px-5 py-2.5 rounded-[40px] text-sm font-semibold no-underline text-white"
                  style={{ background: "var(--teal)" }}
                >
                  Aanmelden →
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {/* Inline styles for article body */}
      <style>{`
        .article-body h2 {
          font-family: var(--font-fraunces);
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.3px;
          line-height: 1.25;
        }
        .article-body p {
          margin-bottom: 1rem;
          color: var(--text);
        }
        .article-body ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .article-body ul li {
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .article-body strong {
          font-weight: 700;
          color: var(--dark);
        }
        .article-body h2:first-child {
          margin-top: 0;
        }
      `}</style>

      {/* Footer */}
      <footer
        className="px-12 py-12"
        style={{ background: "var(--dark)", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="no-underline">
            <span
              className="text-[20px] font-bold"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
            >
              Care<span style={{ color: "rgba(255,255,255,0.7)" }}>din</span>
            </span>
          </Link>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            CaredIn © 2025
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[12px] no-underline" style={{ color: "rgba(255,255,255,0.3)" }}>
              Privacy
            </Link>
            <Link href="/voorwaarden" className="text-[12px] no-underline" style={{ color: "rgba(255,255,255,0.3)" }}>
              Voorwaarden
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
