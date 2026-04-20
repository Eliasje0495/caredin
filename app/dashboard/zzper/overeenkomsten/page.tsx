export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformDoc {
  type: "platform";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  date: string;
  icon: string;
}

interface ModelDoc {
  type: "model";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  date: Date;
  status: string;
  shiftDate: Date;
  icon: string;
}

type Doc = PlatformDoc | ModelDoc;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NL = (d: Date) =>
  d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aangemeld",
  ACCEPTED: "Geaccepteerd",
  COMPLETED: "Wacht op goedkeuring",
  APPROVED: "Goedgekeurd",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Ingetrokken",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "#92400E",
  ACCEPTED: "#1E40AF",
  COMPLETED: "#7C3AED",
  APPROVED: "#065F46",
  REJECTED: "#991B1B",
  WITHDRAWN: "#6B7280",
};

// ─── Static platform documents ────────────────────────────────────────────────

const PLATFORM_DOCS: PlatformDoc[] = [
  {
    type: "platform",
    id: "gebruikersovereenkomst",
    title: "Gebruikersovereenkomst",
    subtitle: "Algemene voorwaarden voor gebruik van het CaredIn-platform",
    href: "/voorwaarden",
    date: "1 januari 2025",
    icon: "📋",
  },
  {
    type: "platform",
    id: "privacybeleid",
    title: "Privacybeleid",
    subtitle: "Hoe CaredIn omgaat met jouw persoonsgegevens (AVG)",
    href: "/privacy",
    date: "1 januari 2025",
    icon: "🔒",
  },
  {
    type: "platform",
    id: "verwerkersovereenkomst",
    title: "Verwerkersovereenkomst",
    subtitle: "AVG-verwerkingsafspraken tussen jou en CaredIn",
    href: "/verwerkersovereenkomst",
    date: "1 januari 2025",
    icon: "🛡️",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OvereenkomstenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const userId = (session.user as any).id as string;

  const applications = await prisma.shiftApplication.findMany({
    where: { userId, overeenkomstUrl: { not: null } },
    include: {
      shift: {
        select: { id: true, title: true, startTime: true, employer: { select: { companyName: true } } },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  const modelDocs: ModelDoc[] = applications.map((app) => ({
    type: "model",
    id: app.id,
    title: "Modelovereenkomst van Opdracht",
    subtitle: `${app.shift.employer.companyName} — ${app.shift.title}`,
    href: `/api/shifts/${app.shift.id}/overeenkomst`,
    date: app.appliedAt,
    shiftDate: app.shift.startTime,
    status: app.status,
    icon: "📄",
  }));

  const groups: { label: string; description: string; docs: Doc[] }[] = [
    {
      label: "Modelovereenkomst van Opdracht",
      description: "Per dienst automatisch gegenereerd bij aanmelding. Gebaseerd op Belastingdienst nr. 90615.36558.",
      docs: modelDocs,
    },
    {
      label: "Platformovereenkomsten",
      description: "Geldend voor alle gebruikers van het CaredIn-platform.",
      docs: PLATFORM_DOCS,
    },
  ];

  const totalDocs = modelDocs.length + PLATFORM_DOCS.length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header
        className="bg-white px-8 h-[60px] flex items-center justify-between sticky top-0 z-40"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link href="/" className="text-lg font-bold no-underline"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
          Care<span style={{ color: "var(--dark)" }}>din</span>
        </Link>
        <nav className="flex gap-6">
          {[
            { href: "/dashboard/zzper", label: "Dashboard" },
            { href: "/vacatures", label: "Diensten zoeken" },
            { href: "/dashboard/zzper/timesheets", label: "Mijn diensten" },
            { href: "/dashboard/zzper/overeenkomsten", label: "Overeenkomsten" },
          ].map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium no-underline"
              style={{ color: n.href === "/dashboard/zzper/overeenkomsten" ? "var(--teal)" : "var(--muted)" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "var(--teal)" }}>
          {session.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Mijn overeenkomsten
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {totalDocs} document{totalDocs !== 1 ? "en" : ""} · Altijd beschikbaar voor download
          </p>
        </div>

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.label}>
              {/* Group heading */}
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] mb-0.5"
                  style={{ color: "var(--teal)" }}>
                  {group.label}
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{group.description}</p>
              </div>

              {group.docs.length === 0 ? (
                <div className="rounded-2xl px-6 py-10 text-center bg-white"
                  style={{ border: "0.5px solid var(--border)" }}>
                  <div className="text-3xl mb-3">📭</div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Nog geen modelovereenkomsten. Meld je aan voor een dienst om er een te ontvangen.
                  </p>
                  <Link href="/vacatures"
                    className="inline-flex mt-4 px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
                    style={{ background: "var(--teal)" }}>
                    Diensten bekijken →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {group.docs.map((doc) => (
                    <DocRow key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Legal footer note */}
        <div className="mt-12 rounded-2xl px-6 py-5 text-xs leading-relaxed"
          style={{ background: "#F0F7F5", color: "var(--muted)", border: "0.5px solid var(--border)" }}>
          <span className="font-semibold" style={{ color: "var(--dark)" }}>Juridische informatie · </span>
          Modelovereenkomsten zijn gebaseerd op Belastingdienst-modelovereenkomst nr. 90615.36558 en
          versterkt met schijnzelfstandigheidsclausules conform de DBA-wetgeving en jurisprudentie 2025–2026.
          Bewaar deze documenten voor je administratie. Bij vragen: <a href="mailto:support@caredin.nl"
            className="no-underline font-medium" style={{ color: "var(--teal)" }}>support@caredin.nl</a>.
        </div>
      </main>
    </div>
  );
}

// ─── Row component ─────────────────────────────────────────────────────────────

function DocRow({ doc }: { doc: Doc }) {
  if (doc.type === "platform") {
    return (
      <a
        href={doc.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl px-5 py-4 bg-white no-underline group transition-colors hover:shadow-sm"
        style={{ border: "0.5px solid var(--border)" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "var(--bg)" }}>
          {doc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{doc.title}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{doc.subtitle}</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Ingangsdatum: {doc.date}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#F0F7F5", color: "var(--teal)" }}>
            Platform
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--muted)" }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </a>
    );
  }

  // model doc
  const statusColor = STATUS_COLOR[doc.status] ?? "var(--muted)";
  const statusLabel = STATUS_LABEL[doc.status] ?? doc.status;

  return (
    <a
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl px-5 py-4 bg-white no-underline group transition-colors hover:shadow-sm"
      style={{ border: "0.5px solid var(--border)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "var(--bg)" }}>
        {doc.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{doc.title}</div>
        <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{doc.subtitle}</div>
        <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
          Dienst: {NL(doc.shiftDate)} · Aangemeld: {NL(doc.date)}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: statusColor + "18", color: statusColor }}>
          {statusLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "var(--muted)" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
    </a>
  );
}
