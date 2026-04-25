import Link from "next/link";
import { Nav } from "@/components/Nav";

const VACCINES = [
  {
    icon: "💉",
    title: "Hepatitis B",
    text: "Aanbevolen voor alle zorgprofessionals die in contact komen met bloed of lichaamsvloeistoffen. Vaccinatiebewijs kan worden geüpload in je profiel.",
  },
  {
    icon: "🫁",
    title: "Influenza (griep)",
    text: "Jaarlijkse griepvaccinatie wordt sterk aanbevolen. Veel instellingen stellen dit verplicht voor personeel op zorgafdelingen.",
  },
  {
    icon: "🧬",
    title: "COVID-19",
    text: "Afhankelijk van de instelling kan een geldig COVID-19 vaccinatiebewijs vereist zijn. Beleid verschilt per zorgorganisatie.",
  },
  {
    icon: "🦠",
    title: "Mazelen, Bof, Rubella (BMR)",
    text: "Voor professionals geboren na 1970 die niet eerder gevaccineerd zijn of de ziekte niet hebben doorgemaakt, is BMR-vaccinatie aanbevolen.",
  },
  {
    icon: "🩺",
    title: "Tuberculose (TBC) screening",
    text: "Professionals die werken met kwetsbare groepen kunnen worden gevraagd een TBC-screening te overleggen. Dit is geen vaccinatie maar een aanvullende eis.",
  },
  {
    icon: "📋",
    title: "Instellingsspecifiek beleid",
    text: "Sommige zorginstellingen hanteren aanvullende vaccinatievereisten. Deze worden vermeld in de dienstomschrijving op het platform.",
  },
];

const FAQ = [
  {
    q: "Moet ik mijn vaccinatiestatus delen op CaredIn?",
    a: "CaredIn verplicht geen vaccinatiegegevens als standaardvereiste. Individuele instellingen kunnen dit wel vragen als onderdeel van hun eigen beleid. Je kunt vaccinatiebewijzen optioneel uploaden in je profiel.",
  },
  {
    q: "Wat als een instelling vaccinatie verplicht stelt?",
    a: "Als een instelling specifieke vaccinatievereisten heeft, wordt dit duidelijk vermeld in de dienstomschrijving. Je kunt dan zelf beslissen of je solliciteert op die dienst.",
  },
  {
    q: "Waar kan ik vaccinatiebewijzen uploaden?",
    a: "In je dashboard onder 'Documenten & certificaten' kun je vaccinatiebewijzen toevoegen. Deze zijn alleen zichtbaar voor instellingen waarmee je actief verbonden bent.",
  },
  {
    q: "Is mijn vaccinatiestatus vertrouwelijk?",
    a: "Ja. Vaccinatiegegevens vallen onder bijzondere persoonsgegevens en worden behandeld conform de AVG. Ze worden nooit zonder jouw toestemming gedeeld.",
  },
];

export default function Vaccinatiebeleid() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="px-12 py-20 relative overflow-hidden" style={{ background: "var(--dark)" }}>
        <div
          className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 70%)" }}
        />

        <div className="max-w-5xl mx-auto relative">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[40px] text-[12px] font-semibold uppercase tracking-[0.4px] mb-8"
            style={{
              background: "rgba(93,184,164,0.12)",
              color: "var(--teal-mid)",
              border: "0.5px solid rgba(93,184,164,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal-mid)" }} />
            Vaccinatiebeleid
          </div>

          <h1
            className="text-[clamp(42px,5.5vw,76px)] font-bold text-white tracking-[-2px] leading-[1.03] mb-6"
            style={{ fontFamily: "var(--font-fraunces)", maxWidth: "820px" }}
          >
            Veilig werken in<br />de zorg begint hier.
          </h1>

          <p className="text-base leading-[1.75] mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            In de zorg is de bescherming van patiënten en medewerkers een gedeelde verantwoordelijkheid.
            CaredIn ondersteunt een transparant en respectvol vaccinatiebeleid — zonder druk, met ruimte
            voor ieders afweging.
          </p>

          <div className="flex gap-4">
            <Link
              href="/registreren?rol=freeflexer"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}
            >
              Aanmelden als professional →
            </Link>
            <Link
              href="/privacy"
              className="px-7 py-3.5 rounded-[40px] text-sm font-semibold no-underline"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Privacybeleid lezen →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-12 py-20 space-y-24">

          {/* Standpunt */}
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
                Ons standpunt
              </div>
              <h2
                className="text-[36px] font-bold tracking-[-0.5px] mb-4"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
              >
                Transparantie, geen verplichting.
              </h2>
              <p className="text-sm leading-[1.8] mb-4" style={{ color: "var(--muted)" }}>
                CaredIn legt geen platformbrede vaccinatieplicht op. Wij geloven in keuzevrijheid
                en transparantie. Instellingen mogen hun eigen beleid voeren — professionals
                zien dit vooraf, zodat ze een weloverwogen keuze kunnen maken.
              </p>
              <p className="text-sm leading-[1.8]" style={{ color: "var(--muted)" }}>
                Vaccinatiegegevens die je deelt, zijn strikt vertrouwelijk en vallen onder de
                strengste AVG-normen. Je bepaalt zelf wat je deelt en met wie.
              </p>
            </div>
            <div
              className="rounded-3xl p-8"
              style={{ background: "var(--teal-light)", border: "0.5px solid var(--border)" }}
            >
              <div className="space-y-4">
                {[
                  ["AVG-conform", "Vaccinatiegegevens zijn bijzondere persoonsgegevens en worden zo behandeld."],
                  ["Transparant per dienst", "Vaccinatievereisten van instellingen worden vooraf getoond."],
                  ["Jouw keuze", "Je beslist zelf of je solliciteert op diensten met specifieke eisen."],
                  ["Veilig opgeslagen", "Documenten worden versleuteld opgeslagen en nooit gedeeld zonder toestemming."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
                      style={{ background: "var(--teal)", color: "white" }}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--dark)" }}>{title}</div>
                      <div className="text-xs leading-[1.6]" style={{ color: "var(--muted)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vaccins */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Aanbevolen vaccinaties
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Wat is gebruikelijk in de zorg?
            </h2>
            <p className="text-sm mb-10 max-w-xl leading-[1.7]" style={{ color: "var(--muted)" }}>
              De GGD en RIVM adviseren bepaalde vaccinaties voor zorgprofessionals. Hieronder een overzicht
              van wat gangbaar is in de sector.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {VACCINES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--teal-light)" }}
                    >
                      {v.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold mb-1.5" style={{ color: "var(--dark)" }}>
                        {v.title}
                      </div>
                      <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                        {v.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3" style={{ color: "var(--teal)" }}>
              Veelgestelde vragen
            </div>
            <h2
              className="text-[36px] font-bold tracking-[-0.5px] mb-10"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Alles over vaccinatie op CaredIn.
            </h2>

            <div className="space-y-4">
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl p-6 bg-white"
                  style={{ border: "0.5px solid var(--border)" }}
                >
                  <div className="text-sm font-bold mb-2" style={{ color: "var(--dark)" }}>
                    {item.q}
                  </div>
                  <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{ background: "var(--dark)" }}
          >
            <div
              className="absolute top-[-60px] right-[-60px] w-[350px] h-[350px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }}
            />
            <div className="relative max-w-2xl">
              <div
                className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4"
                style={{ color: "var(--teal-mid)" }}
              >
                Vragen?
              </div>
              <h2
                className="text-[34px] font-bold text-white leading-[1.15] mb-5"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Heb je specifieke vragen over ons vaccinatiebeleid?
              </h2>
              <p className="text-sm leading-[1.75] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Ons team beantwoordt al je vragen over beleid, gegevensverwerking en wat
                instellingen van jou mogen verwachten.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/helpdesk"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
                  style={{ background: "var(--teal)" }}
                >
                  Helpdesk →
                </Link>
                <Link
                  href="/privacy"
                  className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  Privacybeleid
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-12 py-12 grid gap-10"
        style={{ background: "var(--dark)", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
      >
        <div>
          <div
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
          >
            Caredin
          </div>
          <div
            className="text-[13px] leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.35)", maxWidth: "200px" }}
          >
            Het flexibele zorgplatform dat professionals en instellingen verbindt.
          </div>
        </div>
        {[
          { heading: "Professionals", links: ["Diensten zoeken", "Je verdiensten", "Registraties", "Onze belofte"] },
          { heading: "Instellingen", links: ["Professionals vinden", "Tarieven", "Sectoren", "Integraties"] },
          { heading: "CaredIn", links: ["Ons verhaal", "Vacatures", "Nieuwsroom", "Contact"] },
        ].map((col) => (
          <div key={col.heading}>
            <h4
              className="text-xs font-bold uppercase tracking-[1px] mb-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {col.heading}
            </h4>
            <ul className="list-none space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] no-underline" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
    </>
  );
}
