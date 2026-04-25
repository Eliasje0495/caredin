"use client";

import { useEffect, useState } from "react";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type SlotKey = "ochtend" | "middag" | "avond" | "nacht";

type DaySlots = Record<SlotKey, boolean>;
type AvailabilityGrid = Record<DayKey, DaySlots>;

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "mon", label: "Maandag",   short: "Ma" },
  { key: "tue", label: "Dinsdag",   short: "Di" },
  { key: "wed", label: "Woensdag",  short: "Wo" },
  { key: "thu", label: "Donderdag", short: "Do" },
  { key: "fri", label: "Vrijdag",   short: "Vr" },
  { key: "sat", label: "Zaterdag",  short: "Za" },
  { key: "sun", label: "Zondag",    short: "Zo" },
];

const SLOTS: { key: SlotKey; label: string; time: string }[] = [
  { key: "ochtend", label: "Ochtend", time: "06:00–12:00" },
  { key: "middag",  label: "Middag",  time: "12:00–18:00" },
  { key: "avond",   label: "Avond",   time: "18:00–00:00" },
  { key: "nacht",   label: "Nacht",   time: "00:00–06:00" },
];

function buildEmptyGrid(): AvailabilityGrid {
  return Object.fromEntries(
    DAYS.map(({ key }) => [
      key,
      Object.fromEntries(SLOTS.map(({ key: s }) => [s, false])) as DaySlots,
    ])
  ) as AvailabilityGrid;
}

function mergeFromSaved(saved: any): AvailabilityGrid {
  const grid = buildEmptyGrid();
  if (!saved || typeof saved !== "object") return grid;
  for (const day of DAYS.map(d => d.key)) {
    const savedDay = saved[day];
    if (!savedDay) continue;
    // Support both old format (available, from, to) and new grid format
    if (typeof savedDay === "object" && "ochtend" in savedDay) {
      for (const slot of SLOTS.map(s => s.key)) {
        grid[day][slot] = Boolean(savedDay[slot]);
      }
    }
  }
  return grid;
}

export default function BeschikbaarheidClient() {
  const [grid, setGrid] = useState<AvailabilityGrid>(buildEmptyGrid);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/availability")
      .then(r => r.json())
      .then(data => {
        if (data.availability) {
          setGrid(mergeFromSaved(data.availability));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleCell(day: DayKey, slot: SlotKey) {
    setGrid(prev => ({
      ...prev,
      [day]: { ...prev[day], [slot]: !prev[day][slot] },
    }));
  }

  function toggleDay(day: DayKey) {
    const allOn = SLOTS.every(s => grid[day][s.key]);
    setGrid(prev => ({
      ...prev,
      [day]: Object.fromEntries(SLOTS.map(s => [s.key, !allOn])) as DaySlots,
    }));
  }

  function toggleSlot(slot: SlotKey) {
    const allOn = DAYS.every(d => grid[d.key][slot]);
    setGrid(prev => {
      const next = { ...prev };
      for (const d of DAYS) {
        next[d.key] = { ...next[d.key], [slot]: !allOn };
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grid),
      });
      if (!res.ok) throw new Error();
      setToast("Beschikbaarheid opgeslagen!");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Er is iets misgegaan. Probeer opnieuw.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  const totalSelected = DAYS.reduce(
    (acc, d) => acc + SLOTS.filter(s => grid[d.key][s.key]).length,
    0
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Mijn beschikbaarheid
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Instellingen zien jouw beschikbaarheid bij het zoeken naar professionals. Klik op een cel om te togglen.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center" style={{ border: "0.5px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Laden…</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            {/* Legend bar */}
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: "0.5px solid var(--border)", background: "var(--bg)" }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "var(--teal)" }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Beschikbaar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "var(--border)", border: "1px solid var(--border)" }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Niet beschikbaar</span>
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                {totalSelected} / {DAYS.length * SLOTS.length} slots
              </span>
            </div>

            {/* Grid */}
            <div className="p-5 overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "4px" }}>
                <thead>
                  <tr>
                    {/* Empty top-left cell */}
                    <th className="text-left pb-2" style={{ minWidth: 90 }} />
                    {DAYS.map(d => {
                      const allOn = SLOTS.every(s => grid[d.key][s.key]);
                      return (
                        <th key={d.key} className="pb-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDay(d.key)}
                            title={`Alles ${allOn ? "uit" : "aan"} voor ${d.label}`}
                            className="text-[11px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-lg cursor-pointer transition-colors"
                            style={{
                              background: allOn ? "var(--teal-light)" : "transparent",
                              color: allOn ? "var(--teal)" : "var(--muted)",
                              border: "none",
                              fontFamily: "inherit",
                            }}>
                            {d.short}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {SLOTS.map(slot => {
                    const allOn = DAYS.every(d => grid[d.key][slot.key]);
                    return (
                      <tr key={slot.key}>
                        {/* Slot label (clickable to toggle whole row) */}
                        <td className="pr-3 py-1" style={{ verticalAlign: "middle" }}>
                          <button
                            type="button"
                            onClick={() => toggleSlot(slot.key)}
                            title={`Alles ${allOn ? "uit" : "aan"} voor ${slot.label}`}
                            className="text-left cursor-pointer"
                            style={{ background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>
                            <div className="text-[12px] font-semibold" style={{ color: "var(--dark)" }}>{slot.label}</div>
                            <div className="text-[10px]" style={{ color: "var(--muted)" }}>{slot.time}</div>
                          </button>
                        </td>
                        {DAYS.map(d => {
                          const active = grid[d.key][slot.key];
                          return (
                            <td key={d.key} className="py-1">
                              <button
                                type="button"
                                onClick={() => toggleCell(d.key, slot.key)}
                                title={`${d.label} ${slot.label}: ${active ? "beschikbaar" : "niet beschikbaar"}`}
                                className="w-full rounded-xl transition-all cursor-pointer"
                                style={{
                                  height: 44,
                                  minWidth: 44,
                                  background: active ? "var(--teal)" : "var(--bg)",
                                  border: active ? "none" : "1.5px solid var(--border)",
                                  boxShadow: active ? "0 1px 4px rgba(26,122,106,0.25)" : "none",
                                  fontFamily: "inherit",
                                }}
                                aria-pressed={active}
                                aria-label={`${d.label} ${slot.label}`}>
                                {active && (
                                  <span className="text-white text-[14px]">✓</span>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Save button */}
            <div className="px-5 pb-5 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
                style={{
                  background: "var(--teal)",
                  border: "none",
                  fontFamily: "inherit",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}>
                {saving ? "Opslaan…" : "Opslaan"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg z-50"
          style={{ background: "var(--teal)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
