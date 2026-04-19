import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyKvkNumber } from "@/lib/kvk";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const number = req.nextUrl.searchParams.get("number")?.trim();
  if (!number) return NextResponse.json({ error: "KvK-nummer vereist." }, { status: 400 });

  const result = await verifyKvkNumber(number);
  return NextResponse.json(result);
}
