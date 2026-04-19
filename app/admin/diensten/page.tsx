export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShiftStatus } from "@prisma/client";

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  OPEN:        { bg: "#D1FAE5", color: "#065F46", label: "Open" },
  FILLED:      { bg: "#DBEAFE", color: "#1E40AF", label: "Gevuld" },
  IN_PROGRESS: { bg: "#FEF3C7", color: "#92400E", label: "Bezig" },
  COMPLETED:   { bg: "#EDE9FE", color: "#5B21B6", label: "Voltooid" },
  APPROVED:    { bg: "#D1FAE5", color: "#065F46", label: "Goedgekeurd" },
  CANCELLED:   { bg: "#F3F4F6", color: "#4B5563", label: "Geannuleerd" },
};

interface PageProps {
  searchParams: { status?: string };
}

export default async function DienstenPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const validStatuses: ShiftStatus[] = ["OPEN", "FILLED", "IN_PROGRESS", "COMPLETED", "APPROVED", "CANCELLED"];
  const statusFilter = searchParams.status as ShiftStatus | undefined;
  const whereStatus =
    statusFilter && validStatuses.includes(statusFilter) ? statusFilter : undefined;

  const shifts = await prisma.shift.findMany({
    where: whereStatus ? { status: whereStatus } : {},
    include: { employer: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  function buildUrl(status?: string) {
    if (!status) return "/admin/diensten";
    return `/admin/diensten?status=${status}`;
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
          Diensten
        </h1>
        <p style={{ color: "#5A7570", fontSize: 14, marginTop: 4 }}>
          {shifts.length} diensten {whereStatus ? `met status ${whereStatus}` : "(meest recente 50)"}
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
              {["Dienst", "Instelling", "Sector", "Status", "Datum", "Uurtarief"].map((h) => (
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
            {shifts.map((shift) => {
              const sc = statusConfig[shift.status] ?? { bg: "#F3F4F6", color: "#4B5563", label: shift.status };
              return (
                <tr
                  key={shift.id}
                  style={{ borderBottom: "0.5px solid rgba(26,122,106,0.08)" }}
                >
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>
                      {shift.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#5A7570", marginTop: 1 }}>
                      {shift.city}
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#5A7570" }}>
                    {shift.employer.companyName}
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: "#5A7570" }}>
                    {shift.sector}
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
                    {new Date(shift.startTime).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>
                    €{Number(shift.hourlyRate).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {shifts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: "32px", textAlign: "center", color: "#5A7570", fontSize: 13 }}
                >
                  Geen diensten gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
