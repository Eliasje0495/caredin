"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Employer = { id: string; companyName: string };
type Regel = { omschrijving: string; datum: string; uren: string; tarief: string };

const today = new Date().toISOString().split("T")[0];
const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
const lastOfMonth  = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0];

export default function NieuweDeclaratieForm({
  employers,
  defaultTarief,
}: {
  employers: Employer[];
  defaultTarief: number;
}) {
  const router = useRouter();
  const [employerId, setEmployerId]     = useState(employers[0]?.id ?? "");
  const [periodeStart, setPeriodeStart] = useState(firstOfMonth);
  const [periodeEinde, setPeriodeEinde] = useState(lastOfMonth);
  const [notitie, setNotitie]           = useState("");
  const [regels, setRegels]             = useState<Regel[]>([
    { omschrijving: "", datum: today, uren: "8", tarief: String(defaultTarief || 55) },
  ]);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  function updateRegel(i: number, field: keyof Regel, val: string) {
    setRegels(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  function addRegel() {
    const last = regels[regels.length - 1];
    setRegels(prev => [...prev, { omschrijving: "", datum: today, uren: "8", tarief: last?.tarief ?? "55" }]);
  }

  function removeRegel(i: number) {
    setRegels(prev => prev.filter((_, idx) => idx !== i));
  }

  const totaal = regels.reduce((s, r) => s + (parseFloat(r.uren) || 0) * (parseFloat(r.tarief) || 0), 0);

  async function submit(indienen: boolean) {
    if (!employerId) return setError("Selecteer een opdrachtgever.");
    if (regels.some(r => !r.omschrijving.trim())) return setError("Vul alle omschrijvingen in.");
    setError("");
    setSaving(true);
    const res = await fetch("/api/declaraties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employerId, periodeStart, periodeEinde, notitie, indienen,
        regels: regels.map(r => ({
          omschrijving: r.omschrijving,
          datum:        r.datum,
          uren:         parseFloat(r.uren) || 0,
          tarief:       parseFloat(r.tarief) || 0,
          bedrag:       (parseFloat(r.uren) || 0) * (parseFloat(r.tarief) || 0),
        })),
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/dashboard/zzper/declaraties");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Er ging iets mis.");
    }
  }

  const inputStyle = {
    border: "0.5px solid var(--border)",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "13px",
    color: "var(--dark)",
    background: "#fff",
    fontFamily: "inherit",
    width: "100%",
    outline: "none",
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--dark)",
    display: "block",
    marginBottom: "5px",
  } as React.CSSProperties;

  return (
    <div className="space-y-6">
      {/* Opdrachtgever + Periode */}
      <div className="rounded-2xl bg-white p-6 space-y-5" style={{ border: "0.5px solid var(--border)" }}>
        <h2 className="text-sm font-bold" style={{ color: "var(--dark)" }}>Declaratie gegevens</h2>

        <div>
          <label style={labelStyle}>Opdrachtgever</label>
          {employers.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Je hebt nog geen gewerkte diensten. Rond een dienst af om te declareren.
            </p>
          ) : (
            <select value={employerId} onChange={e => setEmployerId(e.target.value)} style={inputStyle}>
              {employers.map(e => <option key={e.id} value={e.id}>{e.companyName}</option>)}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Periode van</label>
            <input type="date" value={periodeStart} onChange={e => setPeriodeStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Periode tot</label>
            <input type="date" value={periodeEinde} onChange={e => setPeriodeEinde(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notitie (optioneel)</label>
          <textarea rows={2} value={notitie} onChange={e => setNotitie(e.target.value)}
            placeholder="Eventuele toelichting voor de opdrachtgever…"
            style={{ ...inputStyle, resize: "none" }} />
        </div>
      </div>

      {/* Regels */}
      <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--dark)" }}>Declaratieregels</h2>
          <button onClick={addRegel}
            className="text-xs font-semibold px-3 py-1.5 rounded-[40px] cursor-pointer"
            style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none", fontFamily: "inherit" }}>
            + Regel toevoegen
          </button>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {regels.map((r, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-[1fr_120px_90px_90px_32px] gap-3 items-end">
              <div>
                {i === 0 && <label style={labelStyle}>Omschrijving</label>}
                <input type="text" value={r.omschrijving}
                  onChange={e => updateRegel(i, "omschrijving", e.target.value)}
                  placeholder="bijv. Verpleegkundige zorg — afdeling B"
                  style={inputStyle} />
              </div>
              <div>
                {i === 0 && <label style={labelStyle}>Datum</label>}
                <input type="date" value={r.datum}
                  onChange={e => updateRegel(i, "datum", e.target.value)}
                  style={inputStyle} />
              </div>
              <div>
                {i === 0 && <label style={labelStyle}>Uren</label>}
                <input type="number" min="0" step="0.5" value={r.uren}
                  onChange={e => updateRegel(i, "uren", e.target.value)}
                  style={inputStyle} />
              </div>
              <div>
                {i === 0 && <label style={labelStyle}>Tarief (€)</label>}
                <input type="number" min="0" step="0.5" value={r.tarief}
                  onChange={e => updateRegel(i, "tarief", e.target.value)}
                  style={inputStyle} />
              </div>
              <div>
                {i === 0 && <div style={{ height: 22 }} />}
                {regels.length > 1 && (
                  <button onClick={() => removeRegel(i)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer"
                    style={{ background: "#FEF2F2", color: "#991B1B", border: "none", fontFamily: "inherit" }}>
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totaal */}
        <div className="px-6 py-4 flex items-center justify-end gap-4"
          style={{ borderTop: "0.5px solid var(--border)", background: "#FAFAFA" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Totaal</span>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
            €{totaal.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium px-1" style={{ color: "#991B1B" }}>{error}</p>
      )}

      {/* Acties */}
      <div className="flex items-center gap-3">
        <button onClick={() => submit(false)} disabled={saving}
          className="px-6 py-3 rounded-[40px] text-sm font-semibold cursor-pointer"
          style={{ background: "#F3F4F6", color: "var(--dark)", border: "none", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
          Opslaan als concept
        </button>
        <button onClick={() => submit(true)} disabled={saving}
          className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white cursor-pointer"
          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Bezig…" : "📤 Indienen bij opdrachtgever"}
        </button>
        <Link href="/dashboard/zzper/declaraties"
          className="text-sm no-underline" style={{ color: "var(--muted)" }}>
          Annuleren
        </Link>
      </div>
    </div>
  );
}
