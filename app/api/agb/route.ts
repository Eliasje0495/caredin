import { NextRequest, NextResponse } from "next/server";
import { verifyAgbCode } from "@/lib/agb";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code verplicht" }, { status: 400 });

  const result = await verifyAgbCode(code);
  return NextResponse.json(result);
}
