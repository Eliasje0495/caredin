import Link from "next/link";
import { Nav } from "@/components/Nav";

const BENEFITS = [
  {
    icon: "📅",
    title: "Jij bepaalt je rooster",
    text: "Geen vaste diensten, geen verplichte beschikbaarheid. Meld je aan voor de shifts die passen bij jouw leven — niet andersom.",
  },
  {
    icon: "🏠",
    title: "Werk dicht bij huis",
    text: "Filter op locatie en reistijd. Werk in jouw buurt, bespaar reistijd en houd meer energie over voor wat echt telt.",
  },
  {
    icon: "⏸️",
    title: "Pauze nemen wanneer jij wilt",
    text: "Ga een maand minder werken, neem vakantie of zorg voor een familielid. Je account staat altijd klaar als jij er weer aan toe bent.",
  },
  {
    icon: "💸",
    title: "Minder werken, meer verdienen",
    text: "Geen bureau die 25% inhoudt. Jij stelt je tarief in. Soms betekent minder uren werken hetzelfde of meer verdienen.",
  },
  {
    icon: "🧘",
    title: "Mentaal welzijn telt",
    text: "Burn-out in de zorg is een reëel probleem. Wij bouwen tools waarmee je je werkdruk bewust kunt beheren en op tijd kunt afschalen.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Werk en gezin combineren",
    text: "Ouders, mantelzorgers, studenten — CaredIn past bij jou. Plan shifts rondom schooltijden, zorgtaken of je eigen studie.",
  },
];

const STATS = [
  { num: "68%", label: "Professionals werkt liever flexibel" },
  { num: "3 op 5", label: "Zorgwerkers heeft last van werkstress" },
  { num: "€0", label: "Extra kosten voor flexibiliteit" },
  { num: "100%", label: "Jij bepaalt je agenda" },
];

export default function WerkLeven() {
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
            Werk & leven
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Werk dat past<br />bij jouw leven.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            In de zorg is de werkdruk hoog en de balans tussen werk en privé vaak zoek. CaredIn
            geeft je de controle terug. Werk wanneer het jou uitkomt, verdien wat je verdient en
            houd ruimte voor alles wat buiten het werk ook telt.
          </p>

          <div className="flex gap-4">
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Begin flexibel werken →
            </Link>
            <Link
              href="/onze-visie-op-werk"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Onze visie op werk →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-12 py-6" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-4">
          {STATS.map((s) => (
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

          {/* Balans uitgelegd */}
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
                Waarom het belangrijk is
              </div>
              <h2
                className="text-[36px] font-bold tracking-[-0.5px] mb-4"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
              >
                De zorg heeft een burn-outprobleem. Dat lossen we samen op.
              </h2>
              <p className="text-sm leading-[1.8] mb-4" style={{ color: "var(--muted)" }}>
                Drie op de vijf zorgprofessionals ervaart werkstress. Overuren, te weinig grip op
                het rooster en een gevoel van onmacht zijn de voornaamste oorzaken. Traditionele
                uitzendbureaus lossen dit niet op — ze versterken het zelfs.
              </p>
              <p className="text-sm leading-[1.8]" style={{ color: "var(--muted)" }}>
                CaredIn is anders. Geen minimale beschikbaarheid, geen verplichte shifts. Jij
                bepaalt je agenda, en daarmee je eigen welzijn.
              </p>
            </div>
            <div className="space-y-4">
              {[
                ["Traditioneel uitzendbureau", "Vaste beschikbaarheidseis", "❌"],
                ["Traditioneel uitzendbureau", "Rooster bepaald door bureau", "❌"],
                ["Traditioneel uitzendbureau", "Uitbetaling na 30–60 dagen", "❌"],
                ["CaredIn", "Jij bepaalt wanneer je werkt", "✓"],
                ["CaredIn", "Uitbetaling binnen 48 uur", "✓"],
                ["CaredIn", "Geen minimale beschikbaarheid", "✓"],
              ]
                .filter((_, i) => i >= 3)
                .map(([, label, icon]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl px-5 py-3.5 bg-white"
                    style={{ border: "0.5px solid var(--border)" }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "var(--teal)", color: "white" }}
                    >
                      {icon}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                      {label}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Benefits grid */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Wat CaredIn biedt
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Meer leven. Niet minder werken.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Flexibiliteit is geen luxe — het is een basisrecht voor iedereen in de zorg.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {b.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                        {b.title}
                      </div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                        {b.text}
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
                Klaar om te beginnen?
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Werk wanneer het jou past. Verdien wat je verdient.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Meer dan 4.200 professionals kozen al voor flexibel werken via CaredIn.
                Aanmelden is gratis en duurt minder dan 5 minuten.
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
                  href="/diensten"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Diensten bekijken
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
