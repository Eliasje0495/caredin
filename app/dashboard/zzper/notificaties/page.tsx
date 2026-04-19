export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NotificatiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const prefs = [
    { icon: "📋", title: "Nieuwe diensten in jouw regio",    desc: "Ontvang een melding als er een nieuwe dienst is die bij jouw profiel past.", key: "new_shifts" },
    { icon: "✅", title: "Dienst geaccepteerd",               desc: "Als een instelling jouw aanmelding accepteert.", key: "accepted" },
    { icon: "❌", title: "Dienst afgewezen",                  desc: "Als een instelling jouw aanmelding afwijst.", key: "rejected" },
    { icon: "💶", title: "Uitbetaling verwerkt",              desc: "Als een uitbetaling is overgemaakt naar je rekening.", key: "payout" },
    { icon: "🔔", title: "Herinnering dienst morgen",         desc: "Een dag van tevoren herinnerd aan je dienst.", key: "reminder" },
    { icon: "💬", title: "Berichten van instellingen",        desc: "Als een instelling je een bericht stuurt.", key: "messages" },
  ];

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Voorkeuren</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Notificaties
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Bepaal wanneer en hoe je meldingen ontvangt van CaredIn.
        </p>

        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
          {prefs.map((pref, i) => (
            <div key={pref.key} className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: i < prefs.length - 1 ? "0.5px solid var(--border)" : "none" }}>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: "var(--teal-light)" }}>
                  {pref.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--dark)" }}>{pref.title}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>{pref.desc}</div>
                </div>
              </div>
              {/* Toggle (visual only for now) */}
              <div className="w-11 h-6 rounded-full flex-shrink-0 relative cursor-pointer"
                style={{ background: i < 4 ? "var(--teal)" : "var(--border)" }}>
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
                  style={{ left: i < 4 ? "calc(100% - 20px)" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px]" style={{ color: "var(--muted)" }}>
          Notificatie-instellingen worden opgeslagen in je profiel. Je kunt ze altijd wijzigen.
        </p>
      </div>
    </div>
  );
}
