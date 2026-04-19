export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BigActions from "./BigActions";

export default async function BigVerificatiesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const pendingProfiles = await prisma.workerProfile.findMany({
    where: { bigStatus: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

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
          BIG Verificaties
        </h1>
        <p style={{ color: "#5A7570", fontSize: 14, marginTop: 4 }}>
          {pendingProfiles.length} aanvra{pendingProfiles.length === 1 ? "ag" : "gen"} wacht{pendingProfiles.length === 1 ? "" : "en"} op beoordeling
        </p>
      </div>

      {pendingProfiles.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "0.5px solid rgba(26,122,106,0.15)",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0F1C1A" }}>
            Geen openstaande BIG verificaties
          </div>
          <div style={{ fontSize: 13, color: "#5A7570", marginTop: 6 }}>
            Alle aanvragen zijn beoordeeld
          </div>
        </div>
      ) : (
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
                {["Professional", "E-mail", "BIG nummer", "Aangevraagd op", "Acties"].map((h) => (
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
              {pendingProfiles.map((profile) => (
                <tr
                  key={profile.id}
                  style={{ borderBottom: "0.5px solid rgba(26,122,106,0.08)" }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
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
                        {profile.user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C1A" }}>
                          {profile.user.name ?? "Onbekend"}
                        </div>
                        <div style={{ fontSize: 11, color: "#5A7570", marginTop: 1 }}>
                          ID: {profile.userId.slice(0, 8)}…
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#5A7570" }}>
                    {profile.user.email}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {profile.bigNumber ? (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F1C1A",
                          fontFamily: "monospace",
                          background: "#F3F4F6",
                          padding: "3px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {profile.bigNumber}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
                        Niet opgegeven
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 12, color: "#5A7570" }}>
                    {new Date(profile.createdAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <BigActions userId={profile.userId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
