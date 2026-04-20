"use client";

import { useEffect, useState } from "react";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface DayConfig {
  available: boolean;
  from: string;
  to: string;
}

type AvailabilityState = Record<DayKey, DayConfig>;

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Maandag" },
  { key: "tue", label: "Dinsdag" },
  { key: "wed", label: "Woensdag" },
  { key: "thu", label: "Donderdag" },
  { key: "fri", label: "Vrijdag" },
  { key: "sat", label: "Zaterdag" },
  { key: "sun", label: "Zondag" },
];

const DEFAULT_DAY: DayConfig = { available: false, from: "08:00", to: "22:00" };

function buildDefaultState(): AvailabilityState {
  return Object.fromEntries(DAYS.map(({ key }) => [key, { ...DEFAULT_DAY }])) as AvailabilityState;
}

export default function BeschikbaarheidPage() {
  const [grid, setGrid] = useState<AvailabilityState>(buildDefaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/availability")
      .then((r) => r.json())
      .then((data) => {
        if (data.availability && typeof data.availability === "object") {
          const merged = buildDefaultState();
          for (const key of DAYS.map((d) => d.key)) {
            const saved = (data.availability as any)[key];
            if (saved) {
              merged[key] = {
                available: saved.available ?? false,
                from: saved.from ?? "08:00",
                to: saved.to ?? "22:00",
              };
            }
          }
          setGrid(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggle(key: DayKey) {
    setGrid((prev) => ({
      ...prev,
      [key]: { ...prev[key], available: !prev[key].available },
    }));
  }

  function setTime(key: DayKey, field: "from" | "to", value: string) {
    setGrid((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function setWholeDay(key: DayKey, checked: boolean) {
    setGrid((prev) => ({
      ...prev,
      [key]: { ...prev[key], from: checked ? "00:00" : "08:00", to: checked ? "23:59" : "22:00" },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grid),
      });
      if (!res.ok) throw new Error("Fout bij opslaan");
      setToast("Beschikbaarheid opgeslagen!");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Er is iets misgegaan. Probeer opnieuw.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Header */}
        <div>
          <h1
            className="text-[28px] font-bold mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
          >
            Mijn beschikbaarheid
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Instellingen zien jouw beschikbaarheid bij het zoeken naar professionals.
          </p>
        </div>

        {/* Grid card */}
        <div
          className="rounded-2xl bg-white p-6 space-y-3"
          style={{ border: "0.5px solid var(--border)" }}
        >
          {loading ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              Laden…
            </p>
          ) : (
            DAYS.map(({ key, label }) => {
              const day = grid[key];
              const isWholeDay = day.from === "00:00" && day.to === "23:59";

              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 py-3"
                  style={{ borderBottom: "0.5px solid var(--border)" }}
                >
                  {/* Day name */}
                  <div
                    className="w-28 text-sm font-semibold flex-shrink-0"
                    style={{ color: "var(--dark)" }}
                  >
                    {label}
                  </div>

                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="relative inline-flex items-center flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200"
                    style={{
                      width: 44,
                      height: 24,
                      background: day.available ? "var(--teal)" : "#D1D5DB",
                      border: "none",
                      padding: 0,
                    }}
                    aria-label={day.available ? "Beschikbaar" : "Niet beschikbaar"}
                  >
                    <span
                      className="block rounded-full bg-white shadow transition-transform duration-200"
                      style={{
                        width: 18,
                        height: 18,
                        transform: day.available ? "translateX(22px)" : "translateX(3px)",
                      }}
                    />
                  </button>

                  {/* Label next to toggle */}
                  <span
                    className="text-xs font-medium w-24 flex-shrink-0"
                    style={{ color: day.available ? "var(--teal)" : "var(--muted)" }}
                  >
                    {day.available ? "Beschikbaar" : "Niet beschikbaar"}
                  </span>

                  {/* Time inputs + whole day — only when available */}
                  {day.available && (
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor={`${key}-from`}
                          className="text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          Van
                        </label>
                        <input
                          id={`${key}-from`}
                          type="time"
                          value={day.from}
                          onChange={(e) => setTime(key, "from", e.target.value)}
                          className="rounded-lg px-2 py-1 text-sm font-medium"
                          style={{
                            border: "1px solid var(--border)",
                            color: "var(--dark)",
                            background: "var(--bg)",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor={`${key}-to`}
                          className="text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          Tot
                        </label>
                        <input
                          id={`${key}-to`}
                          type="time"
                          value={day.to}
                          onChange={(e) => setTime(key, "to", e.target.value)}
                          className="rounded-lg px-2 py-1 text-sm font-medium"
                          style={{
                            border: "1px solid var(--border)",
                            color: "var(--dark)",
                            background: "var(--bg)",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isWholeDay}
                          onChange={(e) => setWholeDay(key, e.target.checked)}
                          className="rounded"
                          style={{ accentColor: "var(--teal)" }}
                        />
                        <span className="text-xs" style={{ color: "var(--muted)" }}>
                          Hele dag
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Save button */}
          {!loading && (
            <div className="pt-3 flex justify-end">
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
                }}
              >
                {saving ? "Opslaan…" : "Opslaan"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg z-50"
          style={{ background: "var(--teal)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
