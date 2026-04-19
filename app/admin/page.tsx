export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    PENDING:   { bg: "#FEF3C7", color: "#92400E" },
    ACCEPTED:  { bg: "#D1FAE5", color: "#065F46" },
    REJECTED:  { bg: "#FEE2E2", color: "#991B1B" },
    WITHDRAWN: { bg: "#F3F4F6", color: "#4B5563" },
    COMPLETED: { bg: "#DBEAFE", color: "#1E40AF" },
    APPROVED:  { bg: "#D1FAE5", color: "#065F46" },
  };
  const s = map[status] ?? { bg: "#F3F4F6", color: "#4B5563" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const [
    totalUsers,
    totalWorkers,
    totalEmployers,
    totalShifts,
    pendingBig,
    openShifts,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workerProfile.count(),
    prisma.employer.count(),
    prisma.shift.count(),
    prisma.workerProfile.count({ where: { bigStatus: "PENDING" } }),
    prisma.shift.count({ where: { status: "OPEN" } }),
    prisma.shiftApplication.findMany({
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        shift: { select: { title: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Totaal gebruikers",       value: totalUsers,     sub: "geregistreerde accounts" },
    { label: "Zorgprofessionals",        value: totalWorkers,   sub: "worker profielen" },
    { label: "Zorginstellingen",         value: totalEmployers, sub: "werkgevers" },
    { label: "Totaal diensten",          value: totalShifts,    sub: "alle diensten" },
    { label: "Registratieverificaties",         value: pendingBig,     sub: "wacht op beoordeling", alert: pendingBig > 0 },
    { label: "Open diensten",            value: openShifts,     sub: "actief beschikbaar" },
  ];

  const quickActions = [
    { href: "/admin/gebruikers",   label: "Alle gebruikers bekijken",       desc: "Beheer workers en werkgevers" },
    { href: "/admin/big",          label: "Registratieverificaties beoordelen",    desc: `${pendingBig} wachten op actie` },
    { href: "/admin/diensten",     label: "Diensten overzicht",             desc: "Bekijk alle shifts" },
    { href: "/admin/aanmeldingen", label: "Aanmeldingen bekijken",          desc: "Status van alle aanmeldingen" },
  ];

  return (
    <div style={{ padding: "36px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 30,
            fontWeight: 700,
            color: "#0F1C1A",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "#5A7570", fontSize: 14, marginTop: 4 }}>
          Welkom terug — overzicht van het platform
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 36,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "20px 24px",
              border: `0.5px solid ${s.alert ? "#EF4444" : "rgba(26,122,106,0.15)"}`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "var(--font-fraunces)",
                color: s.alert ? "#EF4444" : "#1A7A6A",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F1C1A" }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "#5A7570", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Recent applications */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "0.5px solid rgba(26,122,106,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "0.5px solid rgba(26,122,106,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F1C1A", margin: 0 }}>
              Recente aanmeldingen
            </h2>
            <Link
              href="/admin/aanmeldingen"
              style={{ fontSize: 12, color: "#1A7A6A", textDecoration: "none", fontWeight: 500 }}
            >
              Alle bekijken →
            </Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Professional", "Dienst", "Status", "Datum"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 24px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#5A7570",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderBottom: "0.5px solid rgba(26,122,106,0.15)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id} style={{ borderBottom: "0.5px solid rgba(26,122,106,0.1)" }}>
                  <td style={{ padding: "12px 24px", fontSize: 13, color: "#0F1C1A", fontWeight: 500 }}>
                    {app.user.name ?? app.user.email}
                  </td>
                  <td style={{ padding: "12px 24px", fontSize: 13, color: "#5A7570" }}>
                    {app.shift.title}
                  </td>
                  <td style={{ padding: "12px 24px" }}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ padding: "12px 24px", fontSize: 12, color: "#5A7570" }}>
                    {new Date(app.appliedAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#5A7570", fontSize: 13 }}>
                    Geen aanmeldingen gevonden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "0.5px solid rgba(26,122,106,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "0.5px solid rgba(26,122,106,0.15)",
            }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F1C1A", margin: 0 }}>
              Snelle acties
            </h2>
          </div>
          <div style={{ padding: "12px" }}>
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 10,
                  textDecoration: "none",
                  marginBottom: 4,
                  transition: "background 0.15s",
                }}
                className="admin-quick-action"
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#5A7570", marginTop: 2 }}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
