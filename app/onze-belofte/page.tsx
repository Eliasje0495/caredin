import Link from "next/link";
import { Nav } from "@/components/Nav";

const PROFESSIONAL_GUARANTEES = [
  {
    icon: "💶",
    title: "Jij bepaalt je tarief",
    text: "Stel je eigen uurtarief in. Geen cap, geen marge die verdwijnt naar een bureau. Wat je verdient, ontvang je.",
  },
  {
    icon: "⚡",
    title: "Uitbetaling binnen 48 uur",
    text: "Zodra een instelling jouw uren goedkeurt, wordt het bedrag automatisch overgemaakt. Geen facturen, geen wachten.",
  },
  {
    icon: "✅",
    title: "BIG & SKJ verificatie in 24 uur",
    text: "Je registratie wordt geverifieerd via het officiële BIG- of SKJ-register. Instellingen zien direct dat jij gekwalificeerd bent.",
  },
  {
    icon: "🗓",
    title: "Jij kiest wanneer je werkt",
    text: "Geen verplichte beschikbaarheid, geen minimum uren. Meld je aan voor de diensten die jij wilt — wanneer jij wilt.",
  },
  {
    icon: "🔒",
    title: "Veilige gegevensverwerking",
    text: "Je identiteitsbewijs en registraties worden versleuteld opgeslagen en nooit gedeeld met derden zonder jouw toestemming.",
  },
  {
    icon: "🆓",
    title: "Gratis aanmelden, altijd",
    text: "Geen startkosten, geen maandelijkse bijdrage. CaredIn verdient alleen een platformbijdrage wanneer jij werkt.",
  },
];

const EMPLOYER_GUARANTEES = [
  {
    icon: "🩺",
    title: "Alleen geverifieerde professionals",
    text: "Elk profiel is gekoppeld aan het BIG- of SKJ-register. Je plaatst nooit een dienst voor iemand zonder geldige registratie.",
  },
  {
    icon: "⏱",
    title: "Dienst live in 2 minuten",
    text: "Geen accountmanager, geen e-mails. Vul de details in, kies je tarief en je dienst is direct zichtbaar voor duizenden professionals.",
  },
  {
    icon: "💳",
    title: "Transparante kosten: €3,– per uur",
    text: "Geen verborgen kosten, geen commissie op het tarief van de professional. Één vast platformbedrag per gewerkt uur.",
  },
  {
    icon: "📋",
    title: "Automatische uren­registratie",
    text: "Professionals checken in en uit via de app. Jij keurt goed met één klik. Geen Excel, geen handmatige tijdregistratie.",
  },
  {
    icon: "🏛",
    title: "KvK-verificatie inbegrepen",
    text: "Alle ZZP'ers worden geverifieerd via het KvK-register. Je weet altijd met wie je contractueel een overeenkomst sluit.",
  },
  {
    icon: "📞",
    title: "Persoonlijke support",
    text: "Heb je een vraag of probleem? Ons team staat klaar. Geen chatbot, geen ticket-systeem — gewoon mensen die helpen.",
  },
];

const STATS = [
  { num: "4.200+", label: "Geverifieerde professionals" },
  { num: "€3,–",   label: "Platformbijdrage per uur" },
  { num: "48 uur", label: "Uitbetaling na goedkeuring" },
  { num: "24 uur", label: "BIG/SKJ verificatie" },
  { num: "< 2 min", label: "Dienst plaatsen" },
  { num: "0%",     label: "Bureaumarge op je tarief" },
];

export default function OnzeBelofte() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="px-12 py-20 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-8"
            style={{ background: "rgba(93,184,164,0.12)", color: "var(--teal-mid)", border: "0.5px solid rgba(93,184,164,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Onze belofte
          </div>

          <h1 className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}>
            Eerlijk. Transparant.<br />Zonder bureau ertussen.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            Temper belooft veel. Wij doen het gewoon. Geen fine print, geen verstopte kosten,
            geen algoritmische drempels. CaredIn is gebouwd op één principe: professionals
            verdienen wat ze verdienen, instellingen betalen wat eerlijk is.
          </p>

          <div className="flex gap-4">
            <Link href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Aanmelden als professional →
            </Link>
            <Link href="/registreren?rol=bedrijf"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
              Aanmelden als instelling →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-12 py-6" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[22px] font-bold text-white" style={{ fontFamily: "var(--font-fraunces)" }}>{s.num}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-24">

          {/* Versus Temper */}
          <div className="rounded-3xl overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            <div className="grid grid-cols-3 text-[11px] font-bold uppercase tracking-[1.2px] px-8 py-4 bg-white"
              style={{ borderBottom: "0.5px solid var(--border)", color: "var(--muted)" }}>
              <span>Wat wij beloven</span>
              <span className="text-center" style={{ color: "var(--teal)" }}>CaredIn</span>
              <span className="text-right">Traditioneel bureau</span>
            </div>
            {[
              ["Bureaumarge op je tarief",         "0%",           "20–35%"],
              ["Uitbetaling na goedkeuring",        "48 uur",       "30–60 dagen"],
              ["BIG/SKJ verificatie",               "Automatisch",  "Handmatig"],
              ["Dienst plaatsen",                   "< 2 minuten",  "Telefonisch"],
              ["Kosten voor professional",          "Gratis",       "Inschrijfkosten"],
              ["Transparantie tarieven",            "Volledig",     "Verborgen"],
            ].map(([label, ours, theirs], i) => (
              <div key={label} className="grid grid-cols-3 items-center px-8 py-4 bg-white"
                style={{ borderBottom: i < 5 ? "0.5px solid var(--border)" : "none" }}>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</span>
                <span className="text-sm font-bold text-center" style={{ color: "var(--teal)" }}>✓ {ours}</span>
                <span className="text-sm text-right" style={{ color: "var(--muted)" }}>✗ {theirs}</span>
              </div>
            ))}
          </div>

          {/* Voor professionals */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Voor professionals</div>
            <h2 className="text-[36px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Jouw werk, jouw voorwaarden.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Geen uitzendbureau dat 30% van jouw tarief inhoudt. Geen verplichte beschikbaarheid.
              Geen wachten op je geld. Dit zijn onze harde beloftes aan jou.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {PROFESSIONAL_GUARANTEES.map((g, i) => (
                <div key={g.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}>
                      {g.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>{g.title}</div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>{g.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/registreren?rol=freeflexer"
                className="inline-flex px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
                style={{ background: "var(--teal)" }}>
                Aanmelden als professional →
              </Link>
            </div>
          </div>

          {/* Voor instellingen */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Voor zorginstellingen</div>
            <h2 className="text-[36px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Zeker weten met wie je werkt.
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              Geen onbekenden, geen papierwerk, geen verrassingen op de factuur.
              Elke professional is geverifieerd voordat je ze ziet.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {EMPLOYER_GUARANTEES.map((g) => (
                <div key={g.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}>
                      {g.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>{g.title}</div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>{g.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/registreren?rol=bedrijf"
                className="inline-flex px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
                style={{ background: "var(--teal)" }}>
                Aanmelden als instelling →
              </Link>
            </div>
          </div>

          {/* Commitment block */}
          <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: "var(--dark)" }}>
            <div className="absolute top-[-60px] right-[-60px] w-[350px] h-[350px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }} />
            <div className="relative max-w-2xl">
              <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4" style={{ color: "var(--teal-mid)" }}>
                Onze commitment
              </div>
              <h2 className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Als wij onze belofte niet nakomen, hoor je het van ons.
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                CaredIn is een jong platform met één doel: de zorg eerlijker maken.
                We publiceren onze gemiddelde uitbetalingstijden, onze verificatietijden
                en onze kosten. Geen fine print. Als er iets niet klopt, neem contact met ons op —
                we lossen het op.
              </p>
              <div className="flex gap-4">
                <Link href="/over-ons"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}>
                  Over CaredIn →
                </Link>
                <Link href="/contact"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                  Contact opnemen
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-12 py-12 grid gap-10" style={{ background: "var(--dark)", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
        <div>
          <div className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>Caredin</div>
          <div className="text-[13px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.35)", maxWidth: "200px" }}>
            Het flexibele zorgplatform dat professionals en instellingen verbindt.
          </div>
        </div>
        {[
          { heading: "Professionals", links: ["Diensten zoeken", "Je verdiensten", "BIG & SKJ", "Onze belofte"] },
          { heading: "Instellingen",  links: ["Professionals vinden", "Tarieven", "Sectoren", "Integraties"] },
          { heading: "CaredIn",       links: ["Ons verhaal", "Vacatures", "Nieuwsroom", "Contact"] },
        ].map((col) => (
          <div key={col.heading}>
            <h4 className="text-xs font-bold uppercase tracking-[1px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.heading}</h4>
            <ul className="list-none space-y-2.5">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="text-[13px] no-underline" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </>
  );
}
