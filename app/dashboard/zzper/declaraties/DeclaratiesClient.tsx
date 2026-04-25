"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Declaratie = {
  id: string;
  nummer: string;
  status: string;
  periodeStart: string;
  periodeEinde: string;
  totaalBedrag: number;
  ingediendAt: string | null;
  goedgekeurdAt: string | null;
  betaaldAt: string | null;
  afwijzingReden: string | null;
  employer: { id: string; companyName: string };
  regels: { id: string; omschrijving: string; uren: number; tarief: number; bedrag: number }[];
};

const STATUS_LABEL: Record<string, string> = {
  CONCEPT:     "Concept",
  INGEDIEND:   "Ingediend",
  GOEDGEKEURD: "Goedgekeurd",
  AFGEWEZEN:   "Afgewezen",
  BETAALD:     "Betaald",
};
const STATUS_COLOR: Record<string, string> = {
  CONCEPT:     "#6B7280",
  INGEDIEND:   "#1E40AF",
  GOEDGEKEURD: "#065F46",
  AFGEWEZEN:   "#991B1B",
  BETAALD:     "var(--teal)",
};

const TABS = ["Alle", "Concept", "Ingediend", "Goedgekeurd", "Afgewezen", "Betaald"];

export default function DeclaratiesClient({
  declaraties: initial,
}: {
  declaraties: Declaratie[];
  employers: { id: string; companyName: string }[];
}) {
  const router = useRouter();
  const [declaraties, setDeclaraties] = useState(initial);
  const [tab, setTab] = useState("Alle");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = tab === "Alle" ? declaraties
    : declaraties.filter(d => STATUS_LABEL[d.status] === tab);

  async function handleAction(id: string, action: string) {
    setLoading(id + action);
    await fetch(`/api/declaraties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Declaratie verwijderen?")) return;
    setLoading(id + "delete");
    await fetch(`/api/declaraties/${id}`, { method: "DELETE" });
    setDeclaraties(prev => prev.filter(d => d.id !== id));
    setLoading(null);
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  const fmtPeriode = (s: string, e: string) => {
    const start = new Date(s);
    const end   = new Date(e);
    return `${start.toLocaleDateString("nl-NL", { month: "long" })} ${start.getFullYear()}` +
      (start.getMonth() !== end.getMonth() ? ` – ${end.toLocaleDateString("nl-NL", { month: "long" })} ${end.getFullYear()}` : "");
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-[40px] text-[12px] font-semibold transition-colors cursor-pointer"
            style={{
              background: tab === t ? "var(--teal)" : "#fff",
              color:      tab === t ? "#fff" : "var(--muted)",
              border:     tab === t ? "none" : "0.5px solid var(--border)",
              fontFamily: "inherit",
            }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white text-center py-16" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>Geen declaraties</p>
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Maak je eerste declaratie aan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
              {/* Row */}
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>{d.nummer}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: (STATUS_COLOR[d.status] ?? "#6B7280") + "18", color: STATUS_COLOR[d.status] ?? "#6B7280" }}>
                      {STATUS_LABEL[d.status]}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {d.employer.companyName} · {fmtPeriode(d.periodeStart, d.periodeEinde)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>
                    €{Number(d.totaalBedrag).toFixed(2)}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {d.regels.length} regel{d.regels.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>{expanded === d.id ? "▲" : "▼"}</span>
              </div>

              {/* Expanded detail */}
              {expanded === d.id && (
                <div style={{ borderTop: "0.5px solid var(--border)" }}>
                  {/* Regels tabel */}
                  <div className="px-5 py-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="text-left pb-2 font-semibold">Omschrijving</th>
                          <th className="text-right pb-2 font-semibold">Datum</th>
                          <th className="text-right pb-2 font-semibold">Uren</th>
                          <th className="text-right pb-2 font-semibold">Tarief</th>
                          <th className="text-right pb-2 font-semibold">Bedrag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.regels.map(r => (
                          <tr key={r.id} style={{ borderTop: "0.5px solid var(--border)" }}>
                            <td className="py-2 pr-4" style={{ color: "var(--dark)" }}>{r.omschrijving}</td>
                            <td className="py-2 text-right" style={{ color: "var(--muted)" }}>—</td>
                            <td className="py-2 text-right" style={{ color: "var(--muted)" }}>{Number(r.uren).toFixed(2)}</td>
                            <td className="py-2 text-right" style={{ color: "var(--muted)" }}>€{Number(r.tarief).toFixed(2)}</td>
                            <td className="py-2 text-right font-semibold" style={{ color: "var(--dark)" }}>€{Number(r.bedrag).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr style={{ borderTop: "1px solid var(--dark)" }}>
                          <td colSpan={4} className="pt-3 text-sm font-bold" style={{ color: "var(--dark)" }}>Totaal</td>
                          <td className="pt-3 text-right text-sm font-bold" style={{ color: "var(--teal)" }}>
                            €{Number(d.totaalBedrag).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Afwijzingsreden */}
                  {d.afwijzingReden && (
                    <div className="mx-5 mb-4 rounded-xl px-4 py-3 text-xs"
                      style={{ background: "#FEF2F2", border: "0.5px solid #FECACA", color: "#991B1B" }}>
                      <strong>Afwijzingsreden:</strong> {d.afwijzingReden}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="px-5 pb-4 flex items-center gap-6 text-[11px]" style={{ color: "var(--muted)" }}>
                    {d.ingediendAt  && <span>📤 Ingediend: {fmtDate(d.ingediendAt)}</span>}
                    {d.goedgekeurdAt && <span>✅ Goedgekeurd: {fmtDate(d.goedgekeurdAt)}</span>}
                    {d.betaaldAt    && <span>💶 Betaald: {fmtDate(d.betaaldAt)}</span>}
                  </div>

                  {/* Acties */}
                  <div className="px-5 pb-4 flex gap-2 flex-wrap">
                    <a href={`/api/declaraties/${d.id}/pdf`} download={`${d.nummer}.html`}
                      className="px-4 py-1.5 rounded-[40px] text-xs font-semibold no-underline"
                      style={{ background: "#F3F4F6", color: "var(--dark)" }}>
                      📄 Downloaden
                    </a>
                    {d.status === "CONCEPT" && (
                      <>
                        <button onClick={() => handleAction(d.id, "indienen")} disabled={!!loading}
                          className="px-4 py-1.5 rounded-[40px] text-xs font-semibold cursor-pointer text-white"
                          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}>
                          {loading === d.id + "indienen" ? "Bezig…" : "📤 Indienen"}
                        </button>
                        <button onClick={() => handleDelete(d.id)} disabled={!!loading}
                          className="px-4 py-1.5 rounded-[40px] text-xs font-semibold cursor-pointer"
                          style={{ background: "#FEF2F2", color: "#991B1B", border: "none", fontFamily: "inherit" }}>
                          🗑 Verwijderen
                        </button>
                      </>
                    )}
                    {d.status === "INGEDIEND" && (
                      <button onClick={() => handleAction(d.id, "herroepen")} disabled={!!loading}
                        className="px-4 py-1.5 rounded-[40px] text-xs font-semibold cursor-pointer"
                        style={{ background: "#F3F4F6", color: "var(--muted)", border: "none", fontFamily: "inherit" }}>
                        ↩ Herroepen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
