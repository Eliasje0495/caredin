"use client";
import React, { useState } from "react";

interface InitialData {
  name: string;
  phone: string;
  bio: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  bigNumber: string;
  skjNumber: string;
  kvkNumber: string;
  kvkCompanyName: string;
  contractType: string;
  hourlyRate: string;
  radius: number;
}

const TABS = ["Persoonlijk", "Registraties", "Beschikbaarheid"] as const;
type Tab = (typeof TABS)[number];

export default function ProfielForm({ initialData }: { initialData: InitialData }) {
  const [tab, setTab] = useState<Tab>("Persoonlijk");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof InitialData) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setSaved(false);
      setData((d) => ({ ...d, [field]: e.target.value }));
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/profiel/zzper", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Er ging iets mis. Probeer opnieuw.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {
      setError("Geen verbinding. Controleer je internet en probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave}>

      {/* Tab pills */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-[40px] bg-white w-fit"
        style={{ border: "0.5px solid var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-[40px] text-sm font-semibold cursor-pointer transition-all duration-150"
            style={{
              background: tab === t ? "var(--teal)" : "transparent",
              color: tab === t ? "#fff" : "var(--muted)",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Persoonlijk ── */}
      {tab === "Persoonlijk" && (
        <div
          className="rounded-2xl bg-white p-6 space-y-5"
          style={{ border: "0.5px solid var(--border)" }}
        >
          <SectionHeading>Basisgegevens</SectionHeading>

          <F label="Volledige naam">
            <input
              value={data.name}
              onChange={set("name")}
              placeholder="Bijv. Sophie van den Berg"
            />
          </F>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Telefoonnummer">
              <input
                type="tel"
                value={data.phone}
                onChange={set("phone")}
                placeholder="+31 6 12 34 56 78"
              />
            </F>
            <F label="Geboortedatum">
              <input type="date" value={data.dateOfBirth} onChange={set("dateOfBirth")} />
            </F>
          </div>

          <F label="Over mij">
            <textarea
              value={data.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="Beschrijf je werkervaring, specialisaties en wat jou drijft als zorgprofessional…"
            />
          </F>

          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          />
          <SectionHeading>Adresgegevens</SectionHeading>

          <F label="Straat en huisnummer">
            <input
              value={data.address}
              onChange={set("address")}
              placeholder="Voorbeeldstraat 12"
            />
          </F>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Postcode">
              <input
                value={data.postalCode}
                onChange={set("postalCode")}
                placeholder="1234 AB"
              />
            </F>
            <F label="Stad">
              <input
                value={data.city}
                onChange={set("city")}
                placeholder="Amsterdam"
              />
            </F>
          </div>
        </div>
      )}

      {/* ── Registraties ── */}
      {tab === "Registraties" && (
        <div
          className="rounded-2xl bg-white p-6 space-y-5"
          style={{ border: "0.5px solid var(--border)" }}
        >
          {/* Contract type */}
          <div>
            <SectionHeading>Type dienstverband</SectionHeading>
            <div
              className="flex gap-3 mt-3 p-4 rounded-xl"
              style={{ background: "var(--teal-light)" }}
            >
              {(["ZZP", "LOONDIENST"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, contractType: t }))}
                  className="px-5 py-2 rounded-[40px] text-sm font-semibold cursor-pointer transition-all duration-150"
                  style={{
                    background: data.contractType === t ? "var(--teal)" : "#fff",
                    color: data.contractType === t ? "#fff" : "var(--teal)",
                    border: "1.5px solid var(--teal)",
                    fontFamily: "inherit",
                  }}
                >
                  {t === "ZZP" ? "ZZP'er" : "Loondienst"}
                </button>
              ))}
            </div>
          </div>

          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          />
          <SectionHeading>Beroepsregistraties</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="BIG-nummer">
              <input
                value={data.bigNumber}
                onChange={set("bigNumber")}
                placeholder="12345678"
              />
            </F>
            <F label="SKJ-nummer">
              <input
                value={data.skjNumber}
                onChange={set("skjNumber")}
                placeholder="12345678"
              />
            </F>
          </div>

          {data.contractType === "ZZP" && (
            <>
              <div
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              />
              <SectionHeading>KvK-gegevens</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="KvK-nummer">
                  <input
                    value={data.kvkNumber}
                    onChange={set("kvkNumber")}
                    placeholder="12345678"
                  />
                </F>
                <F label="Bedrijfsnaam">
                  <input
                    value={data.kvkCompanyName}
                    onChange={set("kvkCompanyName")}
                    placeholder="Jouw Zorg BV"
                  />
                </F>
              </div>
            </>
          )}

          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          />
          <SectionHeading>Tarief</SectionHeading>

          <F label="Uurtarief (€)">
            <input
              type="number"
              min="35"
              max="150"
              step="0.50"
              value={data.hourlyRate}
              onChange={set("hourlyRate")}
              placeholder="35.00"
            />
          </F>
        </div>
      )}

      {/* ── Beschikbaarheid ── */}
      {tab === "Beschikbaarheid" && (
        <div
          className="rounded-2xl bg-white p-6 space-y-5"
          style={{ border: "0.5px solid var(--border)" }}
        >
          <SectionHeading>Maximale reisafstand</SectionHeading>

          <div>
            <div className="flex items-center gap-4 mb-1">
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={data.radius}
                onChange={(e) =>
                  setData((d) => ({ ...d, radius: parseInt(e.target.value) }))
                }
                className="flex-1"
                style={{ accentColor: "var(--teal)" }}
              />
              <span
                className="text-base font-bold w-14 text-right tabular-nums"
                style={{ color: "var(--teal)" }}
              >
                {data.radius} km
              </span>
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>

          <div
            className="border-t"
            style={{ borderColor: "var(--border)" }}
          />
          <SectionHeading>Beschikbare dagen</SectionHeading>

          <div className="grid grid-cols-7 gap-2">
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
              <div
                key={d}
                className="rounded-xl py-3 text-center text-sm font-semibold select-none"
                style={{
                  background: "var(--teal-light)",
                  color: "var(--teal)",
                  border: "1.5px solid var(--teal)",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Uitgebreide beschikbaarheidsplanning per dagdeel komt binnenkort.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-4 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
          }}
        >
          {error}
        </div>
      )}

      {/* Save row */}
      <div className="flex items-center justify-end gap-4 mt-6">
        {saved && (
          <span
            className="text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-[40px]"
            style={{
              background: "#D1FAE5",
              color: "#065F46",
              border: "1px solid #6EE7B7",
            }}
          >
            <span>✓</span>
            <span>Opgeslagen</span>
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3 rounded-[40px] text-sm font-semibold text-white cursor-pointer disabled:opacity-60 transition-opacity duration-150"
          style={{
            background: "var(--teal)",
            fontFamily: "inherit",
            border: "none",
          }}
        >
          {loading ? "Opslaan…" : "Wijzigingen opslaan"}
        </button>
      </div>
    </form>
  );
}

/* ── Helpers ── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[13px] font-bold uppercase tracking-wide"
      style={{ color: "var(--muted)" }}
    >
      {children}
    </div>
  );
}

function F({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement;
}) {
  const [focused, setFocused] = useState(false);

  const child = React.cloneElement(children, {
    className:
      "w-full px-4 py-3 rounded-xl text-sm outline-none bg-white resize-none transition-colors duration-150",
    style: {
      border: `1.5px solid ${focused ? "var(--teal)" : "var(--border)"}`,
      fontFamily: "inherit",
      color: "var(--dark)",
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div>
      <label
        className="block text-[13px] font-semibold mb-1.5"
        style={{ color: "var(--dark)" }}
      >
        {label}
      </label>
      {child}
    </div>
  );
}
