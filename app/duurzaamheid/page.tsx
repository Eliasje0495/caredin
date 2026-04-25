import Link from "next/link";
import { Nav } from "@/components/Nav";

const PILLARS = [
  {
    icon: "🌱",
    title: "Minder papier, meer digitaal",
    text: "Contracten, urenbriefjes, facturen — alles digitaal. Geen gedrukte rapporten, geen post heen en weer. CaredIn elimineert tonnen papierverbruik in de zorgsector.",
  },
  {
    icon: "🚲",
    title: "Minder pendelen, betere match",
    text: "Door professionals te matchen op locatie reduceren we gemiddelde reisafstanden. Minder kilometers betekent minder CO₂-uitstoot per gewerkt uur.",
  },
  {
    icon: "☁️",
    title: "Groene infrastructuur",
    text: "Onze servers draaien op Vercel's infrastructuur die via certificaten 100% hernieuwbare energie inzet voor datacenters in Europa.",
  },
  {
    icon: "🔄",
    title: "Langer in de zorg blijven",
    text: "Door burn-out te verminderen via flexibel werken, blijven professionals langer actief. Minder verloop = minder recruitment = minder verspilling van mensen en middelen.",
  },
  {
    icon: "📊",
    title: "Transparante rapportage",
    text: "We publiceren jaarlijks onze impact op papierverbruik, reiskilometers en platformenergieverbruik. Geen greenwashing — gewoon cijfers.",
  },
  {
    icon: "🏙️",
    title: "Lokale economie versterken",
    text: "Door professionals in hun eigen regio te laten werken, blijft inkomen lokaal circuleren. Dat versterkt lokale gemeenschappen en verlaagt vervoerskosten.",
  },
];

const GOALS = [
  {
    year: "2025",
    title: "100% digitale documentenstroom",
    done: true,
    description: "Alle contracten, urenbriefjes en facturen volledig digitaal verwerkt.",
  },
  {
    year: "2026",
    title: "CO₂-inzicht per booking",
    done: false,
    description: "Professionals en instellingen zien de geschatte CO₂-impact van een dienst op basis van reisafstand.",
  },
  {
    year: "2027",
    title: "Klimaatneutrale operaties",
    done: false,
    description: "Volledige compensatie van onze directe en indirecte emissies via gecertificeerde projecten.",
  },
  {
    year: "2028",
    title: "Impact rapport publiek",
    done: false,
    description: "Jaarlijks openbaar duurzaamheidsrapport met externe verificatie.",
  },
];

const STATS = [
  { num: "0", label: "Gedrukte contracten" },
  { num: "–28%", label: "Gem. reisafstand vs. bureau" },
  { num: "100%", label: "Digitale facturatie" },
  { num: "2027", label: "Doelstelling klimaatneutraal" },
];

export default function Duurzaamheid() {
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
            Duurzaamheid
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Goede zorg is ook<br />duurzame zorg.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            De keuzes die wij maken in hoe we het platform bouwen en beheren hebben impact —
            op mensen, op de samenleving en op het klimaat. Hier laten we zien wat we doen en
            wat we nog willen bereiken.
          </p>

          <div className="flex gap-4">
            <Link
              href="/sociale-impact"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Onze sociale impact →
            </Link>
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Aanmelden →
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

          {/* Pillars */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Hoe we bijdragen
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Duurzaamheid zit in ons model, niet alleen in onze woorden.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Door slimmer te matchen, te digitaliseren en mensen langer in de zorg te houden,
              heeft CaredIn een structureel lagere impact dan traditionele bureaus.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {PILLARS.map((p) => (
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

          {/* Roadmap */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Duurzaamheidsroadmap
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-10"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Wat we hebben gedaan. Wat we gaan doen.
            </h2>

            <div className="space-y-4">
              {GOALS.map((goal) => (
                <div
                  key={goal.year}
                  className="rounded-2xl p-6 bg-white flex items-start gap-6"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{
                      background: goal.done ? "var(--teal)" : "var(--teal-light)",
                      color: goal.done ? "white" : "var(--teal)",
                    }}
                  >
                    {goal.done ? "✓" : goal.year}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-base font-bold" style={{ color: "var(--dark)" }}>
                        {goal.title}
                      </div>
                      {goal.done && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-0.5 rounded-full"
                          style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                        >
                          Bereikt
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-[1.6]" style={{ color: "var(--muted)" }}>
                      {goal.description}
                    </p>
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
                Doe mee
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Elke professional die lokaal werkt, helpt de planeet een beetje.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Door te kiezen voor CaredIn kies je niet alleen voor jezelf — je kiest voor
                een eerlijker en duurzamer zorgsysteem voor iedereen.
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
                  href="/sociale-impact"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Sociale impact
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
