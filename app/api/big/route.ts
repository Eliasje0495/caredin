import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyBigNumber } from "@/lib/big";
import { nameMatchesAccount } from "@/lib/name-match";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const number = req.nextUrl.searchParams.get("number")?.trim();
  if (!number) return NextResponse.json({ error: "BIG-nummer vereist." }, { status: 400 });

  const result = await verifyBigNumber(number);

  // Controleer of de naam in het BIG-register overeenkomt met de accountnaam
  if (result.valid && result.name) {
    const accountName = session.user?.name ?? "";
    if (!nameMatchesAccount(result.name, accountName)) {
      return NextResponse.json({
        valid: false,
        name: result.name,
        profession: result.profession,
        error: "Het BIG-nummer is niet gekoppeld aan de naam op dit account.",
        nameMismatch: true,
      });
    }
  }

  return NextResponse.json(result);
}
