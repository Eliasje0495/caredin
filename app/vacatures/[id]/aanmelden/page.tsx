import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import AanmeldenForm from "./AanmeldenForm";

export const dynamic = "force-dynamic";

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende",
  ZORGASSISTENT: "Zorgassistent", GGZ_AGOOG: "GGZ Agoog",
  PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider", GEDRAGSDESKUNDIGE: "Gedragsdeskundige",
  ARTS: "Arts", FYSIOTHERAPEUT: "Fysiotherapeut", ERGOTHERAPEUT: "Ergotherapeut",
  LOGOPEDIST: "Logopedist", KRAAMVERZORGENDE: "Kraamverzorgende", OVERIG: "Overig",
};

export default async function AanmeldenPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/inloggen?redirect=/vacatures/${params.id}/aanmelden`);
  }

  const userId = (session.user as any).id as string;

  const [shift, profile, existing] = await Promise.all([
    prisma.shift.findUnique({
      where: { id: params.id },
      include: { employer: { select: { companyName: true } } },
    }),
    prisma.workerProfile.findUnique({ where: { userId } }),
    prisma.shiftApplication.findUnique({
      where: { shiftId_userId: { shiftId: params.id, userId } },
    }),
  ]);

  if (!shift) notFound();

  // Already applied → back to shift page
  if (existing) {
    redirect(`/vacatures/${params.id}?aangemeld=1`);
  }

  if (shift.status !== "OPEN") {
    redirect(`/vacatures/${params.id}`);
  }

  const start = new Date(shift.startTime);
  const end   = new Date(shift.endTime);
  const dateStr   = start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const startTime = start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const endTime   = end.toLocaleTimeString("nl-NL",   { hour: "2-digit", minute: "2-digit" });
  const durationHours = ((end.getTime() - start.getTime()) / 3600000 - shift.breakMinutes / 60).toFixed(1);

  // Build requirements list
  type Requirement = { label: string; met: boolean; note?: string };
  const requirements: Requirement[] = [];
  let blockerMessage: string | undefined;
  let canApply = true;

  if (!profile) {
    canApply = false;
    blockerMessage = "Vul eerst je profiel in voordat je je kunt aanmelden.";
  } else {
    if (shift.requiresBig) {
      const met = profile.bigStatus === "VERIFIED";
      requirements.push({
        label: "BIG-registratie",
        met,
        note: met
          ? `BIG-nummer geverifieerd`
          : profile.bigNumber
          ? "BIG-nummer ingediend, nog in afwachting van verificatie"
          : "Voeg je BIG-nummer toe in je profiel",
      });
      if (!met) { canApply = false; blockerMessage = "Je hebt een geverifieerde BIG-registratie nodig voor deze dienst."; }
    }

    if (shift.requiresSkj) {
      const met = profile.skjStatus === "VERIFIED";
      requirements.push({
        label: "SKJ-registratie",
        met,
        note: met
          ? "SKJ-registratie geverifieerd"
          : profile.skjNumber
          ? "SKJ-nummer ingediend, nog in afwachting van verificatie"
          : "Voeg je SKJ-nummer toe in je profiel",
      });
      if (!met && canApply) { canApply = false; blockerMessage = "Je hebt een geverifieerde SKJ-registratie nodig voor deze dienst."; }
    }

    if (shift.requiresKvk) {
      const met = profile.kvkStatus === "VERIFIED";
      requirements.push({
        label: "KvK-inschrijving",
        met,
        note: met
          ? `KvK geverifieerd (${profile.kvkCompanyName ?? profile.kvkNumber})`
          : profile.kvkNumber
          ? "KvK-nummer ingediend, verificatie loopt"
          : "Voeg je KvK-nummer toe in je profiel",
      });
      if (!met && canApply) { canApply = false; blockerMessage = "Je hebt een geverifieerde KvK-inschrijving nodig voor deze dienst."; }
    }

    if (shift.minExperience > 0) {
      requirements.push({
        label: `Minimaal ${shift.minExperience} jaar werkervaring`,
        met: true,
        note: "Jij bent verantwoordelijk voor de juistheid van je ervaringsjaren",
      });
    }
  }

  const overeenkomstUrl = `/api/shifts/${params.id}/overeenkomst`;

  return (
    <>
      <Nav />

      {/* Banner */}
      <div className="px-8 py-10 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto">
          <Link href={`/vacatures/${params.id}`} className="no-underline text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            ← Terug naar dienst
          </Link>
          <h1 className="text-[36px] font-bold text-white tracking-[-1px] mt-3"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Aanmelden voor dienst
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            {FUNCTION_LABELS[shift.function] ?? shift.function} · {shift.employer.companyName}
          </p>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-8 py-8">

          {/* Shift summary */}
          <div className="rounded-2xl p-5 mb-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: "var(--muted)" }}>
              Dienstoverzicht
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Datum",     value: dateStr },
                { label: "Tijd",      value: `${startTime} – ${endTime}` },
                { label: "Duur",      value: `${durationHours} uur netto` },
                { label: "Tarief",    value: `€${Number(shift.hourlyRate).toFixed(2)}/uur` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-3 py-2.5" style={{ background: "var(--teal-light)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-0.5" style={{ color: "var(--teal)" }}>
                    {label}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <AanmeldenForm
            shiftId={params.id}
            overeenkomstUrl={overeenkomstUrl}
            requirements={requirements}
            canApply={canApply}
            blockerMessage={blockerMessage}
          />

        </div>
      </div>
    </>
  );
}
