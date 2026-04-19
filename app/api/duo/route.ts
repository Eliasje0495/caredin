import { NextRequest, NextResponse } from "next/server";
import { verifyDiplomaNummer } from "@/lib/duo";

export async function GET(req: NextRequest) {
  const number = req.nextUrl.searchParams.get("number");
  if (!number) return NextResponse.json({ error: "number verplicht" }, { status: 400 });

  const result = await verifyDiplomaNummer(number);
  return NextResponse.json(result);
}
