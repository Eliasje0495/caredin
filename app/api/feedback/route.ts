import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { topic, rating, message } = await req.json();

  const stars = ["😞","😕","😐","😊","😍"][rating - 1] ?? "?";
  const name  = session?.user?.name ?? "Onbekend";
  const email = session?.user?.email ?? "onbekend";

  await sendEmail(
    "elias@standin.works",
    `[CaredIn feedback] ${stars} van ${name}`,
    `<p><strong>Van:</strong> ${name} (${email})</p>
     <p><strong>Onderwerp:</strong> ${topic ?? "Niet opgegeven"}</p>
     <p><strong>Beoordeling:</strong> ${stars} (${rating}/5)</p>
     <p><strong>Bericht:</strong></p>
     <p style="white-space:pre-wrap">${message}</p>`
  );

  return NextResponse.json({ ok: true });
}
