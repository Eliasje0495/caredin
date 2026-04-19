import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { HELPDESK_ARTICLES } from "@/app/helpdesk/page";

// ─── Article content ──────────────────────────────────────────────────────────

const HELPDESK_CONTENT: Record<string, string> = {
  "account-aanmaken": `
    <h2>Stap 1: Ga naar de registratiepagina</h2>
    <p>Ga naar <strong>caredin.nl/registreren</strong> en kies welk type account je wilt aanmaken: een professioneel account als zorgprofessional, of een organisatieaccount als zorginstelling.</p>

    <h2>Stap 2: Vul je basisgegevens in</h2>
    <p>Je hebt nodig: je volledige naam, een geldig e-mailadres en een wachtwoord van minimaal 8 tekens. We raden aan een sterk wachtwoord te kiezen dat je nergens anders gebruikt.</p>
    <p>Voor zorgprofessionals vragen we daarna om:</p>
    <ul>
      <li>Je BIG-registratienummer (als je een BIG-geregistreerd beroep uitoefent)</li>
      <li>Je KvK-nummer als je als ZZP'er werkt</li>
      <li>Je IBAN voor uitbetaling via Stripe Connect</li>
    </ul>

    <h2>Stap 3: Bevestig je e-mailadres</h2>
    <p>Na het invullen van je gegevens ontvang je een bevestigingsmail. Klik op de link in de mail om je account te activeren. Controleer ook je spamfolder als je de mail niet ziet.</p>

    <h2>Stap 4: Stel je profiel in</h2>
    <p>Na activering word je doorgestuurd naar de onboarding-flow. Hier stel je je profiel volledig in: profielfoto, werkervaring, beschikbaarheid en regio. Hoe completer je profiel, hoe meer diensten je ontvangt die bij je passen.</p>

    <h2>Hulp nodig?</h2>
    <p>Lukt het registreren niet? Neem contact op via <strong>support@caredin.nl</strong> en stuur een beschrijving van het probleem mee. We helpen je binnen 2 werkuren verder.</p>
  `,

  "profiel-completeren": `
    <h2>Waarom een compleet profiel belangrijk is</h2>
    <p>Zorginstellingen zoeken gericht naar professionals die aansluiten bij hun behoeften. Een profiel met een foto, duidelijke werkervaring en actuele beschikbaarheid scoort significant beter in onze matchingalgoritme. Professionals met een volledig profiel krijgen gemiddeld 3x meer relevante diensten aangeboden.</p>

    <h2>Wat maakt een profiel compleet?</h2>
    <ul>
      <li><strong>Profielfoto:</strong> Een recente, professionele foto. Geen groepsfoto's of foto's met zonnebril.</li>
      <li><strong>Beroepstitel en specialisaties:</strong> Geef aan in welke sectoren je werkzaam bent (bijv. VVT, GGZ, ziekenhuis).</li>
      <li><strong>Werkervaring:</strong> Voeg minimaal je twee meest recente functies toe met beschrijving.</li>
      <li><strong>Beschikbaarheid:</strong> Geef aan op welke dagen en tijden je beschikbaar bent.</li>
      <li><strong>Regio:</strong> Vul je voorkeurregio's in — dit bepaalt welke diensten je ziet.</li>
      <li><strong>BIG-verificatie:</strong> Upload je BIG-certificaat voor een geverifieerd profiel-badge.</li>
    </ul>

    <h2>Hoe update je je profiel?</h2>
    <p>Log in en ga naar <strong>Dashboard → Profiel</strong>. Klik op 'Bewerken' naast het onderdeel dat je wilt aanpassen. Wijzigingen worden direct zichtbaar voor zorginstellingen.</p>

    <h2>Beschikbaarheid up-to-date houden</h2>
    <p>Het is belangrijk je beschikbaarheid actueel te houden. Als je tijdelijk niet beschikbaar bent — door vakantie of ziekte — kun je je profiel op 'Niet beschikbaar' zetten. Zo voorkom je dat je irrelevante aanvragen ontvangt.</p>
  `,

  "big-verificatie": `
    <h2>Wat is BIG-verificatie?</h2>
    <p>BIG-verificatie is het proces waarbij CaredIn controleert of jouw BIG-registratie geldig en actueel is. Dit is een wettelijke verplichting voor zorginstellingen — zij mogen alleen samenwerken met BIG-geregistreerde professionals voor voorbehouden handelingen.</p>

    <h2>Hoe werkt de verificatie op CaredIn?</h2>
    <p>Na het aanmaken van je account kun je je BIG-nummer invoeren in je profiel. CaredIn controleert automatisch via de officiële CIBG-database of jouw registratie actief is. Dit gebeurt bij het aanmaken van je profiel én periodiek daarna.</p>
    <p>De verificatie verloopt in drie stappen:</p>
    <ul>
      <li>Je voert je BIG-nummer in tijdens de onboarding</li>
      <li>Ons systeem verifieert het nummer bij het CIBG (doorgaans binnen enkele seconden)</li>
      <li>Na succesvolle verificatie verschijnt er een blauw verificatiebadge op je profiel</li>
    </ul>

    <h2>Hoe lang duurt verificatie?</h2>
    <p>In de meeste gevallen is verificatie vrijwel direct. In zeldzame gevallen — bijvoorbeeld bij recent herregistreerde nummers — kan het tot 24 uur duren voordat de CIBG-database is bijgewerkt. Neem in dat geval na 24 uur contact op als je badge nog niet zichtbaar is.</p>

    <h2>Mijn BIG-nummer wordt niet herkend — wat nu?</h2>
    <p>Controleer of je het nummer correct hebt ingevoerd: een BIG-nummer bestaat uit 11 cijfers. Als het nummer correct is maar niet wordt herkend, kan je registratie verlopen zijn. Ga naar bigregister.nl om de status van je registratie te controleren. Verloopt je registratie binnenkort? Dan is herregistratie nodig.</p>
  `,

  "eerste-uitbetaling": `
    <h2>Hoe werkt uitbetaling op CaredIn?</h2>
    <p>CaredIn verwerkt betalingen via Stripe Connect, een veilig en internationaal erkend betalingssysteem. Je ontvangt je verdiensten direct op je eigen bankrekening — er is geen tussenkomst van derden nodig.</p>

    <h2>De uitbetalingscyclus stap voor stap</h2>
    <ul>
      <li><strong>Dienst afronden:</strong> Na het afronden van een dienst check je uit via de CaredIn app.</li>
      <li><strong>Goedkeuring door instelling:</strong> De zorginstelling heeft 7 dagen om de gewerkte uren goed te keuren.</li>
      <li><strong>Uitbetaling:</strong> Na goedkeuring wordt het bedrag binnen 48 uur bijgeschreven op jouw IBAN.</li>
    </ul>

    <h2>Wanneer ontvang ik mijn eerste uitbetaling?</h2>
    <p>Je eerste uitbetaling ontvang je nadat:</p>
    <ul>
      <li>Je Stripe Connect-account volledig is ingesteld (inclusief identiteitsverificatie)</li>
      <li>Je je eerste dienst hebt afgerond en de checkout is goedgekeurd door de instelling</li>
      <li>48 uur zijn verstreken na goedkeuring</li>
    </ul>
    <p>Gemiddeld ontvangen nieuwe professionals hun eerste uitbetaling binnen 3 tot 5 werkdagen na hun eerste dienst.</p>

    <h2>Mijn uitbetaling is vertraagd — wat moet ik doen?</h2>
    <p>Controleer eerst of de instelling de uren al heeft goedgekeurd in hun dashboard. Als goedkeuring is gegeven maar je betaling na 72 uur nog niet is bijgeschreven, neem dan contact op met support@caredin.nl met je dienstnummer erbij.</p>
  `,

  "dienst-aanmelden": `
    <h2>Hoe vind ik beschikbare diensten?</h2>
    <p>Log in op je CaredIn account en ga naar <strong>Dashboard → Diensten</strong>. Je ziet hier een overzicht van diensten die aansluiten op jouw profiel, regio en beschikbaarheid. Je kunt filteren op datum, sector, regio en functieniveau.</p>

    <h2>Aanmelden voor een dienst</h2>
    <p>Klik op een dienst voor alle details: locatie, tijden, functie, tarief en instructies van de instelling. Als de dienst past, klik je op <strong>'Aanmelden voor deze dienst'</strong>. Je ontvangt een bevestiging per e-mail.</p>
    <p>Sommige instellingen werken met directe acceptatie (je bent direct ingepland), andere met een bevestigingsronde (de instelling bekijkt aanmeldingen en selecteert een professional).</p>

    <h2>Wat gebeurt er na aanmelding?</h2>
    <ul>
      <li>Bij directe acceptatie: je ontvangt onmiddellijk een bevestiging en de dienst staat in je agenda</li>
      <li>Bij een bevestigingsronde: je ontvangt uiterlijk 48 uur voor aanvang van de dienst bericht</li>
    </ul>

    <h2>Meerdere diensten tegelijk aanmelden</h2>
    <p>Je kunt je voor meerdere diensten tegelijk aanmelden, ook als ze op dezelfde datum vallen. Zodra je voor één dienst definitief wordt ingepland, worden eventuele andere aanmeldingen op diezelfde datum automatisch ingetrokken.</p>

    <h2>Annuleren na aanmelding</h2>
    <p>Als je je aanmelding wilt intrekken vóór bevestiging, kan dit zonder gevolgen via je dashboard. Na bevestiging gelden de annuleringsvoorwaarden. Bekijk ons annuleringsbeleid voor de exacte regels.</p>
  `,

  "annulering-beleid": `
    <h2>Waarom hebben we een annuleringsbeleid?</h2>
    <p>Zorginstellingen plannen diensten ver van tevoren en zijn afhankelijk van betrouwbare professionals. Een last-minute annulering kan directe gevolgen hebben voor de zorgkwaliteit. Ons annuleringsbeleid beschermt zowel instellingen als professionals.</p>

    <h2>Annuleren als professional</h2>
    <p>Voor professionals gelden de volgende regels na bevestiging van een dienst:</p>
    <ul>
      <li><strong>Meer dan 72 uur van tevoren:</strong> Kosteloos annuleren, geen gevolgen voor je profiel</li>
      <li><strong>Tussen 24 en 72 uur van tevoren:</strong> Annulering mogelijk, maar telt mee in je betrouwbaarheidsscore</li>
      <li><strong>Minder dan 24 uur van tevoren:</strong> Ernstige annulering — heeft invloed op je profiel en zichtbaarheid in de zoekresultaten</li>
      <li><strong>No-show (niet komen zonder afmelding):</strong> Leidt tot tijdelijke schorsing van je account</li>
    </ul>

    <h2>Overmacht</h2>
    <p>We begrijpen dat onvoorziene omstandigheden kunnen optreden. Bij ziekte of noodgevallen kun je contact opnemen met support@caredin.nl. We beoordelen overmachtsituaties altijd individueel en kunnen annuleringen in uitzonderlijke gevallen uit je geschiedenis verwijderen.</p>

    <h2>Annuleren als instelling</h2>
    <p>Ook instellingen hebben een verantwoordelijkheid. Een dienst annuleren minder dan 48 uur van tevoren leidt tot een compensatievergoeding voor de professional. De exacte bedragen zijn opgenomen in de serviceovereenkomst.</p>

    <h2>Geschillen</h2>
    <p>Als je het niet eens bent met een annuleringsbeslissing, kun je een bezwaar indienen via support@caredin.nl. Ons team bekijkt elk bezwaar binnen 3 werkdagen.</p>
  `,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: { slug: string };
};

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return HELPDESK_ARTICLES.map((a) => ({ slug: a.slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HelpdeskArticlePage({ params }: Props) {
  const article = HELPDESK_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = HELPDESK_ARTICLES.filter((a) => a.slug !== params.slug).slice(0, 3);
  const bodyHtml = HELPDESK_CONTENT[params.slug] ?? "<p>Artikel wordt binnenkort gepubliceerd.</p>";

  return (
    <>
      <Nav />

      {/* Article header — light gray, no teal hero */}
      <div className="px-12 py-10" style={{ background: "#F8FAF9", borderBottom: "0.5px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] mb-6" style={{ color: "var(--muted)" }}>
            <Link href="/helpdesk" className="no-underline hover:underline" style={{ color: "var(--teal)" }}>
              Helpdesk
            </Link>
            <span>/</span>
            <Link
              href={`/helpdesk#${article.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "en")}`}
              className="no-underline hover:underline"
              style={{ color: "var(--teal)" }}
            >
              {article.category}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--dark)" }}>{article.title}</span>
          </nav>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{article.categoryIcon}</span>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(26,122,106,0.1)",
                color: "var(--teal)",
              }}
            >
              {article.category}
            </span>
          </div>

          <h1
            className="text-[clamp(22px,3vw,36px)] font-bold tracking-[-0.5px] leading-[1.2]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)", maxWidth: "680px" }}
          >
            {article.title}
          </h1>

          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Bijgewerkt door CaredIn Redactie · 14 april 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

            {/* Main content */}
            <article>
              <div
                className="rounded-2xl bg-white p-8 md:p-10"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <div
                  className="helpdesk-body"
                  style={{
                    color: "var(--text)",
                    lineHeight: "1.85",
                    fontSize: "15px",
                  }}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>

              {/* Was this helpful? */}
              <div
                className="mt-6 rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <p
                  className="text-[14px] font-semibold mb-4"
                  style={{ color: "var(--dark)" }}
                >
                  Was dit artikel nuttig?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[40px] text-sm font-semibold cursor-pointer"
                    style={{
                      background: "var(--teal-light)",
                      color: "var(--teal)",
                      border: "0.5px solid rgba(26,122,106,0.2)",
                      fontFamily: "inherit",
                    }}
                  >
                    👍 Ja, dit helpt
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[40px] text-sm font-semibold cursor-pointer"
                    style={{
                      background: "#fff",
                      color: "var(--muted)",
                      border: "0.5px solid var(--border)",
                      fontFamily: "inherit",
                    }}
                  >
                    👎 Niet echt
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">

              {/* Related articles */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <h3
                  className="text-[13px] font-bold uppercase tracking-[1px] mb-4"
                  style={{ color: "var(--teal)" }}
                >
                  Gerelateerde artikelen
                </h3>
                <div className="space-y-1">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/helpdesk/${rel.slug}`}
                      className="no-underline group block"
                    >
                      <div
                        className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-[var(--teal-light)] transition-colors"
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{rel.categoryIcon}</span>
                        <div>
                          <div
                            className="text-[13px] font-medium leading-snug"
                            style={{ color: "var(--dark)" }}
                          >
                            {rel.title}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                            {rel.category}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact support card */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--dark)" }}
              >
                <div className="text-2xl mb-3">✉️</div>
                <h3
                  className="text-[15px] font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Nog vragen?
                </h3>
                <p
                  className="text-[12px] mb-4 leading-[1.6]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Ons team staat klaar op werkdagen van 09:00 – 17:30.
                </p>
                <a
                  href="mailto:support@caredin.nl"
                  className="inline-flex px-4 py-2.5 rounded-[40px] text-sm font-semibold no-underline text-white"
                  style={{ background: "var(--teal)" }}
                >
                  Contact opnemen →
                </a>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {/* Inline styles for article body */}
      <style>{`
        .helpdesk-body h2 {
          font-family: var(--font-fraunces);
          font-size: 18px;
          font-weight: 700;
          color: var(--dark);
          margin-top: 2rem;
          margin-bottom: 0.6rem;
          letter-spacing: -0.2px;
          line-height: 1.3;
        }
        .helpdesk-body p {
          margin-bottom: 0.9rem;
          color: var(--text);
        }
        .helpdesk-body ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .helpdesk-body ul li {
          margin-bottom: 0.45rem;
          color: var(--text);
        }
        .helpdesk-body strong {
          font-weight: 700;
          color: var(--dark);
        }
        .helpdesk-body h2:first-child {
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
            <Link
              href="/privacy"
              className="text-[12px] no-underline"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Privacy
            </Link>
            <Link
              href="/voorwaarden"
              className="text-[12px] no-underline"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Voorwaarden
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
