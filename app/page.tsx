import Link from "next/link";
import { Nav } from "@/components/Nav";

const SECTORS = [
  { icon: "🏥", name: "Ziekenhuiszorg",    count: "680+ diensten" },
  { icon: "🏡", name: "Thuiszorg",         count: "1.200+ diensten" },
  { icon: "🧓", name: "Ouderenzorg (VVT)", count: "540+ diensten" },
  { icon: "🧒", name: "Jeugdzorg",         count: "290+ diensten" },
  { icon: "🧠", name: "GGZ",               count: "410+ diensten" },
  { icon: "🦽", name: "Gehandicaptenzorg", count: "320+ diensten" },
];

const TESTIMONIALS = [
  {
    quote: "Via CaredIn heb ik binnen een dag mijn eerste dienst gevonden. Alles werkt soepel en de uitbetaling was er binnen 48 uur.",
    name: "Marieke van den Berg",
    role: "Verpleegkundige",
    city: "Utrecht",
    initial: "M",
  },
  {
    quote: "Als instelling hebben we eindelijk een betrouwbaar alternatief voor uitzendbureaus. Directe toegang tot geverifieerde professionals.",
    name: "Thomas Kooijman",
    role: "Planner, WZW Zorggroep",
    city: "Amsterdam",
    initial: "T",
  },
  {
    quote: "Het verificatieproces gaf me meteen vertrouwen. Ik weet zeker dat ik aan de juiste mensen word gekoppeld.",
    name: "Fatima El Yazidi",
    role: "Thuiszorgmedewerker",
    city: "Rotterdam",
    initial: "F",
  },
];

const PRO_STEPS = [
  { num: "01", title: "Aanmelden",        desc: "Maak gratis een profiel aan met je basisgegevens." },
  { num: "02", title: "Registraties uploaden",     desc: "Upload je registraties. Verificatie binnen 24 uur." },
  { num: "03", title: "Dienst kiezen",    desc: "Blader door honderden beschikbare diensten en meld je aan." },
  { num: "04", title: "Uitbetaling",      desc: "Uren goedgekeurd? Betaling binnen 48 uur op je rekening." },
];

const ORG_STEPS = [
  { num: "01", title: "Aanmelden",          desc: "Registreer je organisatie in enkele minuten." },
  { num: "02", title: "KvK-verificatie",    desc: "We verifiëren je KvK-nummer voor een betrouwbaar platform." },
  { num: "03", title: "Dienst plaatsen",    desc: "Voeg datum, functie en tarief toe — live in één klik." },
  { num: "04", title: "Checkout goedkeuren", desc: "Keur uren goed binnen 7 dagen. Factuur volgt automatisch." },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--dark)", minHeight: "620px" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-160px",
            right: "-160px",
            width: "560px",
            height: "560px",
            background:
              "radial-gradient(circle, rgba(93,184,164,0.22) 0%, transparent 68%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-60px",
            left: "25%",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(26,122,106,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-12 py-20 flex flex-col gap-10">
          {/* Badge */}
          <div
            className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.6px]"
            style={{
              background: "rgba(93,184,164,0.10)",
              color: "var(--teal-mid)",
              border: "0.5px solid rgba(93,184,164,0.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--teal-mid)" }}
            />
            Hét zorgplatform van Nederland
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(52px,6.5vw,88px)] font-bold leading-[1.0] tracking-[-2.5px] text-white"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "860px" }}
          >
            Flexibel werken
            <br />
            <em
              className="not-italic"
              style={{ color: "var(--teal-mid)" }}
            >
              in de zorg.
            </em>
          </h1>

          {/* Sub */}
          <p
            className="text-[17px] leading-[1.75] max-w-xl"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            CaredIn verbindt geverifieerde zorgprofessionals met instellingen door heel Nederland. Zonder bureau, zonder gedoe.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/registreren?rol=freeflexer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[40px] text-[14px] font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Ik ben een professional <span>→</span>
            </Link>
            <Link
              href="/registreren/instelling"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[40px] text-[14px] font-semibold no-underline"
              style={{
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "#fff",
                background: "transparent",
              }}
            >
              Ik ben een instelling <span>→</span>
            </Link>
          </div>

          {/* Location search */}
          <form method="GET" action="/diensten" className="flex items-center gap-0 max-w-md">
            <div
              className="flex items-center flex-1"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.16)",
                borderRight: "none",
                borderRadius: "40px 0 0 40px",
              }}
            >
              <span className="pl-4 pr-2 text-base flex-shrink-0" style={{ color: "rgba(255,255,255,0.45)" }}>
                📍
              </span>
              <input
                name="stad"
                type="text"
                placeholder="Zoek op stad of locatie…"
                className="flex-1 pr-4 py-3 text-sm outline-none bg-transparent"
                style={{ color: "#fff", fontFamily: "inherit" }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white flex-shrink-0"
              style={{
                background: "var(--teal)",
                borderRadius: "0 40px 40px 0",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Zoeken
            </button>
          </form>

          {/* Trust stats */}
          <p
            className="text-[13px] font-medium tracking-[0.2px]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            4.200+ professionals
            <span
              className="mx-3 inline-block align-middle w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            3.800+ diensten
            <span
              className="mx-3 inline-block align-middle w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            48u uitbetaling
          </p>
        </div>
      </section>

      {/* ─── DUAL VALUE PROP ──────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ background: "var(--teal)" }}
      >
        {/* Left — professionals */}
        <div
          className="px-12 py-14"
          style={{ borderRight: "0.5px solid rgba(255,255,255,0.15)" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-6"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            🩺
          </div>
          <div
            className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Voor professionals
          </div>
          <h2
            className="text-[28px] font-bold leading-[1.2] text-white mb-5"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Kies zelf wanneer je werkt
          </h2>
          <ul className="space-y-3 mb-7">
            {[
              "Gratis aanmelden — geen verborgen kosten",
              "Realtime geverifieerd profiel voor meer vertrouwen",
              "Uitbetaling binnen 48 uur na goedkeuring",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[14px] leading-[1.6]"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <span
                  className="mt-[4px] w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/vacatures"
            className="text-[13px] font-semibold no-underline inline-flex items-center gap-1"
            style={{ color: "#fff" }}
          >
            Meer voor professionals →
          </Link>
        </div>

        {/* Right — instellingen */}
        <div className="px-12 py-14">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-6"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            🏥
          </div>
          <div
            className="text-[11px] font-bold uppercase tracking-[1.2px] mb-3"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Voor instellingen
          </div>
          <h2
            className="text-[28px] font-bold leading-[1.2] text-white mb-5"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Vind geverifieerd personeel
          </h2>
          <ul className="space-y-3 mb-7">
            {[
              "Geen bureau — direct contact met de professional",
              "Slechts €3/uur platformbijdrage, geen verborgen fees",
              "Alleen realtime geverifieerde professionals met biometrische scan",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[14px] leading-[1.6]"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <span
                  className="mt-[4px] w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/voor-instellingen"
            className="text-[13px] font-semibold no-underline inline-flex items-center gap-1"
            style={{ color: "#fff" }}
          >
            Meer voor instellingen →
          </Link>
        </div>
      </section>

      {/* ─── SECTOREN ─────────────────────────────────────────────────────── */}
      <section className="px-12 py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="text-[11px] font-bold uppercase tracking-[1.4px] mb-3"
            style={{ color: "var(--teal)" }}
          >
            Sectoren
          </div>
          <h2
            className="text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.5px] mb-12"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--dark)",
              maxWidth: "560px",
            }}
          >
            Professionals in alle zorgsectoren
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SECTORS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl cursor-pointer transition-shadow hover:shadow-md"
                style={{
                  background: "#fff",
                  border: "0.5px solid var(--border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
                  style={{ background: "var(--teal-light)" }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="text-[14px] font-semibold leading-snug"
                    style={{ color: "var(--dark)" }}
                  >
                    {s.name}
                  </div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--muted)" }}
                  >
                    {s.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOE HET WERKT ────────────────────────────────────────────────── */}
      <section className="px-12 py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="text-[11px] font-bold uppercase tracking-[1.4px] mb-3"
            style={{ color: "var(--teal)" }}
          >
            Hoe het werkt
          </div>
          <h2
            className="text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.5px] mb-12"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--dark)",
              maxWidth: "480px",
            }}
          >
            In vier stappen aan de slag
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professionals panel */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--dark)" }}
            >
              <div
                className="px-8 py-5 flex items-center gap-3"
                style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: "rgba(93,184,164,0.15)" }}
                >
                  🩺
                </div>
                <span
                  className="text-[13px] font-bold uppercase tracking-[1px]"
                  style={{ color: "var(--teal-mid)" }}
                >
                  Voor professionals
                </span>
              </div>
              <div className="px-8 py-7 flex flex-col gap-0">
                {PRO_STEPS.map((step, i) => (
                  <div key={step.num} className="flex gap-5">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                        style={{
                          background: "rgba(93,184,164,0.15)",
                          color: "var(--teal-mid)",
                          border: "0.5px solid rgba(93,184,164,0.3)",
                        }}
                      >
                        {step.num}
                      </div>
                      {i < PRO_STEPS.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            minHeight: "28px",
                          }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className={i < PRO_STEPS.length - 1 ? "pb-7" : ""}>
                      <div
                        className="text-[14px] font-semibold leading-snug"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        {step.title}
                      </div>
                      <div
                        className="text-[13px] leading-[1.65] mt-1"
                        style={{ color: "rgba(255,255,255,0.38)" }}
                      >
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-8 pb-8">
                <Link
                  href="/registreren?rol=freeflexer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[40px] text-[13px] font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}
                >
                  Aanmelden als professional →
                </Link>
              </div>
            </div>

            {/* Instellingen panel */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                border: "0.5px solid var(--border)",
              }}
            >
              <div
                className="px-8 py-5 flex items-center gap-3"
                style={{ borderBottom: "0.5px solid var(--border)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: "var(--teal-light)" }}
                >
                  🏥
                </div>
                <span
                  className="text-[13px] font-bold uppercase tracking-[1px]"
                  style={{ color: "var(--teal)" }}
                >
                  Voor instellingen
                </span>
              </div>
              <div className="px-8 py-7 flex flex-col gap-0">
                {ORG_STEPS.map((step, i) => (
                  <div key={step.num} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                        style={{
                          background: "var(--teal-light)",
                          color: "var(--teal)",
                          border: "0.5px solid rgba(26,122,106,0.2)",
                        }}
                      >
                        {step.num}
                      </div>
                      {i < ORG_STEPS.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{
                            background: "var(--border)",
                            minHeight: "28px",
                          }}
                        />
                      )}
                    </div>
                    <div className={i < ORG_STEPS.length - 1 ? "pb-7" : ""}>
                      <div
                        className="text-[14px] font-semibold leading-snug"
                        style={{ color: "var(--dark)" }}
                      >
                        {step.title}
                      </div>
                      <div
                        className="text-[13px] leading-[1.65] mt-1"
                        style={{ color: "var(--muted)" }}
                      >
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-8 pb-8">
                <Link
                  href="/registreren/instelling"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[40px] text-[13px] font-semibold no-underline"
                  style={{
                    background: "transparent",
                    border: "1.5px solid var(--teal)",
                    color: "var(--teal)",
                  }}
                >
                  Aanmelden als instelling →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="px-12 py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="text-[11px] font-bold uppercase tracking-[1.4px] mb-3"
            style={{ color: "var(--teal)" }}
          >
            Ervaringen
          </div>
          <h2
            className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.5px] mb-12"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--dark)",
              maxWidth: "440px",
            }}
          >
            Wat gebruikers zeggen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-7 flex flex-col gap-5"
                style={{
                  background: "#fff",
                  border: "0.5px solid var(--border)",
                }}
              >
                {/* Quote mark */}
                <span
                  className="text-[32px] leading-none font-bold"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-light)" }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-[14px] leading-[1.75] flex-1"
                  style={{ color: "var(--dark)" }}
                >
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: "0.5px solid var(--border)" }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal)" }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div
                      className="text-[13px] font-semibold leading-snug"
                      style={{ color: "var(--dark)" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {t.role} · {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-12 py-24 text-center"
        style={{ background: "var(--dark)" }}
      >
        {/* Subtle glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "360px",
            background:
              "radial-gradient(ellipse, rgba(26,122,106,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-8">
          <h2
            className="text-[clamp(44px,6vw,76px)] font-bold leading-[1.0] tracking-[-2px] text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Start vandaag.
          </h2>
          <p
            className="text-[16px] leading-[1.7] max-w-md"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Sluit je aan bij duizenden zorgprofessionals en instellingen die flexibeler werken via CaredIn.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link
              href="/registreren?rol=freeflexer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[40px] text-[14px] font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Aanmelden als professional →
            </Link>
            <Link
              href="/registreren/instelling"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[40px] text-[14px] font-semibold no-underline"
              style={{
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff",
                background: "transparent",
              }}
            >
              Aanmelden als instelling →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        className="px-12 py-14"
        style={{ background: "var(--dark)", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="max-w-6xl mx-auto grid gap-10"
          style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
        >
          {/* Brand */}
          <div>
            <Link href="/" className="no-underline inline-block mb-4">
              <span
                className="text-[22px] font-bold tracking-[-0.5px]"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
              >
                Care<span style={{ color: "rgba(255,255,255,0.7)" }}>din</span>
              </span>
            </Link>
            <p
              className="text-[13px] leading-[1.65]"
              style={{ color: "rgba(255,255,255,0.32)", maxWidth: "210px" }}
            >
              Het flexibele zorgplatform dat professionals en instellingen verbindt door heel Nederland.
            </p>
          </div>

          {/* Link columns */}
          {[
            {
              heading: "Professionals",
              links: [
                { label: "Diensten zoeken",  href: "/vacatures" },
                { label: "Je verdiensten",   href: "/voor-professionals" },
                { label: "Registraties",        href: "/big-verificatie" },
                { label: "Onze belofte",     href: "/onze-belofte" },
              ],
            },
            {
              heading: "Instellingen",
              links: [
                { label: "Professionals vinden", href: "/voor-instellingen" },
                { label: "Tarieven",             href: "/tarieven" },
                { label: "Sectoren",             href: "/sectoren" },
                { label: "Integraties",          href: "/integraties" },
              ],
            },
            {
              heading: "CaredIn",
              links: [
                { label: "Ons verhaal",  href: "/over-ons" },
                { label: "Vacatures",    href: "/vacatures-intern" },
                { label: "Nieuwsroom",   href: "/blog" },
                { label: "Contact",      href: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4
                className="text-[10px] font-bold uppercase tracking-[1.2px] mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {col.heading}
              </h4>
              <ul className="list-none space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] no-underline"
                      style={{ color: "rgba(255,255,255,0.52)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-6xl mx-auto mt-12 pt-6 flex items-center justify-between"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            © {new Date().getFullYear()} CaredIn B.V. — KvK 12345678 — Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-5">
            {["Privacybeleid", "Algemene voorwaarden", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] no-underline"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
