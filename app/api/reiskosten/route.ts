// app/api/reiskosten/route.ts
// Berekent reiskostenaftrek voor ZZP'ers conform Wet IB 2001
//
// GET  /api/reiskosten?km=<enkele_km>&vervoer=auto|fiets|ov|motor&ritten=<per_week>&weken=<per_jaar>
// POST /api/reiskosten  body: { km, vervoer, ritten, weken, ovKosten }

import { NextRequest, NextResponse } from "next/server";
import { berekenReiskosten, formatEuro, Vervoermiddel } from "@/lib/reiskosten";

export const dynamic = "force-dynamic";

const GELDIGE_VERVOER: Vervoermiddel[] = ["auto", "fiets", "ov", "motor"];

function parseInput(data: Record<string, string | number | null | undefined>) {
  const km        = parseFloat(String(data.km ?? "0"));
  const vervoer   = (data.vervoer ?? "auto") as Vervoermiddel;
  const ritten    = parseInt(String(data.ritten ?? "5"), 10);
  const weken     = parseInt(String(data.weken ?? "46"), 10);
  const ovKosten  = data.ovKosten ? parseFloat(String(data.ovKosten)) : undefined;

  if (isNaN(km) || km <= 0) return { error: "km moet een positief getal zijn" };
  if (!GELDIGE_VERVOER.includes(vervoer)) return { error: `vervoer moet een van ${GELDIGE_VERVOER.join(", ")} zijn` };
  if (isNaN(ritten) || ritten < 1) return { error: "ritten moet minimaal 1 zijn" };
  if (isNaN(weken) || weken < 1 || weken > 52) return { error: "weken moet tussen 1 en 52 zijn" };

  return { km, vervoer, ritten, weken, ovKosten };
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const parsed = parseInput({
    km:       p.get("km"),
    vervoer:  p.get("vervoer"),
    ritten:   p.get("ritten"),
    weken:    p.get("weken"),
    ovKosten: p.get("ovKosten"),
  });

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { km, vervoer, ritten, weken, ovKosten } = parsed;
  const resultaat = berekenReiskosten({
    afstandKm:       km,
    vervoer,
    rittenPerWeek:   ritten,
    wekenPerJaar:    weken,
    ovKostenEnkele:  ovKosten,
  });

  return NextResponse.json({
    ...resultaat,
    // Extra: geformatteerde bedragen voor directe weergave
    geformatteerd: {
      kostenPerRit:    formatEuro(resultaat.kostenPerRit),
      aftrekPerWeek:   formatEuro(resultaat.aftrekPerWeek),
      aftrekPerMaand:  formatEuro(resultaat.aftrekPerMaand),
      aftrekPerJaar:   formatEuro(resultaat.aftrekPerJaar),
      voordeel_37:     formatEuro(resultaat.belastingvoordeel.tarief_37_07),
      voordeel_49:     formatEuro(resultaat.belastingvoordeel.tarief_49_50),
    },
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON body" }, { status: 400 });
  }

  const parsed = parseInput({
    km:       body.km as string,
    vervoer:  body.vervoer as string,
    ritten:   body.ritten as string,
    weken:    body.weken as string,
    ovKosten: body.ovKosten as string,
  });

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { km, vervoer, ritten, weken, ovKosten } = parsed;
  const resultaat = berekenReiskosten({
    afstandKm:       km,
    vervoer,
    rittenPerWeek:   ritten,
    wekenPerJaar:    weken,
    ovKostenEnkele:  ovKosten,
  });

  return NextResponse.json({
    ...resultaat,
    geformatteerd: {
      kostenPerRit:    formatEuro(resultaat.kostenPerRit),
      aftrekPerWeek:   formatEuro(resultaat.aftrekPerWeek),
      aftrekPerMaand:  formatEuro(resultaat.aftrekPerMaand),
      aftrekPerJaar:   formatEuro(resultaat.aftrekPerJaar),
      voordeel_37:     formatEuro(resultaat.belastingvoordeel.tarief_37_07),
      voordeel_49:     formatEuro(resultaat.belastingvoordeel.tarief_49_50),
    },
  });
}
