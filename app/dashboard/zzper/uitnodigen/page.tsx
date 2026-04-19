export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UitnodigenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const referralCode = `CARE-${(session.user as any).id?.slice(0, 6).toUpperCase()}`;

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Groei samen</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Vrienden uitnodigen
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Ken jij zorgprofessionals die ook flexibel willen werken? Nodig ze uit en jullie verdienen allebei een bonus zodra ze hun eerste dienst afronden.
        </p>

        {/* Referral card */}
        <div className="rounded-2xl p-8 text-center mb-6" style={{ background: "var(--dark)" }}>
          <div className="text-4xl mb-4">🎁</div>
          <h2 className="text-[22px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
            Jouw persoonlijke uitnodigingscode
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Deel deze code. Zodra een vriend zijn eerste dienst afrondt, ontvangen jullie allebei €25,–.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className="text-xl font-bold tracking-[2px] text-white"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              {referralCode}
            </span>
            <button className="text-[12px] font-semibold px-3 py-1 rounded-full cursor-pointer"
              style={{ background: "var(--teal)", color: "#fff", border: "none", fontFamily: "inherit" }}
              onClick={() => {}}>
              Kopieer
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl bg-white p-6" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: "var(--dark)" }}>Hoe het werkt</div>
          <div className="space-y-3">
            {[
              "Deel je code met een collega zorgprofessional.",
              "Zij melden zich aan via caredin.nl en voeren je code in.",
              "Na hun eerste afgeronde dienst ontvangen jullie allebei €25,–.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: "var(--teal)" }}>
                  {i + 1}
                </div>
                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--muted)" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
