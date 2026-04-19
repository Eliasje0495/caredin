export const dynamic = "force-dynamic";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";

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

const SECTOR_LABELS: Record<string, string> = {
  VVT: "Ouderenzorg",
  GGZ: "GGZ",
  JEUGDZORG: "Jeugdzorg",
  ZIEKENHUIS: "Ziekenhuiszorg",
  HUISARTSENZORG: "Huisartsenzorg",
  GEHANDICAPTENZORG: "Gehandicaptenzorg",
  KRAAMZORG: "Kraamzorg",
  THUISZORG: "Thuiszorg",
  REVALIDATIE: "Revalidatie",
  OVERIG: "Overig",
};

const SECTOR_ICONS: Record<string, string> = {
  VVT: "🏠",
  GGZ: "🧠",
  JEUGDZORG: "👶",
  ZIEKENHUIS: "🏥",
  HUISARTSENZORG: "🩺",
  GEHANDICAPTENZORG: "♿",
  KRAAMZORG: "🍼",
  THUISZORG: "🏡",
  REVALIDATIE: "💪",
  OVERIG: "⚕️",
};

const SORT_OPTIONS = [
  { value: "", label: "Nieuwste eerst" },
  { value: "tarief-hoog", label: "Tarief hoog-laag" },
  { value: "tarief-laag", label: "Tarief laag-hoog" },
  { value: "datum-dienst", label: "Datum dienst" },
];

function buildOrderBy(sortBy?: string) {
  switch (sortBy) {
    case "tarief-hoog":
      return [{ hourlyRate: "desc" as const }];
    case "tarief-laag":
      return [{ hourlyRate: "asc" as const }];
    case "datum-dienst":
      return [{ startTime: "asc" as const }];
    default:
      return [{ createdAt: "desc" as const }];
  }
}

/** Build a URL that removes one param from the current searchParams */
function removeParam(
  params: Record<string, string | undefined>,
  key: string,
): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k !== key && v) p.set(k, v);
  }
  const qs = p.toString();
  return `/diensten${qs ? `?${qs}` : ""}`;
}

export default async function DienstenPage({
  searchParams,
}: {
  searchParams: {
    sector?: string;
    functie?: string;
    stad?: string;
    min?: string;
    max?: string;
    sortBy?: string;
    registratie?: string;
  };
}) {
  const where: any = { status: "OPEN" };
  if (searchParams.sector) where.sector = searchParams.sector;
  if (searchParams.functie) where.function = searchParams.functie;
  if (searchParams.stad)
    where.city = { contains: searchParams.stad, mode: "insensitive" as const };
  if (searchParams.min) where.hourlyRate = { gte: parseFloat(searchParams.min) };
  if (searchParams.max)
    where.hourlyRate = { ...where.hourlyRate, lte: parseFloat(searchParams.max) };
  if (searchParams.registratie === "big")   where.requiresBig = true;
  if (searchParams.registratie === "skj")   where.requiresSkj = true;
  if (searchParams.registratie === "kvk")   where.requiresKvk = true;

  const orderBy = buildOrderBy(searchParams.sortBy);

  const [shifts, totalOpen, totalEmployers, avgRateResult] = await Promise.all([
    prisma.shift.findMany({
      where,
      include: { employer: true, _count: { select: { applications: true } } },
      orderBy,
      take: 30,
    }),
    prisma.shift.count({ where: { status: "OPEN" } }),
    prisma.employer.count({ where: { isActive: true } }),
    prisma.shift.aggregate({ where: { status: "OPEN" }, _avg: { hourlyRate: true } }),
  ]);

  const avgRate = avgRateResult._avg.hourlyRate ? `€${Math.round(Number(avgRateResult._avg.hourlyRate))}/uur` : "€35/uur";

  const hasFilters =
    searchParams.sector || searchParams.functie || searchParams.stad || searchParams.min || searchParams.max || searchParams.registratie;

  // Build active filter pills
  type Pill = { label: string; removeHref: string };
  const activePills: Pill[] = [];
  if (searchParams.sector)
    activePills.push({
      label: SECTOR_LABELS[searchParams.sector] ?? searchParams.sector,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "sector"),
    });
  if (searchParams.functie)
    activePills.push({
      label: FUNCTION_LABELS[searchParams.functie] ?? searchParams.functie,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "functie"),
    });
  if (searchParams.stad)
    activePills.push({
      label: searchParams.stad,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "stad"),
    });
  if (searchParams.min)
    activePills.push({
      label: `Min €${searchParams.min}`,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "min"),
    });
  if (searchParams.max)
    activePills.push({
      label: `Max €${searchParams.max}`,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "max"),
    });
  if (searchParams.registratie)
    activePills.push({
      label: searchParams.registratie.toUpperCase() + " vereist",
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "registratie"),
    });

  return (
    <>
      <Nav />

      {/* ── Dark hero ── */}
      <section className="relative overflow-hidden px-8 py-16" style={{ background: "var(--dark)" }}>
        {/* radial glow top-right */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(93,184,164,0.18) 0%, transparent 68%)",
          }}
        />
        {/* grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--teal-mid) 1px, transparent 1px), linear-gradient(90deg, var(--teal-mid) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* badge */}
          <div
            className="inline-flex items-center gap-2 rounded-[40px] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] mb-5"
            style={{ background: "rgba(93,184,164,0.15)", color: "#5DB8A4", border: "1px solid rgba(93,184,164,0.3)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#5DB8A4" }}
            />
            Voor professionals
          </div>

          <h1
            className="text-[46px] font-bold leading-[1.1] tracking-[-1.5px] text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Jouw volgende dienst
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Filters op functie, sector, locatie en tarief. Altijd actuele diensten van gecertificeerde zorgorganisaties.
          </p>

          {/* quick stats */}
          <div className="mt-8 flex gap-6">
            {[
              { label: "Actieve diensten",       value: `${totalOpen}` },
              { label: "Aangesloten instellingen", value: `${totalEmployers}` },
              { label: "Gemiddeld tarief",        value: avgRate },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-fraunces)", color: "#5DB8A4" }}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-[1px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex gap-8 items-start">

            {/* ── Left sidebar: filters ── */}
            <aside className="w-72 flex-shrink-0 sticky top-24">
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <h3
                  className="text-base font-bold mb-5"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                >
                  Filters
                </h3>

                <form method="GET" className="space-y-4">
                  {/* Zoekterm */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: "var(--muted)" }}>
                      Zoekterm
                    </label>
                    <input
                      name="q"
                      type="text"
                      placeholder="Bijv. nacht, weekend…"
                      defaultValue=""
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                    />
                  </div>

                  {/* Stad / locatie */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5" style={{ color: "var(--muted)" }}>
                      Stad / locatie
                    </label>
                    <input
                      name="stad"
                      type="text"
                      placeholder="Amsterdam, Utrecht…"
                      defaultValue={searchParams.stad ?? ""}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                    />
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>
                      Sector
                    </label>
                    <select
                      name="sector"
                      defaultValue={searchParams.sector ?? ""}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white appearance-none"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)", cursor: "pointer" }}
                    >
                      <option value="">Alle sectoren</option>
                      {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Functie */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>
                      Functie
                    </label>
                    <select
                      name="functie"
                      defaultValue={searchParams.functie ?? ""}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white appearance-none"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)", cursor: "pointer" }}
                    >
                      <option value="">Alle functies</option>
                      {Object.entries(FUNCTION_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tarief */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>
                      Uurtarief (€)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        name="min"
                        type="number"
                        placeholder="Min"
                        defaultValue={searchParams.min ?? ""}
                        min={0}
                        step={0.5}
                        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-center"
                        style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                      />
                      <span className="text-xs flex-shrink-0" style={{ color: "var(--muted)" }}>–</span>
                      <input
                        name="max"
                        type="number"
                        placeholder="Max"
                        defaultValue={searchParams.max ?? ""}
                        min={0}
                        step={0.5}
                        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none bg-white text-center"
                        style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                      />
                    </div>
                  </div>

                  {/* Registratie */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>
                      Registratie vereist
                    </label>
                    <select
                      name="registratie"
                      defaultValue={searchParams.registratie ?? ""}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white appearance-none"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)", cursor: "pointer" }}
                    >
                      <option value="">Geen voorkeur</option>
                      <option value="big">BIG</option>
                      <option value="skj">SKJ</option>
                      <option value="kvk">KvK (ZZP)</option>
                    </select>
                  </div>

                  {/* Sorteren */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>
                      Sorteren op
                    </label>
                    <select
                      name="sortBy"
                      defaultValue={searchParams.sortBy ?? ""}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-white appearance-none"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)", cursor: "pointer" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-[40px] text-sm font-semibold text-white mt-1"
                    style={{ background: "var(--teal)", fontFamily: "inherit", cursor: "pointer", border: "none" }}
                  >
                    Filter toepassen
                  </button>

                  {/* Wis filters */}
                  {hasFilters && (
                    <div className="text-center">
                      <Link
                        href="/diensten"
                        className="text-xs no-underline"
                        style={{ color: "var(--muted)" }}
                      >
                        Wis alle filters
                      </Link>
                    </div>
                  )}
                </form>
              </div>
            </aside>

            {/* ── Right: results ── */}
            <main className="flex-1 min-w-0">
              {/* Results header */}
              <div className="mb-6">
                {/* Active filter pills */}
                {activePills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activePills.map((pill) => (
                      <Link
                        key={pill.label}
                        href={pill.removeHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[40px] text-[12px] font-semibold no-underline transition-opacity hover:opacity-80"
                        style={{ background: "var(--teal-light)", color: "var(--teal)", border: "1px solid rgba(26,122,106,0.2)" }}
                      >
                        {pill.label}
                        <span className="text-[11px] font-bold leading-none" style={{ color: "var(--teal)" }}>×</span>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                    >
                      <span style={{ color: "var(--teal)" }}>{shifts.length}</span>{" "}
                      diensten gevonden
                    </h2>
                    {hasFilters && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        Gefilterde resultaten
                      </p>
                    )}
                  </div>
                  <div
                    className="text-xs px-3 py-1.5 rounded-[40px]"
                    style={{ background: "var(--teal-light)", color: "var(--teal)", fontWeight: 600 }}
                  >
                    {SORT_OPTIONS.find((o) => o.value === (searchParams.sortBy ?? ""))?.label ?? "Nieuwste eerst"}
                  </div>
                </div>
              </div>

              {/* Empty state */}
              {shifts.length === 0 ? (
                <div
                  className="rounded-2xl bg-white p-16 text-center"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                    style={{ background: "var(--teal-light)" }}
                  >
                    🔍
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                  >
                    Geen diensten gevonden
                  </h3>
                  <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--muted)" }}>
                    Probeer minder specifieke filters of verwijder de huidige selectie om meer resultaten te zien.
                  </p>
                  <Link
                    href="/diensten"
                    className="inline-block no-underline rounded-[40px] px-6 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--teal)", color: "#fff" }}
                  >
                    Toon alle diensten
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts.map((shift) => {
                    const startDate = new Date(shift.startTime);
                    const endDate = new Date(shift.endTime);
                    const dateLabel = startDate.toLocaleDateString("nl-NL", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    });
                    const timeLabel =
                      startDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) +
                      " – " +
                      endDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

                    return (
                      <div
                        key={shift.id}
                        className="rounded-2xl bg-white transition-shadow hover:shadow-md"
                        style={{ border: "0.5px solid var(--border)" }}
                      >
                        <div className="flex items-start gap-5 px-6 py-5">
                          {/* Sector icon */}
                          <div
                            className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl text-xl"
                            style={{ background: "var(--teal-light)" }}
                          >
                            {SECTOR_ICONS[shift.sector] ?? "⚕️"}
                          </div>

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            {/* Employer + badges row */}
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[13px] font-semibold" style={{ color: "var(--teal)" }}>
                                {shift.employer.companyName}
                              </span>
                              <span
                                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                              >
                                {SECTOR_LABELS[shift.sector] ?? shift.sector}
                              </span>
                              {shift.isUrgent && (
                                <span
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                                  style={{ background: "#ef4444" }}
                                >
                                  Urgent
                                </span>
                              )}
                            </div>

                            {/* Function title */}
                            <h3
                              className="text-[17px] font-bold leading-tight mb-1.5 truncate"
                              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                            >
                              {FUNCTION_LABELS[shift.function] ?? shift.function}
                              {shift.title && shift.title !== shift.function && (
                                <span className="font-normal" style={{ color: "var(--muted)" }}>
                                  {" "}— {shift.title}
                                </span>
                              )}
                            </h3>

                            {/* Meta row */}
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: "var(--muted)" }}>
                              <span>📅 {dateLabel}</span>
                              <span>⏰ {timeLabel}</span>
                              <span>📍 {shift.city}</span>
                              {(shift.requiresBig || shift.requiresSkj || shift.requiresKvk) && (
                                <span className="flex items-center gap-1">
                                  <span style={{ color: "var(--border)" }}>·</span>
                                  {[
                                    shift.requiresBig && "BIG",
                                    shift.requiresSkj && "SKJ",
                                    shift.requiresKvk && "KvK",
                                  ].filter(Boolean).join(" + ")}
                                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>vereist</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right column */}
                          <div className="flex-shrink-0 flex flex-col items-end gap-3">
                            {/* Rate badge */}
                            <div
                              className="text-sm font-bold px-3 py-1 rounded-[40px]"
                              style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                            >
                              €{Number(shift.hourlyRate).toFixed(2)}/uur
                            </div>

                            {/* Applicants */}
                            <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                              {shift._count.applications} aanmelding{shift._count.applications !== 1 ? "en" : ""}
                            </div>

                            {/* CTA */}
                            <Link
                              href={`/diensten/${shift.id}`}
                              className="no-underline"
                            >
                              <span
                                className="block px-5 py-2 rounded-[40px] text-sm font-semibold transition-colors"
                                style={{ border: "1.5px solid var(--teal)", color: "var(--teal)", whiteSpace: "nowrap" }}
                              >
                                Aanmelden →
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load-more hint */}
              {shifts.length === 30 && (
                <div className="mt-6 text-center">
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Meer dan 30 resultaten gevonden. Gebruik de filters om te verfijnen.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--dark)" }}>
        <div className="max-w-6xl mx-auto px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand column */}
            <div>
              <Link href="/" className="no-underline">
                <span
                  className="text-[22px] font-bold tracking-[-0.5px]"
                  style={{ fontFamily: "var(--font-fraunces)", color: "#5DB8A4" }}
                >
                  Care<span className="text-white">din</span>
                </span>
              </Link>
              <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Het platform dat zorgprofessionals verbindt met zorginstellingen in heel Nederland.
              </p>
              <div className="mt-4 flex gap-3">
                {["LinkedIn", "Instagram"].map((net) => (
                  <a
                    key={net}
                    href="#"
                    className="text-[11px] font-semibold no-underline px-3 py-1.5 rounded-[40px]"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {net}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
                style={{ color: "#5DB8A4" }}
              >
                Voor professionals
              </div>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {[
                  { href: "/diensten", label: "Beschikbare diensten" },
                  { href: "/registreren", label: "Registreren" },
                  { href: "/inloggen", label: "Inloggen" },
                  { href: "/professionals", label: "Professionals" },
                  { href: "/dashboard", label: "Mijn dashboard" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] no-underline"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
                style={{ color: "#5DB8A4" }}
              >
                Voor instellingen
              </div>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {[
                  { href: "/voor-instellingen", label: "Hoe het werkt" },
                  { href: "/voor-instellingen#tarieven", label: "Tarieven" },
                  { href: "/registreren?type=instelling", label: "Aanmelden als instelling" },
                  { href: "/vacatures", label: "Vacatures plaatsen" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] no-underline"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <div
                className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
                style={{ color: "#5DB8A4" }}
              >
                CaredIn
              </div>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {[
                  { href: "/onze-belofte", label: "Onze belofte" },
                  { href: "/blog", label: "Blog" },
                  { href: "/community", label: "Community" },
                  { href: "/helpdesk", label: "Helpdesk" },
                  { href: "/privacy", label: "Privacybeleid" },
                  { href: "/algemene-voorwaarden", label: "Algemene voorwaarden" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] no-underline"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }}
          >
            <span>© {new Date().getFullYear()} CaredIn. Alle rechten voorbehouden.</span>
            <span>Zorg verbinden. Levens verbeteren.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
