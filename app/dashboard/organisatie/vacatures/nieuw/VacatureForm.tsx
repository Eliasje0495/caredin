"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTORS = [
  { value: "VVT",              label: "Ouderenzorg (VVT)" },
  { value: "GGZ",              label: "GGZ" },
  { value: "JEUGDZORG",        label: "Jeugdzorg" },
  { value: "ZIEKENHUIS",       label: "Ziekenhuiszorg" },
  { value: "HUISARTSENZORG",   label: "Huisartsenzorg" },
  { value: "GEHANDICAPTENZORG",label: "Gehandicaptenzorg" },
  { value: "KRAAMZORG",        label: "Kraamzorg" },
  { value: "THUISZORG",        label: "Thuiszorg" },
  { value: "REVALIDATIE",      label: "Revalidatie" },
  { value: "OVERIG",           label: "Overig" },
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

export default function VacatureForm({ defaultCity }: { defaultCity: string }) {
  const router  = useRouter();
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector]         = useState("");
  const [fn, setFn]                 = useState("");
  const [city, setCity]             = useState(defaultCity);
  const [address, setAddress]       = useState("");
  const [contractType, setContractType] = useState("LOONDIENST");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [salaryMin, setSalaryMin]   = useState("");
  const [salaryMax, setSalaryMax]   = useState("");
  const [requiresBig, setRequiresBig]   = useState(false);
  const [requiresSkj, setRequiresSkj]   = useState(false);
  const [minExperience, setMinExperience] = useState("0");
  const [expiresAt, setExpiresAt]   = useState("");
  const [status, setStatus]         = useState("OPEN");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/vacatures", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, sector, function: fn,
        city, address,
        contractType,
        hoursPerWeek: hoursPerWeek || null,
        salaryMin:    salaryMin    || null,
        salaryMax:    salaryMax    || null,
        requiresBig, requiresSkj,
        minExperience,
        expiresAt:    expiresAt    || null,
        status,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Er ging iets mis.");
      return;
    }
    router.push("/dashboard/organisatie/vacatures");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <Section title="Functiegegevens">
        <F label="Functienaam *">
          <input value={title} onChange={e => setTitle(e.target.value)} required
            placeholder="Bijv. Verpleegkundige Nachtdienst" />
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
        <F label="Beschrijving *">
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required
            placeholder="Beschrijf de functie, taken, werksfeer en verwachtingen…" />
        </F>
      </Section>

      <Section title="Dienstverband">
        <div className="grid grid-cols-2 gap-4">
          <F label="Type contract">
            <select value={contractType} onChange={e => setContractType(e.target.value)}>
              <option value="LOONDIENST">Loondienst</option>
              <option value="ZZP">ZZP / Freelance</option>
            </select>
          </F>
          <F label="Uren per week">
            <input type="number" min="1" max="40" value={hoursPerWeek}
              onChange={e => setHoursPerWeek(e.target.value)} placeholder="36" />
          </F>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <F label="Salaris van (€/mnd)">
            <input type="number" min="0" value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)} placeholder="2800" />
          </F>
          <F label="Salaris tot (€/mnd)">
            <input type="number" min="0" value={salaryMax}
              onChange={e => setSalaryMax(e.target.value)} placeholder="3600" />
          </F>
        </div>
      </Section>

      <Section title="Locatie">
        <F label="Stad *">
          <input value={city} onChange={e => setCity(e.target.value)} required placeholder="Amsterdam" />
        </F>
        <F label="Adres (optioneel)">
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Zorgstraat 1" />
        </F>
      </Section>

      <Section title="Vereisten">
        <div className="space-y-3">
          <Toggle label="BIG-registratie vereist" value={requiresBig} onChange={setRequiresBig} />
          <Toggle label="SKJ-registratie vereist" value={requiresSkj} onChange={setRequiresSkj} />
        </div>
        <F label="Minimale werkervaring">
          <select value={minExperience} onChange={e => setMinExperience(e.target.value)}>
            {[0,1,2,3,5,10].map(y => (
              <option key={y} value={y}>{y === 0 ? "Geen vereiste" : `${y} jaar`}</option>
            ))}
          </select>
        </F>
      </Section>

      <Section title="Publicatie">
        <div className="grid grid-cols-2 gap-4">
          <F label="Status">
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="OPEN">Direct publiceren</option>
              <option value="DRAFT">Opslaan als concept</option>
            </select>
          </F>
          <F label="Sluitingsdatum (optioneel)">
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
              min={new Date().toISOString().split("T")[0]} />
          </F>
        </div>
      </Section>

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
          {loading ? "Plaatsen…" : status === "DRAFT" ? "Opslaan als concept →" : "Vacature plaatsen →"}
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
