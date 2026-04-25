// lib/reistijd.ts — Reistijdberekening voor zorgprofessionals
// Geocoding:  Nominatim (OpenStreetMap) — gratis, geen API key
// Routing:    OSRM demo server — gratis, geen API key
// Haversine:  fallback voor rechte-lijn-afstand als routing mislukt

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface ReistijdResult {
  afstandKm:       number;      // wegafstand in km
  duurMinuten:     number;      // rijduur in minuten
  rechteAfstandKm: number;      // luchtlijn afstand
  bron:            "osrm" | "haversine";
  vertrekpunt?:    GeoPoint;
  bestemming?:     GeoPoint;
}

// ─── Haversine ──────────────────────────────────────────────────────────────
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ─── Geocoding via Nominatim ─────────────────────────────────────────────────
export async function geocodeAdres(adres: string): Promise<GeoPoint | null> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(adres)}&countrycodes=nl&format=json&limit=1&addressdetails=0`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Caredin.nl/1.0 (contact@caredin.nl)",
      "Accept-Language": "nl",
    },
    next: { revalidate: 3600 }, // cache 1 uur
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    label: data[0].display_name,
  };
}

// ─── Routing via OSRM ────────────────────────────────────────────────────────
async function osrmRoute(van: GeoPoint, naar: GeoPoint): Promise<{ afstandKm: number; duurMinuten: number } | null> {
  // OSRM verwacht: lng,lat volgorde
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${van.lng},${van.lat};${naar.lng},${naar.lat}` +
    `?overview=false&alternatives=false`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Caredin.nl/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (data?.code !== "Ok" || !data?.routes?.[0]) return null;

  return {
    afstandKm:   Math.round((data.routes[0].distance / 1000) * 10) / 10,
    duurMinuten: Math.round(data.routes[0].duration / 60),
  };
}

// ─── Hoofd-export ────────────────────────────────────────────────────────────

/**
 * Berekent reistijd en afstand tussen twee adressen of coördinaten.
 * Probeert OSRM voor wegafstand; valt terug op Haversine + schatting.
 */
export async function berekenReistijd(
  van: GeoPoint | string,
  naar: GeoPoint | string
): Promise<ReistijdResult | null> {
  // Geocode als string
  const vanPunt: GeoPoint | null =
    typeof van === "string" ? await geocodeAdres(van) : van;
  const naarPunt: GeoPoint | null =
    typeof naar === "string" ? await geocodeAdres(naar) : naar;

  if (!vanPunt || !naarPunt) return null;

  const rechteAfstandKm = Math.round(haversineKm(vanPunt, naarPunt) * 10) / 10;

  // Probeer OSRM
  const osrm = await osrmRoute(vanPunt, naarPunt);
  if (osrm) {
    return {
      ...osrm,
      rechteAfstandKm,
      bron: "osrm",
      vertrekpunt: vanPunt,
      bestemming: naarPunt,
    };
  }

  // Haversine fallback — wegafstand ≈ luchtlijn × 1,35 (NL gemiddelde)
  const afstandKm   = Math.round(rechteAfstandKm * 1.35 * 10) / 10;
  const duurMinuten = Math.round((afstandKm / 60) * 60); // ~60 km/u

  return {
    afstandKm,
    duurMinuten,
    rechteAfstandKm,
    bron: "haversine",
    vertrekpunt: vanPunt,
    bestemming: naarPunt,
  };
}
