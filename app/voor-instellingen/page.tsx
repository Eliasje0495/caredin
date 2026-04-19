import Link from "next/link";
import { Nav } from "@/components/Nav";

const STEPS = [
  { num: "01", title: "Registreer gratis", text: "Maak een account aan en voer je KvK-gegevens in. Verificatie duurt gemiddeld 24 uur." },
  { num: "02", title: "Plaats een dienst", text: "Maak een dienst aan met datum, tijdstip, functie en tarief. Direct zichtbaar voor geverifieerde professionals." },
  { num: "03", title: "Kies je professional", text: "Bekijk aanmeldingen, check verificatie en ratings, en accepteer wie je wil." },
  { num: "04", title: "Keur uren goed", text: "Na de dienst keur je de uren goed. Uitbetaling volgt automatisch — geen papierwerk." },
];

const SECTORS = [
  { key: "VVT", label: "Ouderenzorg (VVT)", icon: "🏠", desc: "Verpleeghuizen, woonzorgcentra en thuiszorgorganisaties." },
  { key: "GGZ", label: "GGZ", icon: "🧠", desc: "Geestelijke gezondheidszorg, crisisdiensten en ambulante teams." },
  { key: "JEUGDZORG", label: "Jeugdzorg", icon: "👶", desc: "Jeugdhulp, gezinshuizen en residentiële instellingen." },
  { key: "ZIEKENHUIS", label: "Ziekenhuiszorg", icon: "🏥", desc: "Academische en algemene ziekenhuizen, poliklinieken." },
  { key: "THUISZORG", label: "Thuiszorg", icon: "❤️", desc: "Persoonlijke verzorging en verpleging aan huis." },
  { key: "GEHANDICAPTENZORG", label: "Gehandicaptenzorg", icon: "♿", desc: "Lichamelijke en verstandelijke beperking, dagopvang." },
];

const FEATURES = [
  { icon: "🔍", title: "Realtime verificatie", text: "Elk profiel wordt realtime geverifieerd inclusief biometrische scan. Jij hoeft niets na te trekken." },
  { icon: "⏱️", title: "Automatische tijdregistratie", text: "Check-in en check-out via de app. Uren worden automatisch berekend en aangeboden ter goedkeuring." },
  { icon: "💳", title: "Directe checkout", text: "Keur uren goed en betaling verloopt automatisch. Geen facturen versturen of opvolgen." },
  { icon: "📄", title: "Factuurexport", text: "Download maandelijkse factuuroverzichten in één klik, klaar voor je boekhouder of ERP." },
  { icon: "⭐", title: "Flexpool opbouwen", text: "Sla favoriete professionals op in jouw interne flexpool en nodig ze direct uit voor een nieuwe dienst." },
  { icon: "🛎️", title: "24/7 support", text: "Ons supportteam is dag en nacht bereikbaar via chat. Geen ticketsysteem, directe hulp." },
];

const PRICING = [
  {
    name: "Pay-per-hour",
    price: "€3,–",
    per: "per gewerkt uur",
    desc: "Platformbedrag bovenop het uurtarief van de professional. Geen maandelijkse kosten, geen verborgen tarieven.",
    perks: ["Geen abonnement", "Onbeperkt professionals", "Automatische facturatie"],
    cta: "Gratis beginnen",
    href: "/registreren/instelling",
    featured: false,
  },
  {
    name: "Abonnement",
    price: "Op aanvraag",
    per: "per maand",
    desc: "Voor instellingen met meer dan 20 diensten per maand. Vaste maandprijs, onbeperkte diensten, dedicated accountmanager.",
    perks: ["Alles van Pay-per-hour", "Dedicated accountmanager", "SLA-garantie"],
    cta: "Contact opnemen",
    href: "/contact",
    featured: true,
  },
];

const TESTIMONIALS = [
  {
    quote: "Binnen 3 uur had ik een verpleegkundige voor de nachtdienst. Dat lukt bij geen enkel bureau.",
    name: "Marieke van den Berg",
    role: "Roostermanager, Zorggroep Riviera",
    avatar: "MV",
  },
  {
    quote: "We besparen gemiddeld 38% op onze flexkosten ten opzichte van het uitzendbureau. Ongelooflijk.",
    name: "Thomas Klaassen",
    role: "Hoofd HR, GGZ Neder-Veluwe",
    avatar: "TK",
  },
  {
    quote: "De realtime verificatie is een enorme geruststelling. Ik hoef niets meer zelf na te trekken.",
    name: "Sandra Meijers",
    role: "Teamleider Zorg, De Hoge Brug",
    avatar: "SM",
  },
];

export default function VoorInstellingenPage() {
  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-0" style={{ background: "var(--dark)" }}>
        {/* radial glow left */}
        <div
          className="absolute top-[-80px] left-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(26,122,106,0.35) 0%, transparent 65%)" }}
        />
        {/* radial glow right */}
        <div
          className="absolute bottom-[-60px] right-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.5px] mb-8"
            style={{ background: "rgba(93,184,164,0.1)", color: "var(--teal-mid)", border: "0.5px solid rgba(93,184,164,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Voor zorginstellingen
          </div>

          <h1
            className="text-white tracking-[-2px] leading-[1.02] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(48px,6.5vw,76px)" }}
          >
            Vul je rooster<br />in 2 minuten.
          </h1>

          <p className="mx-auto text-base mb-10 max-w-lg leading-[1.75]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Geverifieerd zorgpersoneel zonder bureau.{" "}
            <span style={{ color: "rgba(255,255,255,0.75)" }}>€3,– per uur</span>, direct contact,
            automatische facturatie.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/registreren/instelling"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Gratis aanmelden →
            </Link>
            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.65)" }}
            >
              Bekijk professionals
            </Link>
          </div>

          {/* hero bottom fade */}
          <div className="mt-16 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="px-6 py-6" style={{ background: "var(--teal)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "4.200+", lab: "Geverifieerde professionals" },
            { num: "< 2 min", lab: "Dienst plaatsen" },
            { num: "0%", lab: "Marge — enkel €3/uur" },
            { num: "48 u", lab: "Uitbetaling na goedkeuring" },
          ].map((s) => (
            <div key={s.lab}>
              <div className="text-[28px] font-bold text-white" style={{ fontFamily: "var(--font-fraunces)" }}>{s.num}</div>
              <div className="text-[12px] mt-0.5 font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{s.lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vergelijking ── */}
      <section className="px-6 py-24" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Vergelijking</div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-[-0.8px]"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Waarom CaredIn vs. een uitzendbureau?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Traditional */}
            <div className="rounded-2xl p-8" style={{ background: "#f6f7f8", border: "0.5px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                  style={{ background: "#e5e7eb", color: "#6b7280" }}>
                  B
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "#374151" }}>Traditioneel uitzendbureau</div>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>De oude manier</div>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "30–40% marge bovenop het uurtarief",
                  "Geen invloed op welke professional je krijgt",
                  "Handmatig papierwerk & facturatie",
                  "Lange doorlooptijden, soms dagen",
                  "Geen realtime identiteitsverificatie",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[15px] flex-shrink-0">❌</span>
                    <span className="text-sm leading-[1.6]" style={{ color: "#6b7280" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CaredIn */}
            <div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "var(--teal)", boxShadow: "0 20px 60px rgba(26,122,106,0.3)" }}>
              <div
                className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
              />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  C
                </div>
                <div>
                  <div className="text-sm font-bold text-white">CaredIn</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>De slimme keuze</div>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Slechts €3,– per gewerkt uur",
                  "Jij kiest wie je inplant — volledig transparant",
                  "Volledig automatische tijdregistratie & facturatie",
                  "Professionals online binnen minuten",
                  "Realtime verificatie + biometrische scan voor elke dienst",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[15px] flex-shrink-0">✅</span>
                    <span className="text-sm leading-[1.6] text-white" style={{ opacity: 0.88 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hoe het werkt ── */}
      <section className="px-6 py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Hoe het werkt</div>
          <h2 className="text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.6px] mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)", maxWidth: "480px" }}>
            Van aanmelding tot uitbetaling in vier stappen
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {STEPS.map((s) => (
              <div key={s.num} className="rounded-2xl p-7 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <div
                  className="text-[56px] font-bold leading-none mb-4 select-none"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-light)", opacity: 0.6 }}
                >
                  {s.num}
                </div>
                <div className="text-base font-bold mb-2" style={{ color: "var(--dark)" }}>{s.title}</div>
                <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sectoren ── */}
      <section className="px-6 py-24" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Sectoren</div>
          <h2 className="text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.6px] mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Voor elke zorgorganisatie
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SECTORS.map((sec) => (
              <div key={sec.key} className="rounded-2xl p-6 bg-white group hover:shadow-md transition-shadow"
                style={{ border: "0.5px solid var(--border)" }}>
                <div className="text-2xl mb-3">{sec.icon}</div>
                <div className="text-sm font-bold mb-1.5" style={{ color: "var(--dark)" }}>{sec.label}</div>
                <p className="text-xs leading-[1.65]" style={{ color: "var(--muted)" }}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Functionaliteiten</div>
          <h2 className="text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.6px] mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Alles inbegrepen, niets extra&apos;s
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                  style={{ background: "rgba(26,122,106,0.08)" }}>
                  {f.icon}
                </div>
                <div className="text-sm font-bold mb-2" style={{ color: "var(--dark)" }}>{f.title}</div>
                <p className="text-xs leading-[1.7]" style={{ color: "var(--muted)" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarieven ── */}
      <section className="px-6 py-24" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Tarieven</div>
            <h2 className="text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.6px]"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Simpel en transparant
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {PRICING.map((p) => (
              <div key={p.name} className="rounded-2xl p-8 flex flex-col"
                style={{
                  background: p.featured ? "var(--teal)" : "#ffffff",
                  border: p.featured ? "none" : "0.5px solid var(--border)",
                  boxShadow: p.featured ? "0 20px 60px rgba(26,122,106,0.28)" : undefined,
                }}>
                <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4"
                  style={{ color: p.featured ? "rgba(255,255,255,0.65)" : "var(--muted)" }}>
                  {p.name}
                </div>
                <div className="text-[42px] font-bold leading-none mb-1"
                  style={{ fontFamily: "var(--font-fraunces)", color: p.featured ? "#fff" : "var(--dark)" }}>
                  {p.price}
                </div>
                <div className="text-sm mb-5" style={{ color: p.featured ? "rgba(255,255,255,0.55)" : "var(--muted)" }}>
                  {p.per}
                </div>
                <p className="text-sm leading-[1.65] mb-6 flex-1"
                  style={{ color: p.featured ? "rgba(255,255,255,0.75)" : "var(--muted)" }}>
                  {p.desc}
                </p>
                <ul className="space-y-2 mb-8">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm"
                      style={{ color: p.featured ? "rgba(255,255,255,0.85)" : "var(--dark)" }}>
                      <span style={{ color: p.featured ? "rgba(255,255,255,0.7)" : "var(--teal)" }}>✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="inline-flex justify-center px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{
                    background: p.featured ? "#fff" : "var(--teal)",
                    color: p.featured ? "var(--teal)" : "#fff",
                  }}
                >
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>Ervaringen</div>
          <h2 className="text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.6px] mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Wat zorgmanagers zeggen
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-7 bg-white flex flex-col justify-between"
                style={{ border: "0.5px solid var(--border)" }}>
                <p className="text-sm leading-[1.75] mb-6 italic" style={{ color: "var(--dark)", opacity: 0.8 }}>
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: "var(--dark)" }}>{t.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(26,122,106,0.3) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(32px,4vw,52px)] font-bold text-white tracking-[-1px] mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Start vandaag gratis.
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
            Eerste dienst online in minder dan 5 minuten. Geen contracten, geen verplichtingen.
          </p>
          <Link
            href="/registreren/instelling"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-[40px] text-base font-semibold text-white no-underline"
            style={{ background: "var(--teal)", boxShadow: "0 0 40px rgba(26,122,106,0.5)" }}
          >
            Aanmelden als instelling →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-14" style={{ background: "var(--dark)", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid gap-10" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
          <div>
            <div className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
              CaredIn
            </div>
            <p className="text-[13px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.35)", maxWidth: "200px" }}>
              Het flexibele zorgplatform dat professionals en instellingen verbindt.
            </p>
          </div>
          {[
            {
              heading: "Professionals",
              links: [
                { label: "Diensten zoeken", href: "/vacatures" },
                { label: "Je verdiensten", href: "/dashboard" },
                { label: "Registraties", href: "/onze-belofte" },
                { label: "Onze belofte", href: "/onze-belofte" },
              ],
            },
            {
              heading: "Instellingen",
              links: [
                { label: "Professionals vinden", href: "/professionals" },
                { label: "Tarieven", href: "/voor-instellingen#tarieven" },
                { label: "Sectoren", href: "/voor-instellingen#sectoren" },
                { label: "Gratis aanmelden", href: "/registreren/instelling" },
              ],
            },
            {
              heading: "CaredIn",
              links: [
                { label: "Ons verhaal", href: "/onze-belofte" },
                { label: "Blog", href: "/blog" },
                { label: "Helpdesk", href: "/helpdesk" },
                { label: "Contact", href: "/helpdesk" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-[1px] mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {col.heading}
              </h4>
              <ul className="list-none space-y-2.5 p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] no-underline hover:opacity-80 transition-opacity"
                      style={{ color: "rgba(255,255,255,0.5)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 flex items-center justify-between"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} CaredIn. Alle rechten voorbehouden.
          </span>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            KvK: 12345678
          </span>
        </div>
      </footer>
    </>
  );
}
