import Link from "next/link";
import { Nav } from "@/components/Nav";

export const HELPDESK_ARTICLES = [
  {
    slug: "account-aanmaken",
    title: "Hoe maak ik een account aan?",
    category: "Aan de slag",
    categoryIcon: "🚀",
  },
  {
    slug: "profiel-completeren",
    title: "Mijn profiel completeren voor meer kansen",
    category: "Aan de slag",
    categoryIcon: "🚀",
  },
  {
    slug: "big-verificatie",
    title: "BIG-nummer verifiëren: hoe werkt het?",
    category: "Verificaties",
    categoryIcon: "✅",
  },
  {
    slug: "eerste-uitbetaling",
    title: "Wanneer ontvang ik mijn eerste uitbetaling?",
    category: "Betalingen & Facturatie",
    categoryIcon: "💳",
  },
  {
    slug: "dienst-aanmelden",
    title: "Hoe meld ik me aan voor een dienst?",
    category: "Diensten & Aanmeldingen",
    categoryIcon: "📋",
  },
  {
    slug: "annulering-beleid",
    title: "Wat is het annuleringsbeleid?",
    category: "Diensten & Aanmeldingen",
    categoryIcon: "📋",
  },
];

const HELPDESK_CATEGORIES = [
  {
    icon: "🚀",
    title: "Aan de slag",
    desc: "Account aanmaken, profiel instellen, eerste dienst vinden",
    slug: "aan-de-slag",
  },
  {
    icon: "💳",
    title: "Betalingen & Facturatie",
    desc: "Uitbetaling, facturen, Stripe Connect",
    slug: "betalingen-facturatie",
  },
  {
    icon: "📋",
    title: "Diensten & Aanmeldingen",
    desc: "Hoe aanmelden werkt, annuleren, geschillen",
    slug: "diensten-aanmeldingen",
  },
  {
    icon: "✅",
    title: "Verificaties",
    desc: "Registraties, KvK, ID-verificatie",
    slug: "verificaties",
  },
];

const CAT_COLOR: Record<string, string> = {
  "Aan de slag":             "var(--teal)",
  "Verificaties":            "var(--teal)",
  "Betalingen & Facturatie": "#1E40AF",
  "Diensten & Aanmeldingen": "#B45309",
};

export default function HelpdeskPage() {
  return (
    <>
      <Nav />

      {/* Hero with search */}
      <div className="px-12 py-16 relative overflow-hidden" style={{ background: "#0F1C1A" }}>
        <div
          className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-6"
            style={{
              background: "rgba(93,184,164,0.12)",
              color: "var(--teal-mid)",
              border: "0.5px solid rgba(93,184,164,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Helpdesk
          </div>
          <h1
            className="text-[clamp(30px,4vw,52px)] font-bold text-white tracking-[-1.5px] leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Hoe kunnen we helpen?
          </h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
            Antwoorden van het CaredIn team op al je vragen over het platform.
          </p>

          {/* Search bar (decorative) */}
          <div className="relative max-w-xl mx-auto">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-lg"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Zoek in helpdesk artikelen…"
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { num: "60+", label: "Artikelen" },
              { num: "< 2u", label: "Reactietijd" },
              { num: "NL", label: "Support in het Nederlands" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span
                  className="font-bold"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
                >
                  {s.num}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto px-12 py-14 space-y-14">

          {/* Category cards */}
          <div>
            <div
              className="text-[11px] font-bold uppercase tracking-[1.5px] mb-5"
              style={{ color: "var(--teal)" }}
            >
              Categorieën
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HELPDESK_CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`#${cat.slug}`} className="no-underline group">
                  <div
                    className="flex items-start gap-4 px-6 py-5 rounded-2xl bg-white hover:shadow-md transition-shadow"
                    style={{ border: "0.5px solid var(--border)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-base font-bold mb-1"
                        style={{ color: "var(--dark)", fontFamily: "var(--font-fraunces)" }}
                      >
                        {cat.title}
                      </div>
                      <div className="text-sm" style={{ color: "var(--muted)" }}>
                        {cat.desc}
                      </div>
                    </div>
                    <span style={{ color: "var(--muted)", fontSize: 16 }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular articles */}
          <div>
            <div
              className="text-[11px] font-bold uppercase tracking-[1.5px] mb-5"
              style={{ color: "var(--teal)" }}
            >
              Populaire artikelen
            </div>
            <div
              className="rounded-2xl bg-white overflow-hidden"
              style={{ border: "0.5px solid var(--border)" }}
            >
              {HELPDESK_ARTICLES.map((a, i) => (
                <Link key={a.slug} href={`/helpdesk/${a.slug}`} className="no-underline group">
                  <div
                    className="flex items-center justify-between px-6 py-4 hover:bg-[var(--teal-light)] transition-colors"
                    style={{
                      borderBottom:
                        i < HELPDESK_ARTICLES.length - 1 ? "0.5px solid var(--border)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{a.categoryIcon}</span>
                      <span className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                        {a.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: (CAT_COLOR[a.category] ?? "var(--teal)") + "18",
                          color: CAT_COLOR[a.category] ?? "var(--teal)",
                        }}
                      >
                        {a.category}
                      </span>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>›</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact banner */}
          <div
            className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "var(--dark)" }}
          >
            <div>
              <h2
                className="text-[22px] font-bold text-white mb-1.5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Kom je er niet uit?
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Ons supportteam staat klaar op werkdagen van 09:00 – 17:30.
              </p>
            </div>
            <a
              href="mailto:support@caredin.nl"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[40px] text-sm font-semibold no-underline flex-shrink-0"
              style={{ background: "var(--teal)", color: "#fff" }}
            >
              ✉️ Stuur een e-mail →
            </a>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-12 py-12"
        style={{ background: "var(--dark)", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
