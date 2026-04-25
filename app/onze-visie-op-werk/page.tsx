import Link from "next/link";
import { Nav } from "@/components/Nav";

const PRINCIPLES = [
  {
    icon: "🧭",
    title: "Autonomie boven alles",
    text: "Wij geloven dat de beste zorgprofessional een professional is die zelf kiest wanneer, waar en voor wie hij werkt. Geen opgelegde roosters, geen verplichte beschikbaarheid.",
  },
  {
    icon: "⚖️",
    title: "Eerlijke beloning",
    text: "Zorgprofessionals verdienen wat ze verdienen. Geen tussenpersoon die 25% inhoudt. Jij bepaalt je tarief — wij zorgen dat het op tijd bij je aankomt.",
  },
  {
    icon: "🤝",
    title: "Verbinding zonder bureaucratie",
    text: "De match tussen professional en instelling moet snel, eenvoudig en transparant zijn. Geen stapels papier, geen wachttijden, geen onduidelijke procedures.",
  },
  {
    icon: "📈",
    title: "Groei op jouw tempo",
    text: "Of je nu net begint of al twintig jaar in de zorg werkt — CaredIn past zich aan jou aan. Meer werken als het uitkomt, minder als je rust nodig hebt.",
  },
  {
    icon: "🏥",
    title: "Kwaliteit als standaard",
    text: "Geverifieerde registraties zijn geen extra's — ze zijn de basis. Instellingen mogen erop rekenen dat iedere professional die ze via ons boeken, gekwalificeerd is.",
  },
  {
    icon: "🔮",
    title: "De zorg van morgen",
    text: "De zorgsector verandert snel. Wij bouwen een platform dat meegroeiert: flexibel, digitaal en gebouwd voor de professional van de toekomst.",
  },
];

const PILLARS = [
  {
    number: "01",
    title: "Flexibiliteit",
    description:
      "Werk is geen verplichting — het is een keuze. Wij geven zorgprofessionals de tools om werk te plannen op hun eigen voorwaarden, zonder in te leveren op inkomen of kwaliteit.",
  },
  {
    number: "02",
    title: "Transparantie",
    description:
      "Geen verborgen kosten, geen onduidelijke contracten. Elk tarief, elke vergoeding en elke voorwaarde is zichtbaar voor alle partijen.",
  },
  {
    number: "03",
    title: "Vertrouwen",
    description:
      "Zorginstellingen verdienen zekerheid. Professionals verdienen respect. Wij bouwen dat vertrouwen op door verificatie, eerlijkheid en snelle communicatie.",
  },
];

export default function OnzeVisieOpWerk() {
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
            Onze visie op werk
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Zorg verlenen moet<br />ook goed voelen.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            De zorgsector draait op mensen. Toch worden die mensen te vaak behandeld als een
            schakelbare resource. CaredIn is gebouwd vanuit een andere overtuiging: een tevreden
            professional levert betere zorg. En betere zorg begint met eerlijk werk.
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
              href="/onze-belofte"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Onze belofte lezen →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-24">

          {/* Three pillars */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Waar wij voor staan
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-12"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Drie pijlers. Één missie.
            </h2>

            <div className="grid grid-cols-3 gap-6">
              {PILLARS.map((p) => (
                <div
                  key={p.number}
                  className="rounded-2xl p-8 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div
                    className="text-[42px] font-bold mb-4 leading-none"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-light)" }}
                  >
                    {p.number}
                  </div>
                  <div className="text-lg font-bold mb-3" style={{ color: "var(--dark)" }}>
                    {p.title}
                  </div>
                  <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Principles grid */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Onze principes
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Wat we geloven over werk in de zorg.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Dit zijn de principes die elke beslissing sturen die wij nemen — van product tot beleid.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                        {p.title}
                      </div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                        {p.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote block */}
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
                Onze belofte
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Wij bouwen niet voor het systeem. Wij bouwen voor de mensen die het systeem draaiende houden.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Zorgprofessionals zijn de ruggengraat van Nederland. Ze verdienen een platform dat
                eerlijk is, snel werkt en hen serieus neemt. Dat is precies wat wij bouwen.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/registreren?rol=freeflexer"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}
                >
                  Begin vandaag →
                </Link>
                <Link
                  href="/sociale-impact"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Onze sociale impact
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
