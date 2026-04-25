import Link from "next/link";
import { Nav } from "@/components/Nav";

const INITIATIVES = [
  {
    icon: "🚪",
    title: "Lage instapdrempel",
    text: "Aanmelden is gratis. Geen lidmaatschapskosten, geen inschrijfgeld. Iedereen met een geldige registratie kan direct aan de slag.",
  },
  {
    icon: "👩‍🔬",
    title: "Gelijke kansen voor zij-instromers",
    text: "Ben je nieuw in de zorg? CaredIn verlaagt de drempel. Je wordt beoordeeld op je kwalificaties, niet op je netwerk of werkverleden bij een bureau.",
  },
  {
    icon: "🕌",
    title: "Culturele diversiteit verwelkomd",
    text: "Ons platform is beschikbaar in meerdere talen en ondersteunt professionals uit diverse achtergronden. Zorg heeft geen nationaliteit.",
  },
  {
    icon: "♿",
    title: "Toegankelijkheid",
    text: "Professionals met een beperking kunnen via CaredIn werken op voorwaarden die bij hen passen. Instellingen geven zelf aan welke aanpassingen mogelijk zijn.",
  },
  {
    icon: "👴",
    title: "Geen leeftijdsdiscriminatie",
    text: "Of je net bent afgestudeerd of al dertig jaar in de zorg werkt — op CaredIn word je geboekt op basis van je kwalificaties en beoordelingen.",
  },
  {
    icon: "🏠",
    title: "Werken vanuit je eigen regio",
    text: "Professionals uit kleinere gemeenten of minder stedelijke regio's vinden via CaredIn ook werk dicht bij huis, zonder gedwongen te pendelen.",
  },
];

const COMMITMENTS = [
  {
    title: "Transparante tarieven voor iedereen",
    description: "Alle tarieven zijn zichtbaar op het platform. Er is geen informatieasymmetrie — een nieuwe professional ziet exact hetzelfde als een ervaren professional.",
  },
  {
    title: "Geen discriminerende filters",
    description: "Instellingen kunnen filteren op kwalificaties en locatie, maar niet op geslacht, leeftijd, afkomst of andere beschermde kenmerken.",
  },
  {
    title: "Anonieme beoordeling bij instroom",
    description: "Tijdens de verificatieprocedure worden persoonlijke kenmerken niet meegewogen. Kwalificaties en registraties zijn leidend.",
  },
  {
    title: "Klachtenmechanisme",
    description: "Professionals die discriminatie ervaren, kunnen dit melden via ons helpdesk. Wij nemen elke melding serieus en handelen snel.",
  },
];

export default function GelijkeKansen() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="px-12 py-20 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div
          className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 70%)" }}
        />

        <div className="max-w-5xl mx-auto relative">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-8"
            style={{
              background: "rgba(93,184,184,0.12)",
              color: "var(--teal-mid)",
              border: "0.5px solid rgba(93,184,164,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Gelijke kansen
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Iedereen verdient<br />een eerlijke kans.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            De zorg heeft iedereen nodig. CaredIn bouwt een platform waar kwalificaties tellen —
            niet je achtergrond, leeftijd, geslacht of netwerk. Eerlijk werk begint met gelijke toegang.
          </p>

          <div className="flex gap-4">
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Aanmelden als professional →
            </Link>
            <Link
              href="/sociale-impact"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Onze sociale impact →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-24">

          {/* Onze aanpak */}
          <div className="grid grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
                Onze aanpak
              </div>
              <h2
                className="text-[36px] font-bold tracking-[-0.5px] mb-4"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
              >
                Kwalificaties boven connecties.
              </h2>
              <p className="text-sm leading-[1.8] mb-4" style={{ color: "var(--muted)" }}>
                Traditionele uitzendbureaus werken via netwerken en persoonlijke relaties. Wie het
                bureau kent, krijgt de beste opdrachten. Wij geloven dat dit systeem fundamenteel
                oneerlijk is.
              </p>
              <p className="text-sm leading-[1.8]" style={{ color: "var(--muted)" }}>
                Op CaredIn wordt elke professional geverifieerd op basis van objectieve criteria:
                geldig BIG-register, SKJ-registratie of vergelijkbare kwalificatie. Daarna is
                iedereen gelijk.
              </p>
            </div>
            <div className="space-y-3">
              {COMMITMENTS.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-5 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="text-sm font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                    {c.title}
                  </div>
                  <p className="text-xs leading-[1.65]" style={{ color: "var(--muted)" }}>
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Initiatieven */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Hoe we het waarmaken
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Zes initiatieven voor inclusief werken.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Gelijke kansen zijn geen abstracte waarde voor ons — het zijn concrete keuzes in hoe
              we ons platform ontwerpen en beheren.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {INITIATIVES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                        {item.title}
                      </div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{ background: "var(--dark)" }}
          >
            <div
              className="absolute top-[-60px] right-[-60px] w-[350px] h-[350px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }}
            />
            <div className="relative max-w-2xl">
              <div
                className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
                style={{ color: "var(--teal-mid)" }}
              >
                Iedereen welkom
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                De zorg heeft iedere goede professional nodig. Jij ook.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Of je nou net bent afgestudeerd, herintreder bent of al jaren in de sector werkt —
                als je gekwalificeerd bent, heb je een plek op CaredIn.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/registreren?rol=freeflexer"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}
                >
                  Gratis aanmelden →
                </Link>
                <Link
                  href="/programmas"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Onze programma&apos;s
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-12 py-12 grid gap-10"
        style={{ background: "var(--dark)", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
      >
        <div>
          <div
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
          >
            Caredin
          </div>
          <div
            className="text-[13px] leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.35)", maxWidth: "200px" }}
          >
            Het flexibele zorgplatform dat professionals en instellingen verbindt.
          </div>
        </div>
        {[
          { heading: "Professionals", links: ["Diensten zoeken", "Je verdiensten", "Registraties", "Onze belofte"] },
          { heading: "Instellingen", links: ["Professionals vinden", "Tarieven", "Sectoren", "Integraties"] },
          { heading: "CaredIn", links: ["Ons verhaal", "Vacatures", "Nieuwsroom", "Contact"] },
        ].map((col) => (
          <div key={col.heading}>
            <h4
              className="text-xs font-bold uppercase tracking-[1px] mb-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {col.heading}
            </h4>
            <ul className="list-none space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] no-underline" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </>
  );
}
