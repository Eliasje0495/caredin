"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const WEEK_DAYS = [
  { value: 1, label: "Ma" },
  { value: 2, label: "Di" },
  { value: 3, label: "Wo" },
  { value: 4, label: "Do" },
  { value: 5, label: "Vr" },
  { value: 6, label: "Za" },
  { value: 0, label: "Zo" },
];

const SECTORS = [
  { value: "VVT",             label: "Ouderenzorg (VVT)" },
  { value: "GGZ",             label: "GGZ" },
  { value: "JEUGDZORG",       label: "Jeugdzorg" },
  { value: "ZIEKENHUIS",      label: "Ziekenhuiszorg" },
  { value: "HUISARTSENZORG",  label: "Huisartsenzorg" },
  { value: "GEHANDICAPTENZORG", label: "Gehandicaptenzorg" },
  { value: "KRAAMZORG",       label: "Kraamzorg" },
  { value: "THUISZORG",       label: "Thuiszorg" },
  { value: "REVALIDATIE",     label: "Revalidatie" },
  { value: "OVERIG",          label: "Overig" },
];

const FUNCTIONS = [
  { value: "VERPLEEGKUNDIGE",       label: "Verpleegkundige" },
  { value: "VERZORGENDE_IG",        label: "Verzorgende IG" },
  { value: "HELPENDE_PLUS",         label: "Helpende Plus" },
  { value: "HELPENDE",              label: "Helpende" },
  { value: "ZORGASSISTENT",         label: "Zorgassistent" },
  { value: "GGZ_AGOOG",             label: "GGZ Agoog" },
  { value: "PERSOONLIJK_BEGELEIDER",label: "Persoonlijk Begeleider" },
  { value: "GEDRAGSDESKUNDIGE",     label: "Gedragsdeskundige" },
  { value: "ARTS",                  label: "Arts" },
  { value: "FYSIOTHERAPEUT",        label: "Fysiotherapeut" },
  { value: "ERGOTHERAPEUT",         label: "Ergotherapeut" },
  { value: "LOGOPEDIST",            label: "Logopedist" },
  { value: "KRAAMVERZORGENDE",      label: "Kraamverzorgende" },
  { value: "OVERIG",                label: "Overig" },
];

interface Props {
  defaultCity: string;
  defaultAddress: string;
  defaultPostalCode: string;
}

export default function NieuweShiftForm({ defaultCity, defaultAddress, defaultPostalCode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [fn, setFn] = useState("");
  const [address, setAddress] = useState(defaultAddress);
  const [city, setCity] = useState(defaultCity);
  const [postalCode, setPostalCode] = useState(defaultPostalCode);
  const [startDate, setStartDate] = useState("");
  const [startTimeStr, setStartTimeStr] = useState("08:00");
  const [endTimeStr, setEndTimeStr] = useState("16:00");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isNightShift, setIsNightShift] = useState(false);
  const [requiresBig, setRequiresBig] = useState(false);
  const [requiresSkj, setRequiresSkj] = useState(false);
  const [minExperience, setMinExperience] = useState("0");

  // Herhaling state
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurDays, setRecurDays] = useState<number[]>([]);
  const [recurUntil, setRecurUntil] = useState("");

  function toggleRecurDay(day: number) {
    setRecurDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build ISO datetimes from date + time strings
    const startTime = startDate && startTimeStr ? `${startDate}T${startTimeStr}:00` : undefined;
    const endTime = startDate && endTimeStr ? `${startDate}T${endTimeStr}:00` : undefined;

    if (isRecurring) {
      if (recurDays.length === 0) {
        setError("Selecteer minimaal één dag voor de herhaling.");
        setLoading(false);
        return;
      }
      if (!recurUntil) {
        setError("Selecteer een einddatum voor de herhaling.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/shifts/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base: {
            title, description, sector, function: fn,
            address, city, postalCode,
            startTime, endTime,
            breakMinutes: parseInt(breakMinutes || "30"),
            hourlyRate: parseFloat(hourlyRate),
            isUrgent, isNightShift,
            requiresBig, requiresSkj, requiresKvk: false,
            minExperience: parseInt(minExperience || "0"),
          },
          recurrence: { days: recurDays, until: recurUntil },
        }),
      });
      setLoading(false);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Er ging iets mis.");
        return;
      }
      const data = await res.json();
      router.push(`/dashboard/organisatie/diensten/${data.parentId}`);
      return;
    }

    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, sector, function: fn,
        address, city, postalCode,
        startDate, startTimeStr, endTimeStr,
        breakMinutes, hourlyRate,
        isUrgent, isNightShift,
        requiresBig, requiresSkj, requiresKvk: false, minExperience,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Er ging iets mis.");
      return;
    }
    const data = await res.json();
    router.push(`/dashboard/organisatie/diensten/${data.id}`);
  }

  // Calculate hours
  const calcHours = () => {
    if (!startTimeStr || !endTimeStr) return null;
    const [sh, sm] = startTimeStr.split(":").map(Number);
    const [eh, em] = endTimeStr.split(":").map(Number);
    const total = (eh * 60 + em) - (sh * 60 + sm) - parseInt(breakMinutes || "0");
    if (total <= 0) return null;
    return (total / 60).toFixed(1);
  };
  const hours = calcHours();
  const total = hours && hourlyRate ? (parseFloat(hours) * parseFloat(hourlyRate)).toFixed(2) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Basisgegevens */}
      <Section title="Basisgegevens">
        <F label="Functienaam *">
          <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Bijv. Nachtdienst IC Verpleegkundige" />
        </F>
        <div className="grid grid-cols-2 gap-4">
          <F label="Sector *">
            <select value={sector} onChange={e => setSector(e.target.value)} required>
              <option value="">Selecteer sector</option>
              {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </F>
          <F label="Functie *">
            <select value={fn} onChange={e => setFn(e.target.value)} required>
              <option value="">Selecteer functie</option>
              {FUNCTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </F>
        </div>
        <F label="Beschrijving (optioneel)">
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            placeholder="Extra toelichting over de dienst, specifieke taken of verwachtingen…" />
        </F>
      </Section>

      {/* Datum & tijd */}
      <Section title="Datum & tijd">
        <F label="Datum *">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
            min={new Date().toISOString().split("T")[0]} />
        </F>
        <div className="grid grid-cols-3 gap-4">
          <F label="Begintijd *">
            <input type="time" value={startTimeStr} onChange={e => setStartTimeStr(e.target.value)} required />
          </F>
          <F label="Eindtijd *">
            <input type="time" value={endTimeStr} onChange={e => setEndTimeStr(e.target.value)} required />
          </F>
          <F label="Pauze (min)">
            <select value={breakMinutes} onChange={e => setBreakMinutes(e.target.value)}>
              {[0, 15, 30, 45, 60].map(m => <option key={m} value={m}>{m} min</option>)}
            </select>
          </F>
        </div>
        {hours && (
          <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
            ⏱ {hours} uur netto {total && `· Geschatte kosten: €${total}`}
          </div>
        )}
        <div className="flex gap-4">
          <Toggle label="Nachtdienst" value={isNightShift} onChange={setIsNightShift} />
          <Toggle label="Urgente dienst" value={isUrgent} onChange={setIsUrgent} />
        </div>
      </Section>

      {/* Locatie */}
      <Section title="Locatie">
        <F label="Adres *">
          <input value={address} onChange={e => setAddress(e.target.value)} required placeholder="Zorgstraat 1" />
        </F>
        <div className="grid grid-cols-2 gap-4">
          <F label="Postcode *">
            <input value={postalCode} onChange={e => setPostalCode(e.target.value)} required placeholder="1234 AB" />
          </F>
          <F label="Stad *">
            <input value={city} onChange={e => setCity(e.target.value)} required placeholder="Amsterdam" />
          </F>
        </div>
      </Section>

      {/* Tarief */}
      <Section title="Tarief">
        <F label="Uurtarief (€) *">
          <input type="number" min="35" max="200" step="0.50" value={hourlyRate}
            onChange={e => setHourlyRate(e.target.value)} required placeholder="35.00" />
        </F>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Bovenop het uurtarief rekent CaredIn een platformbedrag van €3,– per gewerkt uur.
        </p>
      </Section>

      {/* Vereisten */}
      <Section title="Vereisten">
        <div className="space-y-3">
          <Toggle label="BIG-registratie vereist" value={requiresBig} onChange={setRequiresBig} />
          <Toggle label="SKJ-registratie vereist" value={requiresSkj} onChange={setRequiresSkj} />
        </div>
        <F label="Minimale werkervaring (jaar)">
          <select value={minExperience} onChange={e => setMinExperience(e.target.value)}>
            {[0, 1, 2, 3, 5, 10].map(y => (
              <option key={y} value={y}>{y === 0 ? "Geen vereiste" : `${y} jaar`}</option>
            ))}
          </select>
        </F>
      </Section>

      {/* Herhalen */}
      <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
        <button
          type="button"
          onClick={() => setRecurringOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          <span className="text-base font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Herhalen
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>{recurringOpen ? "▲" : "▼"}</span>
        </button>

        {recurringOpen && (
          <div className="px-6 pb-6 space-y-4" style={{ borderTop: "0.5px solid var(--border)" }}>
            <div className="pt-4">
              <Toggle label="Herhaalde dienst aanmaken" value={isRecurring} onChange={setIsRecurring} />
            </div>

            {isRecurring && (
              <>
                <div>
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: "var(--text)" }}>
                    Dagen
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {WEEK_DAYS.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleRecurDay(day.value)}
                        className="px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                        style={{
                          border: "1px solid var(--border)",
                          background: recurDays.includes(day.value) ? "var(--teal)" : "var(--bg)",
                          color: recurDays.includes(day.value) ? "#fff" : "var(--text)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                    Herhalen tot
                  </label>
                  <input
                    type="date"
                    value={recurUntil}
                    onChange={e => setRecurUntil(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                    style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => window.history.back()}
          className="text-sm font-semibold bg-transparent border-none p-0 cursor-pointer"
          style={{ color: "var(--muted)", fontFamily: "inherit" }}>
          Annuleren
        </button>
        <button type="submit" disabled={loading}
          className="px-8 py-3 rounded-[40px] text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
          {loading ? "Plaatsen…" : "Dienst plaatsen →"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "0.5px solid var(--border)" }}>
      <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>{title}</h2>
      {children}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>{label}</label>
      {React.cloneElement(children, {
        className: "w-full px-4 py-3 rounded-xl text-sm outline-none bg-white resize-none",
        style: { border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" },
      } as any)}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => onChange(!value)}
        className="w-10 h-6 rounded-full relative flex-shrink-0 transition-colors"
        style={{ background: value ? "var(--teal)" : "var(--border)", cursor: "pointer" }}>
        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: value ? "calc(100% - 20px)" : "4px" }} />
      </div>
      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</span>
    </label>
  );
}

import React from "react";
