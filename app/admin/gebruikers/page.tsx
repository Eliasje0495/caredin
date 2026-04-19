export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserRole } from "@prisma/client";

const PAGE_SIZE = 20;

const roleColors: Record<string, { bg: string; color: string }> = {
  WORKER:   { bg: "#E8F7F4", color: "#1A7A6A" },
  EMPLOYER: { bg: "#DBEAFE", color: "#1E40AF" },
  ADMIN:    { bg: "#0F1C1A", color: "#5DB8A4" },
};

interface PageProps {
  searchParams: { role?: string; page?: string };
}

export default async function GebruikersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const pageNum = Math.max(0, parseInt(searchParams.page ?? "0", 10));
  const roleFilter = searchParams.role as UserRole | undefined;

  const validRoles: UserRole[] = ["WORKER", "EMPLOYER", "ADMIN"];
  const whereRole = roleFilter && validRoles.includes(roleFilter) ? roleFilter : undefined;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereRole ? { role: whereRole } : {},
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: pageNum * PAGE_SIZE,
    }),
    prisma.user.count({
      where: whereRole ? { role: whereRole } : {},
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.role) p.set("role", params.role);
    if (params.page && params.page !== "0") p.set("page", params.page);
    const qs = p.toString();
    return `/admin/gebruikers${qs ? `?${qs}` : ""}`;
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
          Gebruikers
        </h1>
        <p style={{ color: "#5A7570", fontSize: 14, marginTop: 4 }}>
          {totalCount} gebruikers in totaal
        </p>
      </div>

      {/* Role filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[undefined, "WORKER", "EMPLOYER", "ADMIN"].map((r) => {
          const active = (r ?? "") === (whereRole ?? "");
          return (
            <Link
              key={r ?? "all"}
              href={buildUrl({ role: r, page: "0" })}
              style={{
                padding: "6px 16px",
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                background: active ? "#0F1C1A" : "#fff",
                color: active ? "#fff" : "#5A7570",
                border: `0.5px solid ${active ? "#0F1C1A" : "rgba(26,122,106,0.2)"}`,
              }}
            >
              {r ?? "Alle"}
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
              {["Naam", "E-mail", "Rol", "Aangemeld op", "Acties"].map((h) => (
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
            {users.map((user) => {
              const badge = roleColors[user.role] ?? { bg: "#F3F4F6", color: "#4B5563" };
              return (
                <tr
                  key={user.id}
                  style={{ borderBottom: "0.5px solid rgba(26,122,106,0.08)" }}
                >
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "#1A7A6A",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>
                        {user.name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#5A7570" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: "#5A7570" }}>
                    {new Date(user.createdAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <Link
                      href={`/admin/gebruikers/${user.id}`}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1A7A6A",
                        textDecoration: "none",
                        padding: "5px 12px",
                        borderRadius: 40,
                        border: "0.5px solid rgba(26,122,106,0.3)",
                      }}
                    >
                      Bekijk
                    </Link>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "32px", textAlign: "center", color: "#5A7570", fontSize: 13 }}
                >
                  Geen gebruikers gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, justifyContent: "center" }}>
          {pageNum > 0 && (
            <Link
              href={buildUrl({ role: whereRole, page: String(pageNum - 1) })}
              style={{
                padding: "7px 16px",
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                background: "#fff",
                color: "#0F1C1A",
                border: "0.5px solid rgba(26,122,106,0.2)",
              }}
            >
              ← Vorige
            </Link>
          )}
          <span style={{ fontSize: 13, color: "#5A7570" }}>
            Pagina {pageNum + 1} van {totalPages}
          </span>
          {pageNum < totalPages - 1 && (
            <Link
              href={buildUrl({ role: whereRole, page: String(pageNum + 1) })}
              style={{
                padding: "7px 16px",
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                background: "#fff",
                color: "#0F1C1A",
                border: "0.5px solid rgba(26,122,106,0.2)",
              }}
            >
              Volgende →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
