"use client";
import { useState, useEffect } from "react";

const SETTINGS = [
  { id: "new_application",  label: "Nieuwe aanmelding",       desc: "Wanneer een professional zich aanmeldt voor een van je diensten." },
  { id: "checkout_pending", label: "Checkout wacht op jou",   desc: "Wanneer een professional heeft uitgecheckt en jij de uren moet goedkeuren." },
  { id: "auto_approved",    label: "Automatisch goedgekeurd", desc: "Wanneer uren automatisch worden goedgekeurd na 7 dagen." },
  { id: "shift_reminder",   label: "Dienst herinnering",      desc: "24 uur voor het begin van een dienst." },
  { id: "no_applicants",    label: "Geen aanmeldingen",       desc: "Wanneer een dienst 48 uur open staat zonder aanmeldingen." },
  { id: "platform_updates", label: "Platform updates",        desc: "Nieuws, nieuwe functies en wijzigingen in tarieven." },
];

export default function NotificatiesPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map(s => [s.id, true]))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("/api/dashboard/notificaties")
      .then(r => r.json())
      .then(d => { if (d.settings) setSettings(d.settings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/notificaties", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Opslaan mislukt. Probeer het opnieuw.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <main className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Notificaties
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Stel in wanneer je e-mailmeldingen ontvangt.</p>
        </div>

        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
          {loading ? (
            <div className="px-6 py-8 text-sm text-center" style={{ color: "var(--muted)" }}>Laden…</div>
          ) : (
            SETTINGS.map((s, i) => (
              <div key={s.id}
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i < SETTINGS.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                <div className="flex-1 pr-6">
                  <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  className="relative w-11 h-6 rounded-full flex-shrink-0 cursor-pointer transition-colors"
                  style={{ background: settings[s.id] ? "var(--teal)" : "var(--border)", border: "none" }}>
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: settings[s.id] ? "translateX(22px)" : "translateX(2px)" }}
                  />
                </button>
              </div>
            ))
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium" style={{ color: "#DC2626" }}>{error}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button onClick={save} disabled={saving || loading}
            className="px-6 py-2.5 rounded-[40px] text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
            style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
            {saving ? "Opslaan…" : "Opslaan"}
          </button>
          {saved && <span className="text-sm font-medium" style={{ color: "var(--teal)" }}>✓ Opgeslagen</span>}
        </div>
      </main>
    </div>
  );
}
