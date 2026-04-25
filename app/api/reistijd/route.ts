// app/api/reistijd/route.ts
// Berekent reistijd + afstand + reiskostenaftrek voor ZZP'ers
// GET /api/reistijd?van=<adres_of_postcode>&naar=<adres_of_postcode>&vervoer=auto|fiets|ov
// of met coördinaten: &vanLat=52.3&vanLng=4.9&naarLat=52.1&naarLng=4.8

import { NextRequest, NextResponse } from "next/server";
import { berekenReistijd, GeoPoint } from "@/lib/reistijd";
import { berekenReiskosten, Vervoermiddel } from "@/lib/reiskosten";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;

  // Haal van/naar op — adres of coördinaten
  const vanAdres  = p.get("van")?.trim();
  const naarAdres = p.get("naar")?.trim();
  const vanLat    = p.get("vanLat");
  const vanLng    = p.get("vanLng");
  const naarLat   = p.get("naarLat");
  const naarLng   = p.get("naarLng");
  const vervoer   = (p.get("vervoer") ?? "auto") as Vervoermiddel;
  const ritten    = parseInt(p.get("ritten") ?? "1", 10); // aantal ritten per week (tbv jaarberekening)

  // Input validatie
  const heeftAdres = vanAdres && naarAdres;
  const heeftCoords =
    vanLat && vanLng && naarLat && naarLng &&
    !isNaN(parseFloat(vanLat)) && !isNaN(parseFloat(naarLng));

  if (!heeftAdres && !heeftCoords) {
    return NextResponse.json(
      { error: "Geef 'van' en 'naar' (adres) of vanLat/vanLng/naarLat/naarLng (coördinaten) mee." },
      { status: 400 }
    );
  }

  const van: GeoPoint | string = heeftCoords
    ? { lat: parseFloat(vanLat!), lng: parseFloat(vanLng!) }
    : vanAdres!;

  const naar: GeoPoint | string = heeftCoords
    ? { lat: parseFloat(naarLat!), lng: parseFloat(naarLng!) }
    : naarAdres!;

  const reistijd = await berekenReistijd(van, naar);
  if (!reistijd) {
    return NextResponse.json(
      { error: "Kon de reistijd niet berekenen. Controleer de adressen." },
      { status: 502 }
    );
  }

  // Reiskosten aftrek
  const reiskosten = berekenReiskosten({
    afstandKm: reistijd.afstandKm,
    vervoer,
    rittenPerWeek: ritten,
  });

  return NextResponse.json({
    van:             heeftAdres ? vanAdres : `${vanLat},${vanLng}`,
    naar:            heeftAdres ? naarAdres : `${naarLat},${naarLng}`,
    vertrekpunt:     reistijd.vertrekpunt,
    bestemming:      reistijd.bestemming,
    afstandKm:       reistijd.afstandKm,
    rechteAfstandKm: reistijd.rechteAfstandKm,
    duurMinuten:     reistijd.duurMinuten,
    duurFormatted:   formatDuur(reistijd.duurMinuten),
    bron:            reistijd.bron,
    reiskosten,
  });
}

function formatDuur(minuten: number): string {
  if (minuten < 60) return `${minuten} min`;
  const uur = Math.floor(minuten / 60);
  const min = minuten % 60;
  return min > 0 ? `${uur} u ${min} min` : `${uur} u`;
}
