export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import ApplyButton from "./ApplyButton";

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

const WEEKDAYS = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

export default async function DienstDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session ? ((session.user as any).id as string) : null;

  const shift = await prisma.shift.findUnique({
    where: { id: params.id },
    include: {
      employer: { include: { user: { select: { id: true } } } },
      _count: { select: { applications: true } },
    },
  });
  if (!shift) notFound();

  // Reviews over de instelling (door professionals die er gewerkt hebben)
  const employerUserId = (shift.employer as any).user?.id ?? null;
  const employerReviews = employerUserId
    ? await prisma.review.findMany({
        where: { reviewedId: employerUserId },
        include: { reviewer: { select: { name: true, workerProfile: { select: { primaryFunction: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];
  const avgRating = employerReviews.length
    ? employerReviews.reduce((s, r) => s + r.rating, 0) / employerReviews.length
    : null;

  let existingApplication = null;
  if (userId) {
    existingApplication = await prisma.shiftApplication.findUnique({
      where: { shiftId_userId: { shiftId: params.id, userId } },
    });
  }

  const start = new Date(shift.startTime);
  const end = new Date(shift.endTime);

  const weekday = WEEKDAYS[start.getDay()];
  const dateStr = start.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const startTimeStr = start.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = end.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const breakMins = (shift as any).breakMinutes ?? 0;
  const durationHours = (
    (end.getTime() - start.getTime()) / 3600000 -
    breakMins / 60
  ).toFixed(1);

  const sectorLabel = SECTOR_LABELS[shift.sector] ?? shift.sector;
  const functionLabel = FUNCTION_LABELS[shift.function] ?? shift.function;
  const hourlyRate = `€\u00A0${Number(shift.hourlyRate).toFixed(2)}`;

  return (
    <>
      <Nav />

      {/* ── Dark hero strip ── */}
      <section
        className="relative overflow-hidden px-8 py-14"
        style={{ background: "var(--dark)", minHeight: "180px" }}
      >
        {/* radial glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(93,184,164,0.16) 0%, transparent 68%)",
          }}
        />
        {/* subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--teal-mid) 1px, transparent 1px), linear-gradient(90deg, var(--teal-mid) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Sector badge */}
          <div
            className="inline-flex items-center gap-2 rounded-[40px] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
            style={{
              background: "rgba(93,184,164,0.15)",
              color: "#5DB8A4",
              border: "1px solid rgba(93,184,164,0.3)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#5DB8A4" }}
            />
            {sectorLabel}
          </div>

          {/* Function title */}
          <h1
            className="text-[40px] font-bold leading-[1.1] tracking-[-1.5px] text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {functionLabel}
          </h1>

          {/* Employer + city */}
          <p
            className="mt-2 text-[15px] font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {shift.employer.companyName}
            {shift.city ? ` · ${shift.city}` : ""}
          </p>
        </div>
      </section>

      {/* ── Page body ── */}
      <div style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="max-w-4xl mx-auto px-8 py-8">

          {/* Back link */}
          <Link
            href="/diensten"
            className="inline-flex items-center gap-1.5 no-underline text-sm font-medium mb-8"
            style={{ color: "var(--muted)" }}
          >
            ← Terug naar diensten
          </Link>

          {/* Two-column layout */}
          <div className="flex gap-7 items-start">

            {/* ── LEFT column (3fr) ── */}
            <div className="flex-[3] min-w-0 space-y-5">

              {/* Dienst details card */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                {/* Over de dienst */}
                <div className="mb-6">
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                  >
                    Over de dienst
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {shift.description
                      ? shift.description
                      : "Deze instelling heeft nog geen aanvullende omschrijving toegevoegd voor deze dienst. Neem contact op via het platform na acceptatie voor meer informatie."}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="mb-6"
                  style={{ borderTop: "0.5px solid var(--border)" }}
                />

                {/* Vereisten */}
                <div className="mb-6">
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                  >
                    Vereisten
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shift.requiresBig && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[40px] px-3 py-1.5 text-[12px] font-semibold"
                        style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                      >
                        ✓ BIG-registratie vereist
                      </span>
                    )}
                    {(shift as any).requiresSkj && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[40px] px-3 py-1.5 text-[12px] font-semibold"
                        style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                      >
                        ✓ SKJ-registratie vereist
                      </span>
                    )}
                    {(shift as any).requiresKvk && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[40px] px-3 py-1.5 text-[12px] font-semibold"
                        style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                      >
                        ✓ KvK-inschrijving vereist
                      </span>
                    )}
                    {(shift as any).minExperience > 0 && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[40px] px-3 py-1.5 text-[12px] font-semibold"
                        style={{ background: "#fef9c3", color: "#854d0e" }}
                      >
                        Min. {(shift as any).minExperience} jaar ervaring
                      </span>
                    )}
                    {!shift.requiresBig &&
                      !(shift as any).requiresSkj &&
                      !(shift as any).requiresKvk &&
                      !((shift as any).minExperience > 0) && (
                        <span className="text-sm" style={{ color: "var(--muted)" }}>
                          Geen specifieke vereisten voor deze dienst.
                        </span>
                      )}
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="mb-6"
                  style={{ borderTop: "0.5px solid var(--border)" }}
                />

                {/* Locatie */}
                <div>
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                  >
                    Locatie
                  </h2>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">📍</span>
                    <div>
                      {(shift as any).address && (
                        <div className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                          {(shift as any).address}
                        </div>
                      )}
                      {((shift as any).postalCode || shift.city) && (
                        <div className="text-sm" style={{ color: "var(--muted)" }}>
                          {[(shift as any).postalCode, shift.city].filter(Boolean).join(" ")}
                        </div>
                      )}
                      {!(shift as any).address && !shift.city && (
                        <span className="text-sm" style={{ color: "var(--muted)" }}>
                          Locatie wordt gedeeld na acceptatie.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Over de instelling card */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                >
                  Over de instelling
                </h2>

                <div className="flex items-start gap-4">
                  {/* Logo / icon */}
                  {(shift.employer as any).logo ? (
                    <img
                      src={(shift.employer as any).logo}
                      alt={shift.employer.companyName}
                      className="w-14 h-14 rounded-xl object-contain flex-shrink-0"
                      style={{ border: "0.5px solid var(--border)" }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{ background: "var(--teal-light)" }}
                    >
                      🏥
                    </div>
                  )}

                  <div className="min-w-0">
                    {/* Company name + verified */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-base font-bold"
                        style={{ color: "var(--dark)" }}
                      >
                        {shift.employer.companyName}
                      </span>
                      {(shift.employer as any).kvkStatus === "VERIFIED" && (
                        <span
                          className="inline-flex items-center gap-1 rounded-[40px] px-2.5 py-0.5 text-[11px] font-bold"
                          style={{ background: "var(--teal-light)", color: "var(--teal)" }}
                        >
                          ✓ Geverifieerd
                        </span>
                      )}
                    </div>

                    {/* Sector */}
                    {(shift.employer as any).sector && (
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {SECTOR_LABELS[(shift.employer as any).sector] ??
                          (shift.employer as any).sector}
                      </div>
                    )}

                    {/* City */}
                    {(shift.employer as any).city && (
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        📍 {(shift.employer as any).city}
                      </div>
                    )}

                    {/* Description */}
                    {(shift.employer as any).description ? (
                      <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                        {((shift.employer as any).description as string).slice(0, 200)}
                        {((shift.employer as any).description as string).length > 200
                          ? "…"
                          : ""}
                      </p>
                    ) : (
                      <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                        {shift.employer.companyName} is een gecertificeerde zorginstelling die via
                        CaredIn op zoek is naar gekwalificeerde zorgprofessionals. Na acceptatie neem
                        je direct contact op via het platform.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Beoordelingen van de instelling ── */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "0.5px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                  >
                    Beoordelingen instelling
                  </h2>
                  {avgRating !== null && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ color: i <= Math.round(avgRating) ? "#F5A623" : "var(--border)", fontSize: "15px" }}>★</span>
                        ))}
                      </div>
                      <span className="text-base font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        ({employerReviews.length} {employerReviews.length === 1 ? "beoordeling" : "beoordelingen"})
                      </span>
                    </div>
                  )}
                </div>

                {employerReviews.length === 0 ? (
                  <div className="rounded-xl px-5 py-8 text-center" style={{ background: "var(--bg)" }}>
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Nog geen beoordelingen voor deze instelling.
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      Professionals kunnen een beoordeling achterlaten na afloop van een dienst.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employerReviews.map((r) => {
                      const rev = r as any;
                      const firstName = rev.reviewer?.name?.split(" ")[0] ?? "Professional";
                      const funcLabel = FUNCTION_LABELS[rev.reviewer?.workerProfile?.primaryFunction ?? ""] ?? null;
                      return (
                        <div
                          key={r.id}
                          className="rounded-xl px-4 py-4"
                          style={{ background: "var(--bg)", border: "0.5px solid var(--border)" }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: "var(--teal)" }}
                              >
                                {firstName[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate" style={{ color: "var(--dark)" }}>
                                  {firstName}
                                  {funcLabel ? (
                                    <span className="font-normal text-xs ml-1.5" style={{ color: "var(--muted)" }}>· {funcLabel}</span>
                                  ) : null}
                                </div>
                                <div className="text-xs" style={{ color: "var(--muted)" }}>
                                  {new Date(r.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              {[1,2,3,4,5].map(i => (
                                <span key={i} style={{ color: i <= r.rating ? "#F5A623" : "var(--border)", fontSize: "14px" }}>★</span>
                              ))}
                            </div>
                          </div>
                          {r.comment && (
                            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--muted)" }}>
                              &ldquo;{r.comment}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT column (2fr) ── */}
            <div className="flex-[2] min-w-0 sticky top-24 space-y-4">

              {/* Aanmelden card */}
              <div
                className="rounded-2xl bg-white p-6"
                style={{ border: "1.5px solid var(--teal)" }}
              >
                {/* Hourly rate */}
                <div
                  className="text-[34px] font-bold leading-none"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
                >
                  {hourlyRate}
                  <span
                    className="text-[16px] font-normal ml-1"
                    style={{ color: "var(--muted)" }}
                  >
                    /uur
                  </span>
                </div>

                {/* Date */}
                <div
                  className="mt-4 flex items-center gap-2 text-sm"
                  style={{ color: "var(--dark)" }}
                >
                  <span style={{ color: "var(--teal)" }}>📅</span>
                  <span className="font-medium capitalize">{weekday}</span>
                  <span style={{ color: "var(--muted)" }}>{dateStr}</span>
                </div>

                {/* Time */}
                <div
                  className="mt-2 flex items-center gap-2 text-sm"
                  style={{ color: "var(--dark)" }}
                >
                  <span style={{ color: "var(--teal)" }}>⏰</span>
                  <span className="font-medium">
                    {startTimeStr} – {endTimeStr}
                  </span>
                  <span style={{ color: "var(--muted)" }}>{durationHours} uur</span>
                </div>

                {/* Badges row */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {shift.isNightShift && (
                    <span
                      className="inline-flex items-center gap-1 rounded-[40px] px-3 py-1 text-[11px] font-bold text-white"
                      style={{ background: "#6366f1" }}
                    >
                      🌙 Nachtdienst
                    </span>
                  )}
                  {shift.isUrgent && (
                    <span
                      className="inline-flex items-center gap-1 rounded-[40px] px-3 py-1 text-[11px] font-bold text-white"
                      style={{ background: "#ef4444" }}
                    >
                      ⚡ Urgent
                    </span>
                  )}
                </div>

                {/* Applicant count */}
                <div
                  className="mt-4 text-[12px]"
                  style={{ color: "var(--muted)" }}
                >
                  {shift._count.applications}{" "}
                  professional{shift._count.applications !== 1 ? "s" : ""} aangemeld
                </div>

                {/* Divider */}
                <div
                  className="my-5"
                  style={{ borderTop: "0.5px solid var(--border)" }}
                />

                {/* Apply button or login prompt */}
                {session ? (
                  <ApplyButton
                    shiftId={shift.id}
                    applicationStatus={existingApplication?.status ?? null}
                    shiftStatus={shift.status}
                    isLoggedIn={true}
                  />
                ) : (
                  <div>
                    <ApplyButton
                      shiftId={shift.id}
                      applicationStatus={null}
                      shiftStatus={shift.status}
                      isLoggedIn={false}
                    />
                    <p
                      className="text-sm text-center mb-4 font-medium mt-3"
                      style={{ color: "var(--muted)" }}
                    >
                      Aanmelden vereist een account
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/inloggen?redirect=/diensten/${shift.id}`}
                        className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
                        style={{ background: "var(--teal)" }}
                      >
                        Inloggen
                      </Link>
                      <Link
                        href="/registreren"
                        className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-center no-underline"
                        style={{
                          border: "1.5px solid var(--teal)",
                          color: "var(--teal)",
                        }}
                      >
                        Account aanmaken
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Info card (teal-light) */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{ background: "var(--teal-light)", border: "0.5px solid var(--border)" }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5">💡</span>
                  <div>
                    <div
                      className="text-[13px] font-semibold mb-0.5"
                      style={{ color: "var(--dark)" }}
                    >
                      Na aanmelding
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--teal)" }}>
                      De instelling beoordeelt jouw aanmelding en accepteert of weigert binnen
                      24 uur. Je ontvangt een melding zodra er een beslissing is genomen.
                    </p>
                  </div>
                </div>

                <div
                  className="pt-3"
                  style={{ borderTop: "0.5px solid rgba(26,122,106,0.2)" }}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5">💶</span>
                    <div>
                      <div
                        className="text-[13px] font-semibold mb-0.5"
                        style={{ color: "var(--dark)" }}
                      >
                        Uitbetaling
                      </div>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--teal)" }}
                      >
                        Uitbetaling binnen 48 uur na goedkeuring van het ingediende urenformulier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
