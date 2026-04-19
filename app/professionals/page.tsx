export const dynamic = "force-dynamic";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige",
  VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus",
  HELPENDE: "Helpende",
  ZORGASSISTENT: "Zorgassistent",
  GGZ_AGOOG: "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider",
  GEDRAGSDESKUNDIGE: "Gedragsdeskundige",
  ARTS: "Arts",
  FYSIOTHERAPEUT: "Fysiotherapeut",
  ERGOTHERAPEUT: "Ergotherapeut",
  LOGOPEDIST: "Logopedist",
  KRAAMVERZORGENDE: "Kraamverzorgende",
  OVERIG: "Overig",
};

// Top 6 most commonly searched functions for the filter bar
const TOP_FUNCTIONS = [
  "VERPLEEGKUNDIGE",
  "VERZORGENDE_IG",
  "HELPENDE_PLUS",
  "ZORGASSISTENT",
  "GGZ_AGOOG",
  "PERSOONLIJK_BEGELEIDER",
];

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: { functie?: string; city?: string };
}) {
  const workers = await prisma.workerProfile.findMany({
    where: {
      isActive: true,
      isVerified: true,
      ...(searchParams.city
        ? { city: { contains: searchParams.city, mode: "insensitive" as const } }
        : {}),
      ...(searchParams.functie
        ? { functions: { some: { function: searchParams.functie as any } } }
        : {}),
    },
    include: {
      user: { select: { name: true, image: true } },
      functions: true,
      sectors: true,
    },
    orderBy: [{ totalShifts: "desc" }, { averageRating: "desc" }],
    take: 40,
  });

  const activeFunctie = searchParams.functie ?? null;
  const hasFilters = !!(searchParams.functie || searchParams.city);

  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-6 pt-20 pb-16"
        style={{ background: "var(--dark)" }}
      >
        {/* Ambient glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-120px",
            right: "-120px",
            width: "520px",
            height: "520px",
            background: "radial-gradient(circle, rgba(93,184,164,0.20) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-40px",
            left: "-60px",
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(26,122,106,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.5px] mb-6"
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
            Geverifieerde professionals
          </div>

          {/* Headline */}
          <h1
            className="text-white leading-[1.02] tracking-[-2px] mb-5"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(36px,5vw,62px)",
              maxWidth: "600px",
            }}
          >
            Vind de juiste professional voor jouw dienst.
          </h1>

          {/* Sub */}
          <p
            className="text-[15px] leading-[1.7] mb-8"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "480px" }}
          >
            Alle professionals zijn BIG- of SKJ-geverifieerd via het officiële register.
          </p>

          {/* Inline search */}
          <form
            method="GET"
            action="/professionals"
            className="flex items-center gap-0 mb-10 max-w-lg"
          >
            {activeFunctie && (
              <input type="hidden" name="functie" value={activeFunctie} />
            )}
            <input
              name="city"
              defaultValue={searchParams.city}
              type="text"
              placeholder="Stad of regio zoeken…"
              className="flex-1 px-5 py-3.5 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.14)",
                borderRight: "none",
                color: "#fff",
                borderRadius: "40px 0 0 40px",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              className="px-6 py-3.5 text-sm font-semibold text-white flex-shrink-0"
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
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            4.200+ professionals
            <span
              className="mx-3 inline-block align-middle w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            100% geverifieerd
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}>
          {/* Function filter pills */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={searchParams.city ? `/professionals?city=${searchParams.city}` : "/professionals"}
              className="flex-shrink-0 px-4 py-1.5 rounded-[40px] text-[12px] font-semibold no-underline transition-all"
              style={{
                background: activeFunctie === null ? "var(--teal)" : "transparent",
                color: activeFunctie === null ? "#fff" : "var(--muted)",
                border: activeFunctie === null ? "none" : "0.5px solid var(--border)",
              }}
            >
              Alle functies
            </Link>
            {TOP_FUNCTIONS.map((key) => {
              const params = new URLSearchParams();
              if (searchParams.city) params.set("city", searchParams.city);
              params.set("functie", key);
              return (
                <Link
                  key={key}
                  href={`/professionals?${params.toString()}`}
                  className="flex-shrink-0 px-4 py-1.5 rounded-[40px] text-[12px] font-semibold no-underline transition-all"
                  style={{
                    background: activeFunctie === key ? "var(--teal)" : "transparent",
                    color: activeFunctie === key ? "#fff" : "var(--muted)",
                    border: activeFunctie === key ? "none" : "0.5px solid var(--border)",
                  }}
                >
                  {FUNCTION_LABELS[key]}
                </Link>
              );
            })}
          </div>

          {/* Count badge + clear */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-[12px] font-semibold px-3 py-1 rounded-[40px]"
              style={{ background: "var(--teal-light)", color: "var(--teal)" }}
            >
              {workers.length} professional{workers.length !== 1 ? "s" : ""} gevonden
            </span>
            {hasFilters && (
              <Link
                href="/professionals"
                className="text-[12px] font-medium no-underline px-3 py-1 rounded-[40px] flex-shrink-0"
                style={{ border: "0.5px solid var(--border)", color: "var(--muted)" }}
              >
                ✕ Wissen
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Empty state */}
          {workers.length === 0 ? (
            <div
              className="rounded-2xl py-24 px-8 text-center bg-white"
              style={{ border: "0.5px solid var(--border)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                style={{ background: "var(--teal-light)" }}
              >
                👤
              </div>
              <div
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
              >
                Geen professionals gevonden
              </div>
              <p
                className="text-sm mb-8 max-w-xs mx-auto leading-[1.65]"
                style={{ color: "var(--muted)" }}
              >
                Er zijn geen professionals die overeenkomen met je filters. Probeer een andere stad of functie.
              </p>
              <Link
                href="/professionals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                style={{ background: "var(--teal)" }}
              >
                Alle professionals bekijken
              </Link>
            </div>
          ) : (
            /* Professional cards grid */
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {workers.map((w) => {
                const initials = (w.user.name ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={w.id}
                    className="rounded-2xl bg-white flex flex-col transition-shadow hover:shadow-md"
                    style={{ border: "0.5px solid var(--border)" }}
                  >
                    {/* Card top */}
                    <div className="px-5 pt-5 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                      {/* Avatar + name row */}
                      <div className="flex items-start gap-3 mb-4">
                        {w.user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={w.user.image}
                            alt={w.user.name ?? ""}
                            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                            style={{ background: "var(--teal)" }}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div
                            className="text-[15px] font-bold leading-snug truncate"
                            style={{ color: "var(--dark)" }}
                          >
                            {w.user.name ?? "Onbekend"}
                          </div>
                          {w.city && (
                            <div
                              className="text-[12px] mt-0.5 flex items-center gap-1"
                              style={{ color: "var(--muted)" }}
                            >
                              <svg
                                width="10"
                                height="12"
                                viewBox="0 0 10 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0"
                              >
                                <path
                                  d="M5 0C2.794 0 1 1.794 1 4c0 3 4 8 4 8s4-5 4-8c0-2.206-1.794-4-4-4Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                                  fill="currentColor"
                                />
                              </svg>
                              {w.city}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verification badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {w.bigStatus === "VERIFIED" && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                            style={{ background: "rgba(6,95,70,0.09)", color: "#065F46" }}
                          >
                            ✓ BIG
                          </span>
                        )}
                        {w.kvkStatus === "VERIFIED" && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                            style={{ background: "rgba(6,95,70,0.09)", color: "#065F46" }}
                          >
                            ✓ SKJ
                          </span>
                        )}
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: "rgba(107,114,128,0.10)",
                            color: "#6B7280",
                          }}
                        >
                          {w.contractType === "ZZP" ? "ZZP" : "Loondienst"}
                        </span>
                      </div>

                      {/* Stats row */}
                      <div
                        className="flex items-center gap-3 text-[12px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {w.averageRating && Number(w.averageRating) > 0 && (
                          <span
                            className="flex items-center gap-1 font-semibold"
                            style={{ color: "#F5A623" }}
                          >
                            ★ {Number(w.averageRating).toFixed(1)}
                          </span>
                        )}
                        <span>{w.totalShifts ?? 0} diensten</span>
                        {w.hourlyRate && Number(w.hourlyRate) > 0 && (
                          <span className="font-semibold" style={{ color: "var(--teal)" }}>
                            €{Number(w.hourlyRate).toFixed(0)}/u
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card bottom */}
                    <div className="px-5 py-4 flex flex-col gap-3 flex-1">
                      {/* Function tags */}
                      {w.functions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {w.functions.slice(0, 3).map((f) => (
                            <span
                              key={f.id}
                              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                              style={{
                                background: "var(--teal-light)",
                                color: "var(--teal)",
                              }}
                            >
                              {FUNCTION_LABELS[f.function] ?? f.function}
                            </span>
                          ))}
                          {w.functions.length > 3 && (
                            <span
                              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                              style={{
                                background: "rgba(107,114,128,0.10)",
                                color: "#6B7280",
                              }}
                            >
                              +{w.functions.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA button */}
                      <div className="mt-auto pt-1">
                        <Link
                          href="/dashboard/organisatie/diensten/nieuw"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[40px] text-[12px] font-semibold no-underline transition-colors"
                          style={{
                            border: "1.5px solid var(--teal)",
                            color: "var(--teal)",
                          }}
                        >
                          Uitnodigen voor dienst →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <section
        className="relative overflow-hidden px-6 py-20 text-center"
        style={{ background: "var(--dark)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "560px",
            height: "320px",
            background: "radial-gradient(ellipse, rgba(26,122,106,0.20) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div
            className="text-[11px] font-bold uppercase tracking-[1.2px]"
            style={{ color: "var(--teal-mid)" }}
          >
            Voor instellingen
          </div>
          <h2
            className="text-white leading-[1.05] tracking-[-1.5px]"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(32px,4.5vw,52px)",
            }}
          >
            Zoek je meer professionals?
          </h2>
          <p
            className="text-[15px] leading-[1.7] max-w-sm"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Registreer je instelling gratis en krijg direct toegang tot 4.200+ geverifieerde zorgprofessionals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/registreren?rol=bedrijf"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[40px] text-[14px] font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Registreer gratis als instelling →
            </Link>
            <Link
              href="/voor-instellingen"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[40px] text-[14px] font-semibold no-underline"
              style={{
                border: "1.5px solid rgba(255,255,255,0.30)",
                color: "#fff",
                background: "transparent",
              }}
            >
              Meer info
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-14"
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
                Care<span style={{ color: "rgba(255,255,255,0.7)" }}>dIn</span>
              </span>
            </Link>
            <p
              className="text-[13px] leading-[1.65]"
              style={{ color: "rgba(255,255,255,0.32)", maxWidth: "210px" }}
            >
              Het flexibele zorgplatform dat professionals en instellingen verbindt.
            </p>
          </div>

          {/* Link columns */}
          {[
            {
              heading: "Professionals",
              links: [
                { label: "Diensten zoeken", href: "/vacatures" },
                { label: "Je verdiensten", href: "/dashboard" },
                { label: "BIG & SKJ", href: "/onze-belofte" },
                { label: "Onze belofte", href: "/onze-belofte" },
              ],
            },
            {
              heading: "Instellingen",
              links: [
                { label: "Professionals vinden", href: "/professionals" },
                { label: "Tarieven", href: "/voor-instellingen#tarieven" },
                { label: "Sectoren", href: "/voor-instellingen#sectoren" },
                { label: "Gratis aanmelden", href: "/registreren?rol=bedrijf" },
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
              <h4
                className="text-[10px] font-bold uppercase tracking-[1.2px] mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {col.heading}
              </h4>
              <ul className="list-none space-y-2.5 p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] no-underline hover:opacity-80 transition-opacity"
                      style={{ color: "rgba(255,255,255,0.50)" }}
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
          className="max-w-6xl mx-auto mt-10 pt-6 flex items-center justify-between"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} CaredIn B.V. — KvK 12345678 — Alle rechten voorbehouden.
          </span>
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
