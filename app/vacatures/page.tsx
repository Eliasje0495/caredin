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
  VVT: "Ouderenzorg (VVT)",
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

// Sector accent colors for left bar / dot
const SECTOR_COLORS: Record<string, string> = {
  VVT: "#1A7A6A",
  GGZ: "#7C3AED",
  JEUGDZORG: "#F59E0B",
  ZIEKENHUIS: "#3B82F6",
  HUISARTSENZORG: "#10B981",
  GEHANDICAPTENZORG: "#EF4444",
  KRAAMZORG: "#EC4899",
  THUISZORG: "#14B8A6",
  REVALIDATIE: "#F97316",
  OVERIG: "#6B7280",
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
  return `/vacatures${qs ? `?${qs}` : ""}`;
}

export default async function VacaturesPage({
  searchParams,
}: {
  searchParams: { sector?: string; functie?: string; q?: string; stad?: string; sortBy?: string; registratie?: string };
}) {
  const where: any = { status: "OPEN" };
  if (searchParams.sector) where.sector = searchParams.sector;
  if (searchParams.functie) where.function = searchParams.functie;
  if (searchParams.stad)
    where.city = { contains: searchParams.stad, mode: "insensitive" as const };
  if (searchParams.registratie === "big") where.requiresBig = true;
  if (searchParams.registratie === "skj") where.requiresSkj = true;
  if (searchParams.registratie === "kvk") where.requiresKvk = true;

  const orderBy = buildOrderBy(searchParams.sortBy);

  const shifts = await prisma.shift.findMany({
    where,
    include: { employer: true },
    orderBy,
    take: 20,
  });

  const activeSector = searchParams.sector ?? null;
  const activeFunctie = searchParams.functie ?? null;
  const activeStad = searchParams.stad ?? null;
  const activeRegistratie = searchParams.registratie ?? null;

  const REGISTRATIE_LABELS: Record<string, string> = {
    big: "BIG vereist",
    skj: "SKJ vereist",
    kvk: "KvK vereist",
  };

  // Active filter pills
  type Pill = { label: string; removeHref: string };
  const activePills: Pill[] = [];
  if (activeSector)
    activePills.push({
      label: SECTOR_LABELS[activeSector] ?? activeSector,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "sector"),
    });
  if (activeFunctie)
    activePills.push({
      label: FUNCTION_LABELS[activeFunctie] ?? activeFunctie,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "functie"),
    });
  if (activeStad)
    activePills.push({
      label: activeStad,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "stad"),
    });
  if (activeRegistratie)
    activePills.push({
      label: REGISTRATIE_LABELS[activeRegistratie] ?? activeRegistratie,
      removeHref: removeParam(searchParams as Record<string, string | undefined>, "registratie"),
    });

  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-0" style={{ background: "var(--dark)" }}>
        {/* ambient glow */}
        <div
          className="absolute top-[-60px] right-[-100px] w-[480px] h-[480px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(26,122,106,0.22) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-[-60px] w-[320px] h-[320px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.5px] mb-6"
            style={{ background: "rgba(93,184,164,0.1)", color: "var(--teal-mid)", border: "0.5px solid rgba(93,184,164,0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Beschikbare diensten
          </div>

          <h1
            className="text-white tracking-[-2px] leading-[1.02] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(36px,5vw,60px)", maxWidth: "560px" }}
          >
            Vind jouw dienst.
          </h1>

          {/* Inline search bar */}
          <form method="GET" action="/vacatures" className="flex items-center gap-0 mb-4 max-w-xl">
            <input
              name="stad"
              defaultValue={searchParams.stad}
              type="text"
              placeholder="Stad of locatie… (bijv. Amsterdam)"
              className="flex-1 px-5 py-3.5 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.14)",
                borderRight: "none",
                color: "#fff",
                borderRadius: "40px 0 0 40px",
                fontFamily: "inherit",
              }}
            />
            {activeSector && <input type="hidden" name="sector" value={activeSector} />}
            {activeFunctie && <input type="hidden" name="functie" value={activeFunctie} />}
            {searchParams.sortBy && <input type="hidden" name="sortBy" value={searchParams.sortBy} />}
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
        </div>

        {/* ── Sector pill filters (scrollable) ── */}
        <div className="relative max-w-6xl mx-auto">
          <div
            className="flex gap-2 pb-4 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Link
              href="/vacatures"
              className="flex-shrink-0 px-4 py-2 rounded-[40px] text-[12px] font-semibold no-underline transition-all"
              style={{
                background: activeSector === null ? "var(--teal)" : "rgba(255,255,255,0.07)",
                color: activeSector === null ? "#fff" : "rgba(255,255,255,0.55)",
                border: activeSector === null ? "none" : "0.5px solid rgba(255,255,255,0.12)",
              }}
            >
              Alle sectoren
            </Link>
            {Object.entries(SECTOR_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/vacatures?sector=${key}`}
                className="flex-shrink-0 px-4 py-2 rounded-[40px] text-[12px] font-semibold no-underline transition-all"
                style={{
                  background: activeSector === key ? "var(--teal)" : "rgba(255,255,255,0.07)",
                  color: activeSector === key ? "#fff" : "rgba(255,255,255,0.55)",
                  border: activeSector === key ? "none" : "0.5px solid rgba(255,255,255,0.12)",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex gap-8 items-start">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <div className="rounded-2xl bg-white sticky top-[84px]" style={{ border: "0.5px solid var(--border)" }}>
                <div className="px-6 pt-6 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <h3 className="text-sm font-bold" style={{ color: "var(--dark)" }}>Filteren</h3>
                </div>

                {/* Functie filter */}
                <div className="px-6 pt-5 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
                    Functie
                  </div>
                  <div className="space-y-1.5">
                    <Link
                      href={activeSector ? `/vacatures?sector=${activeSector}` : "/vacatures"}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs no-underline transition-colors"
                      style={{
                        background: activeFunctie === null ? "rgba(26,122,106,0.08)" : "transparent",
                        color: activeFunctie === null ? "var(--teal)" : "var(--muted)",
                        fontWeight: activeFunctie === null ? 600 : 400,
                      }}
                    >
                      Alle functies
                    </Link>
                    {Object.entries(FUNCTION_LABELS).map(([key, label]) => {
                      const params = new URLSearchParams();
                      if (activeSector) params.set("sector", activeSector);
                      params.set("functie", key);
                      return (
                        <Link
                          key={key}
                          href={`/vacatures?${params.toString()}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs no-underline transition-colors"
                          style={{
                            background: activeFunctie === key ? "rgba(26,122,106,0.08)" : "transparent",
                            color: activeFunctie === key ? "var(--teal)" : "var(--muted)",
                            fontWeight: activeFunctie === key ? 600 : 400,
                          }}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Stad filter */}
                <div className="px-6 pt-5 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
                    Stad / locatie
                  </div>
                  <form method="GET" action="/vacatures" className="space-y-2.5">
                    {activeSector && <input type="hidden" name="sector" value={activeSector} />}
                    {activeFunctie && <input type="hidden" name="functie" value={activeFunctie} />}
                    {searchParams.sortBy && <input type="hidden" name="sortBy" value={searchParams.sortBy} />}
                    <input
                      name="stad"
                      type="text"
                      placeholder="Amsterdam, Utrecht…"
                      defaultValue={activeStad ?? ""}
                      className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-[40px] text-xs font-semibold text-white"
                      style={{ background: "var(--teal)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Toepassen
                    </button>
                  </form>
                </div>

                {/* Registratie filter */}
                <div className="px-6 pt-5 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
                    Vereiste registratie
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { key: null,  label: "Alle diensten" },
                      { key: "big", label: "BIG vereist" },
                      { key: "skj", label: "SKJ vereist" },
                      { key: "kvk", label: "KvK vereist" },
                    ].map(({ key, label }) => {
                      const params = new URLSearchParams();
                      if (activeSector) params.set("sector", activeSector);
                      if (activeFunctie) params.set("functie", activeFunctie);
                      if (activeStad) params.set("stad", activeStad);
                      if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
                      if (key) params.set("registratie", key);
                      const isActive = activeRegistratie === key;
                      return (
                        <Link
                          key={key ?? "alle"}
                          href={`/vacatures?${params.toString()}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs no-underline transition-colors"
                          style={{
                            background: isActive ? "rgba(26,122,106,0.08)" : "transparent",
                            color: isActive ? "var(--teal)" : "var(--muted)",
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Sorteren */}
                <div className="px-6 pt-5 pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
                    Sorteren op
                  </div>
                  <form method="GET" action="/vacatures" className="space-y-2.5">
                    {activeSector && <input type="hidden" name="sector" value={activeSector} />}
                    {activeFunctie && <input type="hidden" name="functie" value={activeFunctie} />}
                    {activeStad && <input type="hidden" name="stad" value={activeStad} />}
                    <select
                      name="sortBy"
                      defaultValue={searchParams.sortBy ?? ""}
                      className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white appearance-none"
                      style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)", cursor: "pointer" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-[40px] text-xs font-semibold text-white"
                      style={{ background: "var(--teal)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Toepassen
                    </button>
                  </form>
                </div>

                {/* Date range */}
                <div className="px-6 pt-5 pb-6">
                  <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
                    Datum
                  </div>
                  <form method="GET" action="/vacatures" className="space-y-2.5">
                    {activeSector && <input type="hidden" name="sector" value={activeSector} />}
                    {activeFunctie && <input type="hidden" name="functie" value={activeFunctie} />}
                    {activeStad && <input type="hidden" name="stad" value={activeStad} />}
                    {searchParams.sortBy && <input type="hidden" name="sortBy" value={searchParams.sortBy} />}
                    <div>
                      <label className="text-[11px] mb-1 block" style={{ color: "var(--muted)" }}>Vanaf</label>
                      <input
                        name="vanaf"
                        type="date"
                        className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white"
                        style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] mb-1 block" style={{ color: "var(--muted)" }}>Tot en met</label>
                      <input
                        name="tot"
                        type="date"
                        className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white"
                        style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-[40px] text-xs font-semibold text-white mt-1"
                      style={{ background: "var(--teal)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Toepassen
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* ── Results ── */}
            <main className="flex-1 min-w-0">
              {/* Result header */}
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
                    <h2 className="text-lg font-bold" style={{ color: "var(--dark)" }}>
                      <span style={{ color: "var(--teal)" }}>{shifts.length}</span>{" "}
                      {activeSector ? (SECTOR_LABELS[activeSector] ?? activeSector) + " — diensten gevonden" : "diensten gevonden"}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {shifts.length === 0 ? "Geen resultaten" : `${SORT_OPTIONS.find((o) => o.value === (searchParams.sortBy ?? ""))?.label ?? "Nieuwste eerst"}`}
                    </p>
                  </div>
                  {(activeSector || activeFunctie || activeStad || activeRegistratie || searchParams.q) && (
                    <Link
                      href="/vacatures"
                      className="text-xs font-medium no-underline px-4 py-2 rounded-[40px]"
                      style={{ border: "0.5px solid var(--border)", color: "var(--muted)" }}
                    >
                      ✕ Filters wissen
                    </Link>
                  )}
                </div>
              </div>

              {/* Empty state */}
              {shifts.length === 0 ? (
                <div className="rounded-2xl py-20 px-8 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <div className="text-5xl mb-4">🔍</div>
                  <div className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                    Geen diensten gevonden
                  </div>
                  <p className="text-sm mb-8 max-w-xs mx-auto leading-[1.65]" style={{ color: "var(--muted)" }}>
                    Er zijn momenteel geen open diensten die overeenkomen met je filters. Probeer een andere sector of kom later terug.
                  </p>
                  <Link
                    href="/vacatures"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                    style={{ background: "var(--teal)" }}
                  >
                    Alle diensten bekijken
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts.map((shift) => {
                    const accentColor = SECTOR_COLORS[shift.sector] ?? SECTOR_COLORS.OVERIG;
                    const startDate = new Date(shift.startTime);
                    const endDate = new Date(shift.endTime);
                    const dateLabel = startDate.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
                    const timeLabel = `${startDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} – ${endDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`;
                    const rate = Number(shift.hourlyRate).toFixed(2);

                    return (
                      <Link key={shift.id} href={`/vacatures/${shift.id}`} className="no-underline block group">
                        <div
                          className="flex items-stretch rounded-2xl bg-white overflow-hidden transition-shadow group-hover:shadow-md"
                          style={{ border: "0.5px solid var(--border)" }}
                        >
                          {/* Sector accent bar */}
                          <div
                            className="w-1 flex-shrink-0"
                            style={{ background: accentColor }}
                          />

                          <div className="flex-1 px-6 py-5 flex items-center justify-between gap-4">
                            {/* Left: info */}
                            <div className="flex-1 min-w-0">
                              {/* Top row: instelling + badges */}
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <span className="text-[12px] font-semibold" style={{ color: accentColor }}>
                                  {shift.employer.companyName}
                                </span>
                                {/* Verified badge */}
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(26,122,106,0.08)", color: "var(--teal)" }}
                                >
                                  ✓ Geverifieerd
                                </span>
                                {shift.isUrgent && (
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ background: "#ef4444" }}
                                  >
                                    Urgent
                                  </span>
                                )}
                              </div>

                              {/* Function title */}
                              <div
                                className="text-base font-bold mb-3 truncate"
                                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                              >
                                {FUNCTION_LABELS[shift.function] ?? shift.function}
                                {shift.title && shift.title !== shift.function ? ` — ${shift.title}` : ""}
                              </div>

                              {/* Chips row */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                  style={{ background: "var(--bg)", color: "var(--dark)", border: "0.5px solid var(--border)" }}
                                >
                                  📅 {dateLabel}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                  style={{ background: "var(--bg)", color: "var(--dark)", border: "0.5px solid var(--border)" }}
                                >
                                  🕐 {timeLabel}
                                </span>
                                {shift.city && (
                                  <span
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                    style={{ background: "var(--bg)", color: "var(--dark)", border: "0.5px solid var(--border)" }}
                                  >
                                    📍 {shift.city}
                                  </span>
                                )}
                                {shift.sector && (
                                  <span
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                                    style={{ background: `${accentColor}14`, color: accentColor, border: `0.5px solid ${accentColor}30` }}
                                  >
                                    {SECTOR_LABELS[shift.sector] ?? shift.sector}
                                  </span>
                                )}
                                {/* Vereiste registraties */}
                                {shift.requiresBig && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                    style={{ background: "#EFF6FF", color: "#1D4ED8", border: "0.5px solid #BFDBFE" }}
                                  >
                                    BIG vereist
                                  </span>
                                )}
                                {shift.requiresSkj && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                    style={{ background: "#F5F3FF", color: "#6D28D9", border: "0.5px solid #DDD6FE" }}
                                  >
                                    SKJ vereist
                                  </span>
                                )}
                                {shift.requiresKvk && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                    style={{ background: "#FFF7ED", color: "#C2410C", border: "0.5px solid #FED7AA" }}
                                  >
                                    KvK vereist
                                  </span>
                                )}
                                {shift.minExperience > 0 && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                    style={{ background: "#F0FDF4", color: "#15803D", border: "0.5px solid #BBF7D0" }}
                                  >
                                    {shift.minExperience}+ jaar ervaring
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: rate + CTA */}
                            <div className="flex-shrink-0 text-right">
                              <div
                                className="text-[22px] font-bold leading-none mb-0.5"
                                style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}
                              >
                                €{rate}
                              </div>
                              <div className="text-[11px] mb-4" style={{ color: "var(--muted)" }}>per uur</div>
                              <span
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[40px] text-xs font-semibold"
                                style={{ border: "1.5px solid var(--teal)", color: "var(--teal)" }}
                              >
                                Bekijken →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="px-6 py-14" style={{ background: "var(--dark)", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto grid gap-10" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
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
        <div className="max-w-6xl mx-auto mt-10 pt-6 flex items-center justify-between"
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
