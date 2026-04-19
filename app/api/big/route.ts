import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyBigNumber } from "@/lib/big";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const number = req.nextUrl.searchParams.get("number")?.trim();
  if (!number) return NextResponse.json({ error: "BIG-nummer vereist." }, { status: 400 });

  const result = await verifyBigNumber(number);
  return NextResponse.json(result);
}
