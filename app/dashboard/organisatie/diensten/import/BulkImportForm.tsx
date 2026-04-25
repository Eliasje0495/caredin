"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ParsedShift {
  title: string;
  description: string;
  function: string;
  sector: string;
  address: string;
  city: string;
  postalCode: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  breakMinutes: number;
  valid: boolean;
  error?: string;
}

const REQUIRED_FUNCTIONS = ["VERPLEEGKUNDIGE","VERZORGENDE_IG","HELPENDE_PLUS","HELPENDE","ZORGASSISTENT","GGZ_AGOOG","PERSOONLIJK_BEGELEIDER","ARTS","FYSIOTHERAPEUT","OVERIG"];
const REQUIRED_SECTORS   = ["VVT","GGZ","JEUGDZORG","ZIEKENHUIS","HUISARTSENZORG","GEHANDICAPTENZORG","KRAAMZORG","THUISZORG","REVALIDATIE","OVERIG"];

function parseCSV(text: string, defaultCity: string, defaultAddress: string, defaultPostalCode: string): ParsedShift[] {
  const lines = text.trim().split("\n").slice(1); // skip header
  return lines.map(line => {
    const cols = line.split(";").map(c => c.trim().replace(/^"|"$/g, ""));
    const [title, description, fn, sector, address, city, postalCode, startDate, startTime, endDate, endTime, hourlyRate, breakMins] = cols;
    const errors: string[] = [];
    if (!title) errors.push("Titel ontbreekt");
    if (!REQUIRED_FUNCTIONS.includes(fn)) errors.push(`Ongeldige functie: ${fn}`);
    if (!REQUIRED_SECTORS.includes(sector)) errors.push(`Ongeldige sector: ${sector}`);
    if (!startDate || !startTime) errors.push("Startdatum/-tijd ontbreekt");
    if (!endDate || !endTime) errors.push("Einddatum/-tijd ontbreekt");
    if (!hourlyRate || isNaN(parseFloat(hourlyRate))) errors.push("Ongeldig uurtarief");
    return {
      title: title ?? "",
      description: description ?? "",
      function: fn ?? "",
      sector: sector ?? "",
      address: address || defaultAddress,
      city: city || defaultCity,
      postalCode: postalCode || defaultPostalCode,
      startTime: startDate && startTime ? `${startDate}T${startTime}:00` : "",
      endTime:   endDate   && endTime   ? `${endDate}T${endTime}:00`     : "",
      hourlyRate: hourlyRate ?? "",
      breakMinutes: parseInt(breakMins ?? "30") || 30,
      valid: errors.length === 0,
      error: errors.join(", "),
    };
  });
}

export default function BulkImportForm({ employerId, defaultCity, defaultAddress, defaultPostalCode }: {
  employerId: string; defaultCity: string; defaultAddress: string; defaultPostalCode: string;
}) {
  const router = useRouter();
  const [shifts, setShifts]   = useState<ParsedShift[]>([]);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ created: number; failed: number } | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setShifts(parseCSV(text, defaultCity, defaultAddress, defaultPostalCode));
      setResult(null);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const valid = shifts.filter(s => s.valid);
    if (!valid.length) return;
    setLoading(true);
    const res = await fetch("/api/shifts/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shifts: valid }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    if (data.created > 0) setTimeout(() => router.push("/dashboard/organisatie/diensten"), 2000);
  }

  const validCount   = shifts.filter(s => s.valid).length;
  const invalidCount = shifts.filter(s => !s.valid).length;

  return (
    <div>
      {/* File upload */}
      <div className="rounded-2xl p-8 mb-6 text-center bg-white" style={{ border: "2px dashed var(--border)" }}>
        <div className="text-4xl mb-3">📂</div>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Sleep een CSV-bestand hierheen of klik om te selecteren</p>
        <label className="px-5 py-2.5 rounded-[40px] text-sm font-semibold text-white cursor-pointer inline-block" style={{ background: "var(--teal)" }}>
          Bestand kiezen
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {/* Preview */}
      {shifts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>
              {shifts.length} rijen gevonden — {validCount} geldig, {invalidCount} met fouten
            </div>
            {validCount > 0 && (
              <button onClick={handleImport} disabled={loading}
                className="px-5 py-2 rounded-[40px] text-sm font-semibold text-white"
                style={{ background: loading ? "var(--muted)" : "var(--teal)", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {loading ? "Bezig…" : `✓ Importeer ${validCount} dienst${validCount !== 1 ? "en" : ""}`}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {shifts.map((s, i) => (
              <div key={i} className="rounded-xl px-4 py-3 bg-white flex items-start gap-3"
                style={{ border: `0.5px solid ${s.valid ? "var(--border)" : "#FECACA"}`, background: s.valid ? "#fff" : "#FEF2F2" }}>
                <span style={{ fontSize: 16 }}>{s.valid ? "✓" : "✗"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{s.title || "(geen titel)"}</div>
                  {s.valid ? (
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {s.function} · {s.city} · {new Date(s.startTime).toLocaleDateString("nl-NL")} · €{s.hourlyRate}/u
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: "#991B1B" }}>{s.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl p-5 text-center" style={{ background: "#D1FAE5", border: "1px solid #6EE7B7" }}>
          <div className="text-lg font-bold" style={{ color: "#065F46" }}>
            ✓ {result.created} dienst{result.created !== 1 ? "en" : ""} aangemaakt!
          </div>
          <p className="text-sm mt-1" style={{ color: "#065F46" }}>Je wordt doorgestuurd naar je diensten…</p>
        </div>
      )}
    </div>
  );
}
