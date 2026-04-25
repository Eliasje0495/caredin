import Link from "next/link";
import { Nav } from "@/components/Nav";

const PROGRAMS = [
  {
    tag: "Voor professionals",
    icon: "🚀",
    title: "CaredIn Kickstart",
    description:
      "Ben je net geregistreerd of herintreder? Het Kickstart-programma begeleidt je de eerste stappen op het platform. Van profieloptimalisatie tot je eerste geboekte dienst.",
    items: ["Persoonlijke onboarding", "Profiel-review door ons team", "Eerste 3 diensten met ondersteuning", "Gratis"],
    cta: "Aanmelden voor Kickstart",
    href: "/registreren?rol=freeflexer&programma=kickstart",
  },
  {
    tag: "Voor professionals",
    icon: "📈",
    title: "CaredIn Pro",
    description:
      "Werk je al actief via CaredIn en wil je meer verdienen, meer boekingen en meer controle? Het Pro-programma geeft je toegang tot premiumfuncties en prioriteitsmatching.",
    items: ["Prioriteitsweergave bij instellingen", "Geavanceerde beschikbaarheidsplanning", "Maandelijkse verdiensteanalyse", "€9,– / maand"],
    cta: "Upgraden naar Pro",
    href: "/dashboard?upgrade=pro",
  },
  {
    tag: "Voor instellingen",
    icon: "🏥",
    title: "Instelling Onboarding",
    description:
      "Wij helpen jouw zorgorganisatie stap voor stap aan de slag met CaredIn. Van eerste dienst plaatsen tot geautomatiseerde urenregistratie en facturatie.",
    items: ["Dedicated accountbegeleiding", "Koppeling met HR-systeem", "Training voor planners", "Gratis voor new joiners"],
    cta: "Contact voor onboarding",
    href: "/registreren?rol=bedrijf",
  },
  {
    tag: "Voor instellingen",
    icon: "🔗",
    title: "API & Integraties",
    description:
      "Integreer CaredIn rechtstreeks in je bestaande planningssoftware. Onze API maakt twee-weg-synchronisatie mogelijk met de meeste HR- en planningssystemen.",
    items: ["REST API toegang", "Webhooks voor real-time updates", "Technische documentatie", "Op aanvraag"],
    cta: "Meer over integraties",
    href: "/helpdesk?onderwerp=api",
  },
  {
    tag: "Samen",
    icon: "🎓",
    title: "CaredIn Academy",
    description:
      "Gratis online leermodules voor professionals over zelfstandig ondernemerschap, belastingen, registraties en loopbaanplanning in de zorg.",
    items: ["Video's en artikelen", "Belastingtips voor ZZP'ers", "Registratiebegeleiding", "100% gratis"],
    cta: "Naar de Academy",
    href: "/helpdesk",
  },
  {
    tag: "Samen",
    icon: "🤝",
    title: "CaredIn Community",
    description:
      "Verbind met andere zorgprofessionals. Wissel ervaringen uit, geef en ontvang advies, en bouw je netwerk — zonder dat het ten koste gaat van je onafhankelijkheid.",
    items: ["Besloten community-forum", "Regionale meetups", "Expert Q&A sessies", "Gratis voor gebruikers"],
    cta: "Naar de community",
    href: "/community",
  },
];

export default function Programmas() {
  const forPros = PROGRAMS.filter((p) => p.tag === "Voor professionals");
  const forInstellingen = PROGRAMS.filter((p) => p.tag === "Voor instellingen");
  const samen = PROGRAMS.filter((p) => p.tag === "Samen");

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
            Programma&apos;s
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Meer uit CaredIn<br />halen, voor iedereen.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            Of je nu net begint, al jaren werkt of een instelling runt — wij hebben
            programma&apos;s die je helpen het maximale uit het platform te halen.
          </p>

          <div className="flex gap-4">
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Begin gratis →
            </Link>
            <Link
              href="/helpdesk"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Hulp nodig? →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-20">

          {/* Voor professionals */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Voor professionals
            </div>
            <h2
              className="text-[32px] font-bold tracking-[-0.5px] mb-8"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Groei op jouw tempo.
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {forPros.map((p) => (
                <ProgramCard key={p.title} program={p} />
              ))}
            </div>
          </div>

          {/* Voor instellingen */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Voor instellingen
            </div>
            <h2
              className="text-[32px] font-bold tracking-[-0.5px] mb-8"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Vliegende start voor jouw organisatie.
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {forInstellingen.map((p) => (
                <ProgramCard key={p.title} program={p} />
              ))}
            </div>
          </div>

          {/* Samen */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Samen
            </div>
            <h2
              className="text-[32px] font-bold tracking-[-0.5px] mb-8"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Leren en verbinden.
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {samen.map((p) => (
                <ProgramCard key={p.title} program={p} />
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
                Niet zeker welk programma bij je past?
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Wij helpen je het juiste programma te kiezen.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Neem contact op met ons team. We nemen de tijd om te begrijpen wat je nodig hebt
                en adviseren je welk programma het beste bij jou past.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/helpdesk"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}
                >
                  Contact opnemen →
                </Link>
                <Link
                  href="/registreren?rol=freeflexer"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Direct beginnen
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

function ProgramCard({ program }: { program: typeof PROGRAMS[0] }) {
  return (
    <div
      className="rounded-2xl p-8 bg-white flex flex-col"
      style={{ border: "0.5px solid var(--border)" }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "var(--teal-light)" }}
        >
          {program.icon}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[1px] mb-1" style={{ color: "var(--teal)" }}>
            {program.tag}
          </div>
          <div className="text-lg font-bold" style={{ color: "var(--dark)" }}>
            {program.title}
          </div>
        </div>
      </div>

      <p className="text-sm leading-[1.7] mb-5 flex-1" style={{ color: "var(--muted)" }}>
        {program.description}
      </p>

      <ul className="space-y-2 mb-6">
        {program.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: "var(--teal)", color: "white" }}
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={program.href}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
        style={{ background: "var(--teal)" }}
      >
        {program.cta} →
      </Link>
    </div>
  );
}
