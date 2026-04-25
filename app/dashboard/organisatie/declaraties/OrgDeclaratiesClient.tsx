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
  notitie: string | null;
  ingediendAt: string | null;
  goedgekeurdAt: string | null;
  betaaldAt: string | null;
  user: { name: string | null; email: string };
  regels: { id: string; omschrijving: string; datum: string; uren: number; tarief: number; bedrag: number }[];
};

const STATUS_LABEL: Record<string, string> = {
  CONCEPT: "Concept", INGEDIEND: "Ingediend", GOEDGEKEURD: "Goedgekeurd",
  AFGEWEZEN: "Afgewezen", BETAALD: "Betaald",
};
const STATUS_COLOR: Record<string, string> = {
  CONCEPT: "#6B7280", INGEDIEND: "#1E40AF", GOEDGEKEURD: "#065F46",
  AFGEWEZEN: "#991B1B", BETAALD: "var(--teal)",
};
const TABS = ["Alle", "Ingediend", "Goedgekeurd", "Afgewezen", "Betaald"];

export default function OrgDeclaratiesClient({ declaraties: initial }: { declaraties: Declaratie[] }) {
  const router = useRouter();
  const [declaraties, setDeclaraties] = useState(initial);
  const [tab, setTab]       = useState("Ingediend");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading]   = useState<string | null>(null);
  const [afwijzing, setAfwijzing] = useState<{ id: string; reden: string } | null>(null);

  const filtered = tab === "Alle" ? declaraties
    : declaraties.filter(d => STATUS_LABEL[d.status] === tab);

  async function handleAction(id: string, action: string, extra?: object) {
    setLoading(id + action);
    await fetch(`/api/declaraties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    setLoading(null);
    setAfwijzing(null);
    router.refresh();
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  const fmtPeriode = (s: string, e: string) => {
    const start = new Date(s);
    const end   = new Date(e);
    return `${start.toLocaleDateString("nl-NL", { month: "long" })} ${start.getFullYear()}` +
      (start.getMonth() !== end.getMonth() ? ` – ${end.toLocaleDateString("nl-NL", { month: "long" })} ${end.getFullYear()}` : "");
  };

  return (
    <>
      {/* Afwijzing modal */}
      {afwijzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setAfwijzing(null)}>
          <div className="rounded-2xl bg-white p-6 w-full max-w-md shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Declaratie afwijzen
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>Geef een reden op voor de professional.</p>
            <textarea rows={3} value={afwijzing.reden}
              onChange={e => setAfwijzing(a => a ? { ...a, reden: e.target.value } : null)}
              placeholder="bijv. Uren komen niet overeen met de planning…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none mb-4"
              style={{ border: "0.5px solid var(--border)", fontFamily: "inherit", color: "var(--dark)" }} />
            <div className="flex gap-2">
              <button onClick={() => handleAction(afwijzing.id, "afwijzen", { afwijzingReden: afwijzing.reden })}
                disabled={!afwijzing.reden.trim() || !!loading}
                className="flex-1 py-2.5 rounded-[40px] text-sm font-semibold text-white cursor-pointer"
                style={{ background: "#EF4444", border: "none", fontFamily: "inherit" }}>
                Afwijzen
              </button>
              <button onClick={() => setAfwijzing(null)}
                className="flex-1 py-2.5 rounded-[40px] text-sm font-semibold cursor-pointer"
                style={{ background: "#F3F4F6", color: "var(--dark)", border: "none", fontFamily: "inherit" }}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

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
            {t === "Ingediend" && declaraties.filter(d => d.status === "INGEDIEND").length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white"
                style={{ background: "#EF4444" }}>
                {declaraties.filter(d => d.status === "INGEDIEND").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white text-center py-16" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-sm font-semibold" style={{ color: "var(--dark)" }}>Geen declaraties</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>{d.nummer}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: (STATUS_COLOR[d.status] ?? "#6B7280") + "18", color: STATUS_COLOR[d.status] ?? "#6B7280" }}>
                      {STATUS_LABEL[d.status]}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {d.user.name ?? d.user.email} · {fmtPeriode(d.periodeStart, d.periodeEinde)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>€{Number(d.totaalBedrag).toFixed(2)}</div>
                  {d.ingediendAt && (
                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                      Ingediend {fmtDate(d.ingediendAt)}
                    </div>
                  )}
                </div>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>{expanded === d.id ? "▲" : "▼"}</span>
              </div>

              {expanded === d.id && (
                <div style={{ borderTop: "0.5px solid var(--border)" }}>
                  {d.notitie && (
                    <div className="mx-5 mt-4 rounded-xl px-4 py-3 text-xs"
                      style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                      💬 <strong>Notitie:</strong> {d.notitie}
                    </div>
                  )}

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
                            <td className="py-2 text-right" style={{ color: "var(--muted)" }}>
                              {r.datum ? new Date(r.datum).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "—"}
                            </td>
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

                  {/* Acties */}
                  {d.status === "INGEDIEND" && (
                    <div className="px-5 pb-5 flex gap-2">
                      <button onClick={() => handleAction(d.id, "goedkeuren")} disabled={!!loading}
                        className="px-4 py-2 rounded-[40px] text-xs font-semibold text-white cursor-pointer"
                        style={{ background: "#16A34A", border: "none", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}>
                        ✅ Goedkeuren
                      </button>
                      <button onClick={() => setAfwijzing({ id: d.id, reden: "" })}
                        className="px-4 py-2 rounded-[40px] text-xs font-semibold cursor-pointer"
                        style={{ background: "#FEF2F2", color: "#991B1B", border: "none", fontFamily: "inherit" }}>
                        ✗ Afwijzen
                      </button>
                    </div>
                  )}
                  {d.status === "GOEDGEKEURD" && (
                    <div className="px-5 pb-5">
                      <button onClick={() => handleAction(d.id, "betaald")} disabled={!!loading}
                        className="px-4 py-2 rounded-[40px] text-xs font-semibold text-white cursor-pointer"
                        style={{ background: "var(--teal)", border: "none", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}>
                        💶 Markeren als betaald
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
