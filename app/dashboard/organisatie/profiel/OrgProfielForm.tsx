"use client";
import { useState } from "react";

const SECTOR_OPTIONS = [
  { value: "", label: "Selecteer sector" },
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

interface InitialData {
  companyName: string; description: string; address: string;
  city: string; postalCode: string; website: string;
  kvkNumber: string; sector: string;
}

export default function OrgProfielForm({ initialData }: { initialData: InitialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof InitialData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData(d => ({ ...d, [field]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setSaved(false);
    const res = await fetch("/api/profiel/organisatie", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Er ging iets mis."); }
    else setSaved(true);
  }

  return (
    <form onSubmit={handleSave}>
      <div className="rounded-2xl p-6 bg-white space-y-4" style={{ border: "0.5px solid var(--border)" }}>
        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Basisgegevens</h2>

        <div className="grid grid-cols-2 gap-4">
          <F label="Naam instelling">
            <input value={data.companyName} onChange={set("companyName")} placeholder="Zorgcentrum Noord" required />
          </F>
          <F label="Sector">
            <select value={data.sector} onChange={set("sector")}>
              {SECTOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </F>
        </div>

        <F label="Beschrijving">
          <textarea value={data.description} onChange={set("description")} rows={4}
            placeholder="Beschrijf je organisatie, specialisaties en werkcultuur…" />
        </F>

        <F label="Website (optioneel)">
          <input type="url" value={data.website} onChange={set("website")} placeholder="https://www.uwinstelling.nl" />
        </F>

        <F label="Adres">
          <input value={data.address} onChange={set("address")} placeholder="Zorgstraat 1" />
        </F>

        <div className="grid grid-cols-2 gap-4">
          <F label="Postcode">
            <input value={data.postalCode} onChange={set("postalCode")} placeholder="1234 AB" />
          </F>
          <F label="Stad">
            <input value={data.city} onChange={set("city")} placeholder="Utrecht" />
          </F>
        </div>
      </div>

      <div className="rounded-2xl p-6 bg-white mt-4 space-y-4" style={{ border: "0.5px solid var(--border)" }}>
        <h2 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>KvK-gegevens</h2>
        <div className="rounded-xl p-4 mb-2" style={{ background: "var(--teal-light)" }}>
          <p className="text-sm" style={{ color: "var(--teal)" }}>
            ℹ️ Je KvK-nummer wordt geverifieerd via het KvK-register. Verificatie duurt gemiddeld 24 uur.
          </p>
        </div>
        <F label="KvK-nummer" required>
          <input value={data.kvkNumber} onChange={set("kvkNumber")} placeholder="12345678" required />
        </F>
      </div>

      <div className="rounded-2xl p-6 bg-white mt-4" style={{ border: "0.5px solid var(--border)" }}>
        <h2 className="text-base font-bold mb-4" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Logo</h2>
        <div className="rounded-xl p-8 text-center cursor-pointer"
          style={{ background: "var(--teal-light)", border: "1.5px dashed var(--teal)" }}>
          <div className="text-3xl mb-2">🏥</div>
          <div className="text-sm font-semibold" style={{ color: "var(--teal)" }}>Logo uploaden</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>JPG, PNG of SVG, max 2MB</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>{error}</div>
      )}
      {saved && (
        <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: "var(--teal-light)", border: "1px solid var(--teal)", color: "var(--teal)" }}>
          ✓ Profiel opgeslagen
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button type="submit" disabled={loading}
          className="px-7 py-3 rounded-[40px] text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
          {loading ? "Opslaan…" : "Opslaan →"}
        </button>
      </div>
    </form>
  );
}

function F({ label, children, required }: { label: string; children: React.ReactElement; required?: boolean }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
        {label}{required && <span style={{ color: "var(--teal)" }}> *</span>}
      </label>
      {React.cloneElement(children, {
        className: "w-full px-4 py-3 rounded-xl text-sm outline-none bg-white resize-none",
        style: { border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" },
      } as any)}
    </div>
  );
}

import React from "react";
