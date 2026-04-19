export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VerzekeringenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen");

  const options = [
    {
      icon: "🛡️",
      title: "Beroepsaansprakelijkheidsverzekering",
      desc: "Verplicht voor ZZP&apos;ers. Dekt schade aan derden tijdens de uitvoering van je werk.",
      partner: "Via CaredIn partner",
      price: "Vanaf €15/maand",
      badge: "Aanbevolen",
      badgeColor: "var(--teal)",
    },
    {
      icon: "🏥",
      title: "Arbeidsongeschiktheidsverzekering (AOV)",
      desc: "Beschermt je inkomen als je door ziekte of letsel niet kunt werken.",
      partner: "Vergelijk aanbieders",
      price: "Vanaf €80/maand",
      badge: "Belangrijk",
      badgeColor: "#1E40AF",
    },
    {
      icon: "💰",
      title: "Pensioenopbouw",
      desc: "Als ZZP&apos;er bouw je geen automatisch pensioen op. Regel het zelf via lijfrente of banksparen.",
      partner: "Meer informatie",
      price: "Zelf in te stellen",
      badge: "Optioneel",
      badgeColor: "#6B7280",
    },
  ];

  return (
    <div className="px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Bescherming</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Mijn verzekeringen & pensioen
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Als ZZP&apos;er in de zorg ben je verantwoordelijk voor je eigen verzekeringen en pensioen. CaredIn helpt je de weg te vinden.
        </p>

        <div className="space-y-4">
          {options.map(opt => (
            <div key={opt.title} className="rounded-2xl p-6 bg-white flex items-start gap-5"
              style={{ border: "0.5px solid var(--border)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--teal-light)" }}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[14px] font-bold" style={{ color: "var(--dark)" }}>{opt.title}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: opt.badgeColor }}>
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[12px] leading-[1.65] mb-3" style={{ color: "var(--muted)" }}>{opt.desc}</p>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--teal)" }}>{opt.price}</span>
                  <button disabled className="text-[12px] font-semibold px-4 py-1.5 rounded-[40px] opacity-50 cursor-not-allowed"
                    style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none", fontFamily: "inherit" }}>
                    {opt.partner} (binnenkort)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
