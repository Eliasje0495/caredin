export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: "#FEF3C7", color: "#92400E",  label: "In behandeling" },
  ACCEPTED:  { bg: "#D1FAE5", color: "#065F46",  label: "Geaccepteerd" },
  REJECTED:  { bg: "#FEE2E2", color: "#991B1B",  label: "Afgewezen" },
  WITHDRAWN: { bg: "#F3F4F6", color: "#4B5563",  label: "Ingetrokken" },
  COMPLETED: { bg: "#DBEAFE", color: "#1E40AF",  label: "Voltooid" },
  APPROVED:  { bg: "#D1FAE5", color: "#065F46",  label: "Goedgekeurd" },
};

interface PageProps {
  searchParams: { status?: string };
}

export default async function AanmeldingenPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const validStatuses: ApplicationStatus[] = [
    "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN", "COMPLETED", "APPROVED",
  ];
  const statusFilter = searchParams.status as ApplicationStatus | undefined;
  const whereStatus =
    statusFilter && validStatuses.includes(statusFilter) ? statusFilter : undefined;

  const applications = await prisma.shiftApplication.findMany({
    where: whereStatus ? { status: whereStatus } : {},
    include: {
      user: { select: { name: true, email: true } },
      shift: { select: { title: true, city: true, sector: true } },
    },
    orderBy: { appliedAt: "desc" },
    take: 50,
  });

  function buildUrl(status?: string) {
    if (!status) return "/admin/aanmeldingen";
    return `/admin/aanmeldingen?status=${status}`;
  }

  return (
    <div style={{ padding: "36px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 28,
            fontWeight: 700,
            color: "#0F1C1A",
            margin: 0,
          }}
        >
          Aanmeldingen
        </h1>
        <p style={{ color: "#5A7570", fontSize: 14, marginTop: 4 }}>
          {applications.length} aanmeldingen{whereStatus ? ` met status ${statusConfig[whereStatus]?.label ?? whereStatus}` : " (meest recente 50)"}
        </p>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[undefined, ...validStatuses].map((s) => {
          const active = (s ?? "") === (whereStatus ?? "");
          const cfg = s ? statusConfig[s] : null;
          return (
            <Link
              key={s ?? "all"}
              href={buildUrl(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 40,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                background: active ? "#0F1C1A" : (cfg?.bg ?? "#fff"),
                color: active ? "#fff" : (cfg?.color ?? "#5A7570"),
                border: `0.5px solid ${active ? "#0F1C1A" : "rgba(26,122,106,0.2)"}`,
              }}
            >
              {s ? statusConfig[s].label : "Alle"}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "0.5px solid rgba(26,122,106,0.15)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Professional", "Dienst", "Sector", "Status", "Aangemeld op"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 20px",
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
            {applications.map((app) => {
              const sc = statusConfig[app.status] ?? { bg: "#F3F4F6", color: "#4B5563", label: app.status };
              return (
                <tr
                  key={app.id}
                  style={{ borderBottom: "0.5px solid rgba(26,122,106,0.08)" }}
                >
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>
                      {app.user.name ?? "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "#5A7570", marginTop: 1 }}>
                      {app.user.email}
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ fontSize: 13, color: "#0F1C1A" }}>{app.shift.title}</div>
                    <div style={{ fontSize: 11, color: "#5A7570", marginTop: 1 }}>
                      {app.shift.city}
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: "#5A7570" }}>
                    {app.shift.sector}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.color,
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: "#5A7570" }}>
                    {new Date(app.appliedAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "32px", textAlign: "center", color: "#5A7570", fontSize: 13 }}
                >
                  Geen aanmeldingen gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
