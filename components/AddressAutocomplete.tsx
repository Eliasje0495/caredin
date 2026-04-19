"use client";
import { useEffect, useRef, useState } from "react";

interface AddressResult {
  address: string;
  postalCode: string;
  city: string;
}

interface Props {
  address: string;
  postalCode: string;
  city: string;
  onChange: (result: AddressResult) => void;
}

declare global {
  interface Window { google: any; initGoogleMaps: () => void; }
}

export default function AddressAutocomplete({ address, postalCode, city, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return;
    if (window.google?.maps?.places) { setApiLoaded(true); return; }

    window.initGoogleMaps = () => setApiLoaded(true);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&language=nl&region=NL`;
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [apiKey]);

  useEffect(() => {
    if (!apiLoaded || !inputRef.current) return;
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "nl" },
      fields: ["address_components"],
    });
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place?.address_components) return;
      const get = (type: string) =>
        place.address_components.find((c: any) => c.types.includes(type))?.long_name ?? "";
      const getShort = (type: string) =>
        place.address_components.find((c: any) => c.types.includes(type))?.short_name ?? "";
      const street = get("route");
      const number = get("street_number");
      const postal = getShort("postal_code");
      const town   = get("locality") || get("postal_town");
      onChange({
        address:    `${street}${number ? ` ${number}` : ""}`,
        postalCode: postal,
        city:       town,
      });
    });
  }, [apiLoaded]);

  // ── Met Google Maps key ──────────────────────────────────────────────────
  if (apiKey) {
    return (
      <div>
        <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
          style={{ color: "var(--muted)" }}>Woonadres</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">📍</span>
          <input
            ref={inputRef}
            type="text"
            defaultValue={address}
            placeholder="Begin met typen…"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-white"
            style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
          />
        </div>
        {(postalCode || city) && (
          <div className="flex gap-2 mt-2">
            <div className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
              📮 {postalCode}
            </div>
            <div className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
              🏙️ {city}
            </div>
          </div>
        )}
        <p className="text-[11px] mt-1.5" style={{ color: "var(--muted)" }}>
          Postcode en stad worden automatisch ingevuld
        </p>
      </div>
    );
  }

  // ── Zonder Google Maps key: gewone velden ────────────────────────────────
  return (
    <div>
      <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
        style={{ color: "var(--muted)" }}>Woonadres</label>
      <input
        type="text"
        value={address}
        onChange={e => onChange({ address: e.target.value, postalCode, city })}
        placeholder="Voorbeeldstraat 12"
        className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white mb-3"
        style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={postalCode}
          onChange={e => onChange({ address, postalCode: e.target.value, city })}
          placeholder="1234 AB"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
          style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
        />
        <input
          type="text"
          value={city}
          onChange={e => onChange({ address, postalCode, city: e.target.value })}
          placeholder="Amsterdam"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
          style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
        />
      </div>
    </div>
  );
}
