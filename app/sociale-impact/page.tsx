import Link from "next/link";
import { Nav } from "@/components/Nav";

const IMPACT_AREAS = [
  {
    icon: "🏥",
    title: "Betere bezetting in de zorg",
    text: "Elke professional die via CaredIn werkt, vult een dienst die anders onbezet zou blijven. Dat betekent betere zorg voor patiënten en minder overbelasting voor vaste medewerkers.",
  },
  {
    icon: "💶",
    title: "Eerlijker inkomen",
    text: "Door bemiddelingsmarges te elimineren ontvangen professionals gemiddeld 20–30% meer dan via traditionele bureaus. Dat is directe koopkrachtverbetering voor een groep die het hard nodig heeft.",
  },
  {
    icon: "🌍",
    title: "Inclusiever arbeidsmarkt",
    text: "CaredIn verlaagt de drempel voor zij-instromers, herintreders en professionals met zorgtaken thuis. Flexibele uren maken de zorg toegankelijker als werkgever.",
  },
  {
    icon: "📉",
    title: "Minder verloop",
    text: "Professionals die controle hebben over hun eigen agenda, zijn gelukkiger en blijven langer in de zorg. Minder verloop betekent betere continuïteit van zorg.",
  },
  {
    icon: "🤝",
    title: "Lokale gemeenschappen",
    text: "Door locatiefilters te stimuleren, werken professionals vaker in hun eigen buurt. Dat versterkt de band tussen zorgverlener en gemeenschap.",
  },
  {
    icon: "📊",
    title: "Transparantie in de sector",
    text: "Wij publiceren openbare data over tarieven, bezettingsgraad en betalingstijden. Dat helpt de sector zichzelf beter te begrijpen en te verbeteren.",
  },
];

const NUMBERS = [
  { num: "4.200+", label: "Actieve professionals" },
  { num: "850+", label: "Instellingen aangesloten" },
  { num: "€3,–", label: "Platformbijdrage per uur" },
  { num: "0%", label: "Marge op professioneel tarief" },
];

export default function SocialeImpact() {
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
              background: "rgba(93,184,164,0.12)",
              color: "var(--teal-mid)",
              border: "0.5px solid rgba(93,184,164,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Sociale impact
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Betere zorg begint<br />met eerlijk werk.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            CaredIn is meer dan een platform. Het is een beweging om de zorgsector structureel
            eerlijker te maken — voor professionals, voor instellingen en voor patiënten.
          </p>

          <div className="flex gap-4">
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Doe mee →
            </Link>
            <Link
              href="/duurzaamheid"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Onze duurzaamheid →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-12 py-6" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-4">
          {NUMBERS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-[22px] font-bold text-white"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {s.num}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-24">

          {/* Mission statement */}
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
                Onze missie
              </div>
              <h2
                className="text-[36px] font-bold tracking-[-0.5px] mb-4"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
              >
                Zorg eerlijker maken. Niet alleen efficiënter.
              </h2>
              <p className="text-sm leading-[1.8] mb-4" style={{ color: "var(--muted)" }}>
                Technologie in de zorg wordt vaak ingezet om kosten te drukken. Wij geloven dat
                technologie ook kan worden ingezet om mensen te empoweren. Een platform dat
                professionals meer verdienen geeft, instellingen minder laat betalen en de
                tussenlaag overbodig maakt.
              </p>
              <p className="text-sm leading-[1.8]" style={{ color: "var(--muted)" }}>
                Dat is onze definitie van sociale impact: geen liefdadigheid, maar structureel
                eerlijkere verhoudingen in een van de belangrijkste sectoren van Nederland.
              </p>
            </div>
            <div
              className="rounded-3xl p-8"
              style={{ background: "var(--teal-light)", border: "0.5px solid var(--border)" }}
            >
              <div className="space-y-5">
                {[
                  ["Professionals verdienen meer", "Geen marge op hun tarief. Wat ze verdienen, ontvangen ze."],
                  ["Instellingen betalen minder", "€3,– per uur platformbijdrage. Geen verborgen kosten."],
                  ["Patiënten krijgen betere zorg", "Tevreden professionals leveren betere zorg."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{ background: "var(--teal)", color: "white" }}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-1" style={{ color: "var(--dark)" }}>{title}</div>
                      <div className="text-xs leading-[1.6]" style={{ color: "var(--muted)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact areas */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Waar we impact maken
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Zes manieren waarop CaredIn de zorg verandert.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Impact meten we niet in woorden, maar in concrete veranderingen voor de mensen die
              elke dag in de zorg werken.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {IMPACT_AREAS.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {a.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                        {a.title}
                      </div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                        {a.text}
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
                Samen verder
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Elke professional die zich aanmeldt, maakt de zorg een stukje eerlijker.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Vertel het door. Meld je aan. Of neem contact op om te bespreken hoe jouw
                instelling kan bijdragen aan eerlijker zorgwerk.
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
                  href="/gelijke-kansen"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Gelijke kansen
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
