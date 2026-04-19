import Link from "next/link";
import { Nav } from "@/components/Nav";

export const BLOG_ARTICLES = [
  {
    slug: "zzp-zorg-belastingaangifte-2025",
    title: "ZZP in de zorg: belastingaangifte 2025 stap voor stap",
    excerpt:
      "De belastingaangifte als ZZP&apos;er in de zorg hoeft geen nachtmerrie te zijn. Met de juiste voorbereiding en kennis van aftrekposten houd je meer over van wat je verdient.",
    category: "ZZP Tips",
    readTime: "8 min",
    date: "14 april 2026",
    emoji: "📋",
  },
  {
    slug: "big-nummer-aanvragen-gids",
    title: "BIG-nummer aanvragen: de complete gids voor nieuwe zorgprofessionals",
    excerpt:
      "Zonder BIG-registratie geen werk in de zorg. Ontdek stap voor stap hoe je jouw registratie aanvraagt, hoe lang het duurt en wat je nodig hebt.",
    category: "Wet & Regelgeving",
    readTime: "6 min",
    date: "10 april 2026",
    emoji: "🏥",
  },
  {
    slug: "flexibel-werken-zorg-voordelen",
    title: "5 voordelen van flexibel werken in de zorg die niemand je vertelt",
    excerpt:
      "Meer vrijheid, hogere inkomsten en meer variatie in je werk — flexibel werken in de zorg heeft meer voordelen dan je denkt. We zetten ze eerlijk op een rij.",
    category: "Arbeidsmarkt",
    readTime: "4 min",
    date: "7 april 2026",
    emoji: "⚡",
  },
  {
    slug: "zzp-tarief-berekenen-zorg",
    title: "Zo bereken je jouw uurtarief als ZZP&apos;er in de zorg",
    excerpt:
      "Te laag zitten kost je geld, te hoog en je wordt overgeslagen. Met deze formule bereken je een eerlijk, marktconform uurtarief voor jouw functie en regio.",
    category: "ZZP Tips",
    readTime: "5 min",
    date: "3 april 2026",
    emoji: "💰",
  },
  {
    slug: "ai-planning-zorg-2025",
    title: "AI in zorgplanning: hoe technologie het personeelstekort aanpakt",
    excerpt:
      "Slimme algoritmes matchen zorgprofessionals en instellingen sneller dan ooit. Maar wat betekent AI-gedreven planning voor de mens achter de dienst?",
    category: "Zorg & Technologie",
    readTime: "7 min",
    date: "29 maart 2026",
    emoji: "🤖",
  },
  {
    slug: "burnout-voorkomen-zzp-zorg",
    title: "Burnout voorkomen als ZZP&apos;er in de zorg: praktische tips",
    excerpt:
      "Als ZZP&apos;er draag je alle verantwoordelijkheid zelf — inclusief je eigen welzijn. Dit zijn de signalen, oorzaken en effectieve strategieën om burnout voor te blijven.",
    category: "Arbeidsmarkt",
    readTime: "5 min",
    date: "24 maart 2026",
    emoji: "🧘",
  },
];

const CATEGORIES = [
  "Alle artikelen",
  "ZZP Tips",
  "Wet & Regelgeving",
  "Arbeidsmarkt",
  "Zorg & Technologie",
];

const CATEGORY_STYLE: Record<string, { bg: string; color: string }> = {
  "ZZP Tips":          { bg: "rgba(26,122,106,0.1)",  color: "var(--teal)" },
  "Wet & Regelgeving": { bg: "rgba(180,83,9,0.1)",    color: "#B45309" },
  "Arbeidsmarkt":      { bg: "rgba(30,64,175,0.1)",   color: "#1E40AF" },
  "Zorg & Technologie":{ bg: "rgba(93,184,164,0.15)", color: "var(--teal-mid)" },
};

function CategoryBadge({ cat }: { cat: string }) {
  const s = CATEGORY_STYLE[cat] ?? { bg: "rgba(26,122,106,0.1)", color: "var(--teal)" };
  return (
    <span
      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {cat}
    </span>
  );
}

export default function BlogPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="px-12 py-16" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-6"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.9)",
              border: "0.5px solid rgba(255,255,255,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Blog &amp; Inzichten
          </div>
          <h1
            className="text-[clamp(36px,4.5vw,62px)] font-bold text-white tracking-[-1.5px] leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "680px" }}
          >
            Blog &amp; Inzichten
          </h1>
          <p className="text-sm max-w-lg leading-[1.7]" style={{ color: "rgba(255,255,255,0.7)" }}>
            Praktische kennis over flexibel werken in de zorg — voor ZZP&apos;ers, verpleegkundigen en zorgprofessionals die vooruit willen.
          </p>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-14">

          {/* Category filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                className="px-4 py-1.5 rounded-[40px] text-[13px] font-semibold cursor-pointer"
                style={{
                  background: i === 0 ? "var(--teal)" : "#fff",
                  color: i === 0 ? "#fff" : "var(--muted)",
                  border: i === 0 ? "none" : "0.5px solid var(--border)",
                  fontFamily: "inherit",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BLOG_ARTICLES.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline group">
                <div
                  className="rounded-2xl bg-white overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  {/* Emoji / visual top */}
                  <div
                    className="h-36 flex items-center justify-center relative"
                    style={{ background: "var(--teal-light)" }}
                  >
                    <span className="text-5xl">{post.emoji}</span>
                    <div className="absolute top-3 left-3">
                      <CategoryBadge cat={post.category} />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="text-[15px] font-bold leading-[1.3] mb-2"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-xs leading-[1.65] mb-4 flex-1" style={{ color: "var(--muted)" }}>
                      {post.excerpt}
                    </p>
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: "0.5px solid var(--border)" }}
                    >
                      <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                        {post.date} · {post.readTime} leestijd
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                        Lees meer →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-14 rounded-3xl p-10 text-center" style={{ background: "var(--dark)" }}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[11px] font-semibold uppercase tracking-[0.4px] mb-5"
              style={{
                background: "rgba(93,184,164,0.12)",
                color: "var(--teal-mid)",
                border: "0.5px solid rgba(93,184,164,0.3)",
              }}
            >
              Newsletter
            </div>
            <h2
              className="text-[28px] font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Blijf op de hoogte
            </h2>
            <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>
              Nieuwe artikelen, praktische tips en platform updates — direct in je inbox.
            </p>
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="naam@voorbeeld.nl"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontFamily: "inherit",
                }}
              />
              <button
                className="px-5 py-3 rounded-[40px] text-sm font-semibold text-white flex-shrink-0 cursor-pointer"
                style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}
              >
                Aanmelden
              </button>
            </div>
          </div>
        </div>
      </div>

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
