import Link from "next/link";
import { Nav } from "@/components/Nav";

const TOPICS = [
  {
    icon: "💶",
    title: "ZZP & Financiën",
    desc: "Uurtarieven, belasting, pensioen en facturatie",
    posts: 142,
    color: "#1E40AF",
    bg: "rgba(30,64,175,0.08)",
  },
  {
    icon: "🏥",
    title: "BIG & SKJ registratie",
    desc: "Vragen over registratie, herregistratie en verificatie",
    posts: 98,
    color: "var(--teal)",
    bg: "var(--teal-light)",
  },
  {
    icon: "⚖️",
    title: "Wet & Regelgeving",
    desc: "WTZa, AVG, DBA en andere wetgeving",
    posts: 67,
    color: "#B45309",
    bg: "rgba(180,83,9,0.08)",
  },
  {
    icon: "🩺",
    title: "Sectoren & Specialisaties",
    desc: "VVT, GGZ, jeugdzorg, ziekenhuis en meer",
    posts: 115,
    color: "#374151",
    bg: "rgba(55,65,81,0.07)",
  },
  {
    icon: "🌱",
    title: "Carrière & Ontwikkeling",
    desc: "Bijscholing, opleidingen en loopbaanadvies",
    posts: 54,
    color: "#065F46",
    bg: "rgba(6,95,70,0.08)",
  },
  {
    icon: "💬",
    title: "Ervaringen & Reviews",
    desc: "Reviews van instellingen, tips en waarschuwingen",
    posts: 203,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
];

const DISCUSSIONS = [
  {
    id: "1",
    title: "Hoe onderhandel je over je uurtarief met een zorginstelling?",
    category: "ZZP & Financiën",
    author: "Marieke V.",
    time: "2 uur geleden",
    replies: 18,
    views: 342,
    pinned: true,
  },
  {
    id: "2",
    title: "BIG-herregistratie 2026 — nieuwe eisen voor verpleegkundigen",
    category: "BIG & SKJ",
    author: "Thomas K.",
    time: "5 uur geleden",
    replies: 34,
    views: 891,
    pinned: true,
  },
  {
    id: "3",
    title: "Ervaring met Amstelring als flexinstelling?",
    category: "Ervaringen & Reviews",
    author: "Fatima E.",
    time: "gisteren",
    replies: 7,
    views: 156,
    pinned: false,
  },
  {
    id: "4",
    title: "Wat doe je als een instelling je uren niet wil goedkeuren?",
    category: "Wet & Regelgeving",
    author: "Jeroen B.",
    time: "gisteren",
    replies: 22,
    views: 478,
    pinned: false,
  },
  {
    id: "5",
    title: "GGZ als ZZP'er — hoe kom je aan je eerste opdracht?",
    category: "Sectoren & Specialisaties",
    author: "Priya N.",
    time: "2 dagen geleden",
    replies: 11,
    views: 267,
    pinned: false,
  },
  {
    id: "6",
    title: "Pensioen opbouwen als zzp'er in de zorg — wat doen jullie?",
    category: "ZZP & Financiën",
    author: "Sandra W.",
    time: "3 dagen geleden",
    replies: 29,
    views: 603,
    pinned: false,
  },
  {
    id: "7",
    title: "SKJ-registratie verlopen — hoe snel herregistreren?",
    category: "BIG & SKJ",
    author: "Ahmed A.",
    time: "4 dagen geleden",
    replies: 8,
    views: 194,
    pinned: false,
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  "ZZP & Financiën":        "#1E40AF",
  "BIG & SKJ":              "var(--teal)",
  "Wet & Regelgeving":      "#B45309",
  "Sectoren & Specialisaties": "#374151",
  "Ervaringen & Reviews":   "#7C3AED",
};

const MEMBERS = [
  { name: "Marieke V.",  role: "Verpleegkundige",     posts: 89,  badge: "Top bijdrager" },
  { name: "Thomas K.",   role: "GGZ Agoog",            posts: 67,  badge: "Expert BIG" },
  { name: "Priya N.",    role: "Persoonlijk Begeleider", posts: 54, badge: null },
  { name: "Sandra W.",   role: "Verzorgende IG",       posts: 48,  badge: null },
];

export default function CommunityPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="px-12 py-16 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-6"
            style={{ background: "rgba(93,184,164,0.12)", color: "var(--teal-mid)", border: "0.5px solid rgba(93,184,164,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Community
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[clamp(36px,4.5vw,62px)] font-bold text-white tracking-[-1.5px] leading-[1.05] mb-4"
                style={{ fontFamily: "var(--font-fraunces)", maxWidth: "600px" }}>
                De community voor zorgprofessionals.
              </h1>
              <p className="text-sm leading-[1.75] max-w-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
                Stel vragen, deel ervaringen en leer van collega-professionals.
                Van BIG-registratie tot uurtarieven — hier vind je het antwoord.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Link href="/inloggen"
                className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                Inloggen
              </Link>
              <Link href="/registreren"
                className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                style={{ background: "var(--teal)" }}>
                Meedoen →
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { num: "3.800+", label: "Leden" },
              { num: "680+",   label: "Discussies" },
              { num: "4.200+", label: "Reacties" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>{s.num}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-14">
          <div className="grid grid-cols-3 gap-8">

            {/* Main content */}
            <div className="col-span-2 space-y-8">

              {/* Topics */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4" style={{ color: "var(--teal)" }}>Onderwerpen</div>
                <div className="grid grid-cols-2 gap-3">
                  {TOPICS.map(t => (
                    <div key={t.title}
                      className="rounded-2xl p-4 bg-white cursor-pointer hover:shadow-sm transition-shadow"
                      style={{ border: "0.5px solid var(--border)" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: t.bg }}>
                          {t.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate" style={{ color: "var(--dark)" }}>{t.title}</div>
                          <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{t.desc}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                        {t.posts} discussies
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent discussions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: "var(--teal)" }}>Recente discussies</div>
                  <Link href="/inloggen"
                    className="px-4 py-1.5 rounded-[40px] text-xs font-semibold no-underline"
                    style={{ background: "var(--teal)", color: "#fff" }}>
                    + Nieuwe discussie
                  </Link>
                </div>

                <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
                  {DISCUSSIONS.map((d, i) => {
                    const catColor = CATEGORY_COLOR[d.category] ?? "var(--teal)";
                    return (
                      <div key={d.id}
                        className="px-5 py-4 hover:bg-[var(--teal-light)] transition-colors cursor-pointer"
                        style={{ borderBottom: i < DISCUSSIONS.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              {d.pinned && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(26,122,106,0.1)", color: "var(--teal)" }}>
                                  📌 Vastgezet
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: catColor + "14", color: catColor }}>
                                {d.category}
                              </span>
                            </div>
                            <div className="text-sm font-semibold mb-1 hover:text-teal" style={{ color: "var(--dark)" }}>
                              {d.title}
                            </div>
                            <div className="text-xs" style={{ color: "var(--muted)" }}>
                              door <strong style={{ color: "var(--teal)" }}>{d.author}</strong> · {d.time}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs" style={{ color: "var(--muted)" }}>
                            <span>{d.replies} reacties</span>
                            <span>{d.views} weergaves</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Join CTA */}
              <div className="rounded-2xl p-5" style={{ background: "var(--dark)" }}>
                <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                  Doe mee aan de discussie
                </h3>
                <p className="text-xs mb-4 leading-[1.6]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Maak een gratis account aan om vragen te stellen, te reageren en ervaringen te delen.
                </p>
                <Link href="/registreren?rol=freeflexer"
                  className="block text-center px-4 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}>
                  Gratis aanmelden →
                </Link>
              </div>

              {/* Top contributors */}
              <div className="rounded-2xl bg-white p-5" style={{ border: "0.5px solid var(--border)" }}>
                <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
                  Top bijdragers
                </div>
                <div className="space-y-3">
                  {MEMBERS.map((m, i) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "var(--teal)" }}>
                        {m.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: "var(--dark)" }}>{m.name}</div>
                        <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>{m.role}</div>
                      </div>
                      <div className="text-xs font-bold flex-shrink-0" style={{ color: "var(--teal)" }}>
                        {m.posts} posts
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community rules */}
              <div className="rounded-2xl bg-white p-5" style={{ border: "0.5px solid var(--border)" }}>
                <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
                  Community regels
                </div>
                <div className="space-y-2.5 text-sm" style={{ color: "var(--muted)" }}>
                  {[
                    "Wees respectvol en behulpzaam",
                    "Geen reclame of spam",
                    "Geen persoonlijke gegevens delen",
                    "Bronnen vermelden bij advies",
                    "Medisch advies? Raadpleeg een professional",
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--teal)" }}>✓</span>
                      <span className="text-xs leading-[1.5]">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blog link */}
              <div className="rounded-2xl p-5"
                style={{ background: "var(--teal-light)", border: "0.5px solid rgba(26,122,106,0.2)" }}>
                <div className="text-sm font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                  📚 Liever eerst lezen?
                </div>
                <p className="text-xs mb-3 leading-[1.6]" style={{ color: "var(--muted)" }}>
                  Bekijk onze kennisbank met praktische artikelen over BIG & SKJ, uurtarieven en meer.
                </p>
                <Link href="/blog"
                  className="text-xs font-semibold no-underline"
                  style={{ color: "var(--teal)" }}>
                  Naar de blog →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

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
          { heading: "CaredIn",       links: ["Ons verhaal", "Blog", "Community", "Contact"] },
        ].map(col => (
          <div key={col.heading}>
            <h4 className="text-xs font-bold uppercase tracking-[1px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.heading}</h4>
            <ul className="list-none space-y-2.5">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-[13px] no-underline" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </>
  );
}
