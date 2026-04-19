"use client";
import { useState } from "react";

interface Shift {
  id: string;
  title: string;
  function: string;
  sector: string;
  status: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  city: string;
  isUrgent: boolean;
  applications: {
    status: string;
    hoursWorked: number | null;
    payoutAmount: number | null;
    platformFee: number | null;
    user: { name: string; email: string };
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open", FILLED: "Ingevuld", IN_PROGRESS: "Bezig",
  COMPLETED: "Afgerond", APPROVED: "Goedgekeurd", CANCELLED: "Geannuleerd",
};

const FUNCTION_LABELS: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegkundige", VERZORGENDE_IG: "Verzorgende IG",
  HELPENDE_PLUS: "Helpende Plus", HELPENDE: "Helpende", ZORGASSISTENT: "Zorgassistent",
  GGZ_AGOOG: "GGZ Agoog", PERSOONLIJK_BEGELEIDER: "Persoonlijk Begeleider",
  ARTS: "Arts", FYSIOTHERAPEUT: "Fysiotherapeut", OVERIG: "Overig",
};

export default function ExportClient({ shifts }: { shifts: Shift[] }) {
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = shifts.filter(s => {
    if (filter !== "all" && s.status !== filter) return false;
    if (from && new Date(s.startTime) < new Date(from)) return false;
    if (to && new Date(s.startTime) > new Date(to + "T23:59:59")) return false;
    return true;
  });

  function downloadCSV() {
    const rows = [
      ["ID","Titel","Functie","Status","Datum","Starttijd","Eindtijd","Stad","Uurtarief","Professional","E-mail","Uren gewerkt","Uitbetaling","Platformkosten"],
    ];
    for (const s of filtered) {
      const start = new Date(s.startTime);
      const end   = new Date(s.endTime);
      const date  = start.toLocaleDateString("nl-NL");
      const startT = start.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
      const endT   = end.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
      if (s.applications.length === 0) {
        rows.push([s.id, s.title, FUNCTION_LABELS[s.function] ?? s.function, STATUS_LABELS[s.status] ?? s.status,
          date, startT, endT, s.city, `€${Number(s.hourlyRate).toFixed(2)}`, "", "", "", "", ""]);
      }
      for (const a of s.applications) {
        rows.push([s.id, s.title, FUNCTION_LABELS[s.function] ?? s.function, STATUS_LABELS[s.status] ?? s.status,
          date, startT, endT, s.city, `€${Number(s.hourlyRate).toFixed(2)}`,
          a.user.name, a.user.email,
          a.hoursWorked ? `${Number(a.hoursWorked).toFixed(2)}` : "",
          a.payoutAmount ? `€${Number(a.payoutAmount).toFixed(2)}` : "",
          a.platformFee ? `€${Number(a.platformFee).toFixed(2)}` : "",
        ]);
      }
    }
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caredin-shifts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
        <div className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--teal)" }}>Filteren</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Status</label>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-white"
              style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}>
              <option value="all">Alle statussen</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Vanaf</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-white"
              style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Tot en met</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-white"
              style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {filtered.length} dienst{filtered.length !== 1 ? "en" : ""} geselecteerd
        </p>
        <button onClick={downloadCSV}
          className="px-6 py-2.5 rounded-[40px] text-sm font-semibold text-white cursor-pointer"
          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
          Download CSV →
        </button>
      </div>

      {/* Preview table */}
      <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
        <div className="grid text-[11px] font-bold uppercase tracking-[0.8px] px-5 py-3"
          style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", color: "var(--muted)", borderBottom: "0.5px solid var(--border)" }}>
          <span>Dienst</span><span>Datum</span><span>Status</span><span className="text-right">Tarief</span>
        </div>
        {filtered.slice(0, 10).map(s => (
          <div key={s.id} className="grid items-center px-5 py-3"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: "0.5px solid var(--border)" }}>
            <span className="text-sm font-semibold truncate pr-2" style={{ color: "var(--dark)" }}>{s.title}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {new Date(s.startTime).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{STATUS_LABELS[s.status] ?? s.status}</span>
            <span className="text-xs text-right" style={{ color: "var(--teal)" }}>€{Number(s.hourlyRate).toFixed(2)}/u</span>
          </div>
        ))}
        {filtered.length > 10 && (
          <div className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>
            + {filtered.length - 10} meer rijen in de export
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>Geen diensten gevonden met deze filters.</div>
        )}
      </div>
    </div>
  );
}
