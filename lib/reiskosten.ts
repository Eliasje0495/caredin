// lib/reiskosten.ts — Reiskostenaftrek voor ZZP'ers / IB-ondernemers
//
// Wettelijke basis:
//   - Artikel 3.16 Wet IB 2001: zakelijke reiskosten aftrekbaar als bedrijfskosten
//   - Besluit Belastingdienst onbelaste vergoeding per km:
//       2023: €0,21/km
//       2024: €0,23/km
//       2025: €0,23/km (bevestigd)
//       2026: €0,23/km (verwacht — controleer Belastingdienst.nl voor bevestiging)
//
// Let op: dit zijn ZAKELIJKE reiskosten (woon-werkverkeer naar VASTE werkplek is
// voor IB-ondernemers NIET aftrekbaar via dit regime; reizen naar wisselende
// opdrachtgevers WEL).
// Zie: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/

export type Vervoermiddel = "auto" | "fiets" | "ov" | "motor";

// Tarieven 2026 (art. 3.16 Wet IB / besluit Belastingdienst)
// Eigen vervoer (auto, motor, fiets, scooter): €0,23/km
// OV: werkelijke kosten (hier: schatting)
export const TARIEVEN_2026 = {
  auto:   0.23,   // €/km, Belastingdienst 2024/2025/2026(verwacht)
  motor:  0.23,
  fiets:  0.23,   // ook fietsen vallen onder de €0,23/km regeling
  ov:     null,   // werkelijke kosten — zie berekenOvKosten
} as const;

// Geschatte OV-kosten per km (NS gemiddelde 2024/2025)
const OV_KOSTEN_PER_KM = 0.196; // €0,196 gemiddeld NS 2e klas

export interface ReiskostenInput {
  afstandKm:     number;     // enkele reis in km
  vervoer:       Vervoermiddel;
  rittenPerWeek?: number;    // standaard 5 (heen+terug = 1 rit per werkdag)
  wekenPerJaar?:  number;    // standaard 46 (excl. vakantie)
  ovKostenEnkele?: number;   // optioneel: werkelijke OV-kosten enkele reis (€)
}

export interface ReiskostenResultaat {
  vervoer:              Vervoermiddel;
  afstandKm:            number;          // enkele reis
  retourKm:             number;          // heen + terug
  tarief:               number | null;   // €/km (null = werkelijke kosten)
  kostenPerRit:         number;          // aftrekbaar bedrag per retourrit
  rittenPerWeek:        number;
  wekenPerJaar:         number;
  aftrekPerWeek:        number;          // aftrekbaar per week
  aftrekPerMaand:       number;          // aftrekbaar per maand (÷12)
  aftrekPerJaar:        number;          // totaal aftrekbaar per jaar
  belastingvoordeel:    {
    tarief_37_07:       number;          // belastingvoordeel bij 37,07% schijf
    tarief_49_50:       number;          // belastingvoordeel bij 49,50% schijf
  };
  basisJaar:            number;
  opmerking?:           string;
}

export function berekenReiskosten(input: ReiskostenInput): ReiskostenResultaat {
  const {
    afstandKm,
    vervoer,
    rittenPerWeek  = 5,
    wekenPerJaar   = 46,
    ovKostenEnkele,
  } = input;

  const retourKm = afstandKm * 2;

  let tarief: number | null;
  let kostenPerRit: number;

  if (vervoer === "ov") {
    tarief = null;
    // Werkelijke kosten: gebruik opgegeven bedrag of schatting
    const enkeleKosten = ovKostenEnkele ?? afstandKm * OV_KOSTEN_PER_KM;
    kostenPerRit       = enkeleKosten * 2; // heen + terug
  } else {
    tarief       = TARIEVEN_2026[vervoer];
    kostenPerRit = retourKm * tarief;
  }

  const aftrekPerJaar  = Math.round(kostenPerRit * rittenPerWeek * wekenPerJaar * 100) / 100;
  const aftrekPerWeek  = Math.round(kostenPerRit * rittenPerWeek * 100) / 100;
  const aftrekPerMaand = Math.round((aftrekPerJaar / 12) * 100) / 100;

  // Belastingvoordeel (besparing op IB, box 1)
  // Schijf 1: 37,07% (≤ €73.031 belastbaar inkomen, 2024/2025)
  // Schijf 2: 49,50% (> €73.031)
  const belastingvoordeel = {
    tarief_37_07: Math.round(aftrekPerJaar * 0.3707 * 100) / 100,
    tarief_49_50: Math.round(aftrekPerJaar * 0.495 * 100) / 100,
  };

  let opmerking: string | undefined;
  if (vervoer === "auto" && afstandKm > 0) {
    opmerking =
      "Zakelijke kilometers bijhouden in een rittenadministratie is verplicht bij belastingcontrole. " +
      "Woon-werkverkeer naar een vaste werkplek is niet aftrekbaar voor IB-ondernemers; " +
      "ritten naar wisselende opdrachtgevers (zoals via CaredIn) wél.";
  } else if (vervoer === "ov") {
    opmerking =
      "Bewaar alle OV-bonnen of gebruik je OV-chipkaart exportoverzicht als bewijs voor de belastingaangifte.";
  }

  return {
    vervoer,
    afstandKm,
    retourKm,
    tarief,
    kostenPerRit:       Math.round(kostenPerRit * 100) / 100,
    rittenPerWeek,
    wekenPerJaar,
    aftrekPerWeek,
    aftrekPerMaand,
    aftrekPerJaar,
    belastingvoordeel,
    basisJaar:          2026,
    opmerking,
  };
}

// ─── Handige helpers ─────────────────────────────────────────────────────────

/** Formatteer euro-bedrag als "€ 1.234,56" */
export function formatEuro(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(bedrag);
}

/** Bereken het maximale aftrekbedrag per jaar voor een shift (single booking) */
export function aftrekVoorShift(afstandKm: number, vervoer: Vervoermiddel = "auto"): number {
  const r = berekenReiskosten({ afstandKm, vervoer, rittenPerWeek: 1, wekenPerJaar: 1 });
  return r.kostenPerRit;
}
