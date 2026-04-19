export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Link from "next/link";

export default async function IdentityReturnPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const sessionId = searchParams.session_id;
  let status: "success" | "processing" | "failed" = "processing";
  let message = "Je verificatie wordt verwerkt.";

  if (sessionId) {
    try {
      const vs = await stripe.identity.verificationSessions.retrieve(sessionId);
      if (vs.status === "verified") {
        status = "success";
        message = "Je identiteit is succesvol geverifieerd.";
      } else if (vs.status === "requires_input") {
        status = "failed";
        message = "De verificatie is niet gelukt. Probeer het opnieuw.";
      } else {
        status = "processing";
        message = "Je verificatie wordt verwerkt. Dit duurt meestal minder dan 2 minuten.";
      }
    } catch {
      status = "processing";
    }
  }

  const icon = status === "success" ? "✅" : status === "failed" ? "❌" : "⏳";
  const color = status === "success" ? "var(--teal)" : status === "failed" ? "#991B1B" : "#92400E";
  const bg = status === "success" ? "var(--teal-light)" : status === "failed" ? "#FEF2F2" : "#FFFBEB";

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: bg }}>
          {icon}
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-3"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          {status === "success" ? "Identiteit geverifieerd!" :
           status === "failed" ? "Verificatie mislukt" : "Verificatie loopt…"}
        </h1>
        <p className="text-sm mb-8 leading-[1.7]" style={{ color: "var(--muted)" }}>
          {message}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/onboarding"
            className="w-full py-3.5 rounded-[40px] text-[14px] font-bold text-white no-underline inline-block text-center"
            style={{ background: "var(--teal)" }}>
            {status === "failed" ? "Opnieuw proberen" : "Verder met onboarding →"}
          </Link>
          {status === "processing" && (
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>
              Je ontvangt een e-mail zodra de verificatie is afgerond.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
