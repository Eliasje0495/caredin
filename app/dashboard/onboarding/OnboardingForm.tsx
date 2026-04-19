"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddressAutocomplete from "@/components/AddressAutocomplete";

const WORKER_STEPS = ["Profiel & foto", "ID & VOG", "Registraties", "Financieel"];
const EMPLOYER_STEPS = ["Organisatiegegevens", "Logo uploaden", "KvK-gegevens", "Factuurgegevens"];

function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="flex items-center mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
              style={{
                background: i < active ? "var(--teal)" : i === active ? "var(--teal)" : "#fff",
                border: `2px solid ${i <= active ? "var(--teal)" : "var(--border)"}`,
                color: i <= active ? "#fff" : "var(--muted)",
              }}>
              {i < active ? "✓" : i + 1}
            </div>
            <span className="text-[12px] font-semibold hidden lg:block"
              style={{ color: i <= active ? "var(--dark)" : "var(--muted)" }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px mx-3" style={{ background: i < active ? "var(--teal)" : "var(--border)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── TERMS SCREEN ──────────────────────────────────────────────
function TermsScreen({ name, onAccept }: { name: string; onAccept: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-10 py-5 flex items-center justify-between" style={{ background: "var(--dark)" }}>
        <Link href="/" className="no-underline text-[20px] font-bold tracking-[-0.5px]"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
          Care<span style={{ color: "rgba(255,255,255,0.8)" }}>din</span>
        </Link>
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Welkom, {name.split(" ")[0]} 👋
        </span>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.8px] mb-6"
            style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
            Eenmalig — vereist om verder te gaan
          </div>

          <h1 className="text-[34px] font-bold tracking-[-1px] leading-[1.1] mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Gebruikersovereenkomst voor zorgprofessionals
          </h1>
          <p className="text-sm mb-8 leading-[1.7]" style={{ color: "var(--muted)" }}>
            Transparantie is onze basis. Hieronder de kernpunten van onze overeenkomst — geen klein gedrukt.
          </p>

          {/* Key points */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: "🔒", title: "Privacy first", desc: "Je gegevens worden nooit verkocht aan derden. Je registratienummers zijn alleen zichtbaar voor geverifieerde zorginstellingen." },
              { icon: "💶", title: "Eerlijke uitbetaling", desc: "Je ontvangt 100% van het afgesproken tarief. CaredIn rekent een platformbijdrage van €3,– per gewerkt uur aan de instelling." },
              { icon: "✅", title: "Kwaliteitsstandaard", desc: "Je stemt in met verificatie van je registraties. Onjuiste gegevens leiden tot verwijdering van het platform." },
              { icon: "📋", title: "ZZP & contract", desc: "Je werkt als zelfstandige of via loondienst. CaredIn is geen werkgever — wij faciliteren de match tussen jou en de instelling." },
            ].map(p => (
              <div key={p.title} className="flex gap-3 p-4 rounded-xl bg-white"
                style={{ border: "0.5px solid var(--border)" }}>
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <div>
                  <div className="text-[13px] font-bold mb-1" style={{ color: "var(--dark)" }}>{p.title}</div>
                  <p className="text-[12px] leading-[1.6]" style={{ color: "var(--muted)" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable full text */}
          <div className="rounded-2xl bg-white mb-6 overflow-hidden"
            style={{ border: "0.5px solid var(--border)" }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: "0.5px solid var(--border)", background: "var(--bg)" }}>
              <span className="text-[12px] font-semibold" style={{ color: "var(--dark)" }}>
                Volledige gebruikersovereenkomst opdrachtnemers
              </span>
              <span className="text-[11px]" style={{ color: "var(--muted)" }}>Scroll om te lezen</span>
            </div>
            <div
              className="px-5 py-4 overflow-y-auto text-[13px] leading-[1.75]"
              style={{ maxHeight: "260px", color: "var(--muted)" }}
              onScroll={e => {
                const el = e.currentTarget;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true);
              }}>
              <p className="mb-4">
                <strong style={{ color: "var(--dark)" }}>CaredIn B.V.</strong> is een digitaal platform dat zorgprofessionals verbindt met zorginstellingen in Nederland. Door gebruik te maken van het CaredIn-platform als opdrachtnemer ga je akkoord met de onderstaande voorwaarden.
              </p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 1 — Definities</p>
              <p className="mb-3"><strong>Platform:</strong> Het digitale platform van CaredIn waarop diensten worden aangeboden en gevonden.<br/>
              <strong>Professional:</strong> De zelfstandige zorgprofessional die via het platform diensten aanbiedt.<br/>
              <strong>Instelling:</strong> De zorgorganisatie die via het platform zorgprofessionals zoekt.<br/>
              <strong>Dienst:</strong> Een tijdelijk werk- of zorgassignement aangeboden door een instelling.</p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 2 — Registratie en verificatie</p>
              <p className="mb-3">De professional is verplicht correcte gegevens te verstrekken, inclusief een geldig registratienummers waar van toepassing. CaredIn behoudt het recht om profielen te verwijderen bij onjuiste of misleidende informatie.</p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 3 — Betaling en uitbetaling</p>
              <p className="mb-3">Uitbetaling vindt plaats binnen 48 uur na goedkeuring van de gewerkte uren door de instelling. CaredIn rekent een platformbijdrage van €3,– per gewerkt uur, uitsluitend in rekening gebracht bij de instelling.</p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 4 — Aansprakelijkheid</p>
              <p className="mb-3">De professional is verantwoordelijk voor zijn/haar eigen professionele handelingen. CaredIn is niet aansprakelijk voor schade ontstaan uit een dienst. De professional dient over een geldige beroepsaansprakelijkheidsverzekering te beschikken.</p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 5 — Privacy</p>
              <p className="mb-3">CaredIn verwerkt persoonsgegevens conform de AVG. Gegevens worden uitsluitend gedeeld met zorginstellingen ten behoeve van het matchen van diensten. Zie ons volledige privacybeleid op caredin.nl/privacy.</p>
              <p className="font-bold mb-1" style={{ color: "var(--dark)" }}>Artikel 6 — Beëindiging</p>
              <p>De professional kan zijn account op elk moment verwijderen. Lopende diensten dienen te worden afgerond. CaredIn behoudt het recht een account te schorsen bij schending van deze voorwaarden.</p>
            </div>
          </div>

          {/* Scroll nudge */}
          {!scrolled && (
            <div className="flex items-center gap-2 mb-4 text-[12px]" style={{ color: "var(--muted)" }}>
              <span>↓</span>
              <span>Scroll de overeenkomst om de knop te activeren</span>
            </div>
          )}

          <button
            onClick={onAccept}
            disabled={!scrolled}
            className="w-full py-4 rounded-[40px] text-[15px] font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
            Ik ga akkoord en ga verder →
          </button>

          <p className="mt-4 text-center text-[12px]" style={{ color: "var(--muted)" }}>
            Al een account?{" "}
            <Link href="/inloggen" className="no-underline font-semibold" style={{ color: "var(--teal)" }}>Inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── PROPS ──────────────────────────────────────────────────────
interface Props {
  role: "WORKER" | "EMPLOYER";
  name: string;
}

export default function OnboardingForm({ role, name }: Props) {
  const router = useRouter();
  const steps = role === "WORKER" ? WORKER_STEPS : EMPLOYER_STEPS;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Worker step 1 — profile + photo
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Worker step 1 — functie
  const [primaryFunction, setPrimaryFunction] = useState("");

  // Worker step 2 — VOG
  const [vogFile, setVogFile] = useState<File | null>(null);

  // Worker step 3 — Registraties
  const [registrationType, setRegistrationType] = useState<"BIG" | "SKJ" | "KABIZ" | "CRKBO" | "NVPA_NIP" | "MEERDERE" | "NONE" | "">("");
  const [bigNumber, setBigNumber] = useState("");
  const [bigLookup, setBigLookup] = useState<{ loading: boolean; name?: string; profession?: string; error?: string }>({ loading: false });
  const [skjNumber, setSkjNumber] = useState("");
  const [kabizNumber, setKabizNumber] = useState("");
  const [diplomaNumber, setDiplomaNumber] = useState("");
  const [diplomaLookup, setDiplomaLookup] = useState<{ loading: boolean; opleiding?: string; instelling?: string; error?: string }>({ loading: false });
  const [agbCode, setAgbCode] = useState("");
  const [agbLookup, setAgbLookup] = useState<{ loading: boolean; naam?: string; specialisme?: string; error?: string }>({ loading: false });
  const [crkboNumber, setCrkboNumber] = useState("");
  const [nvpaNipNumber, setNvpaNipNumber] = useState("");

  // Worker step 4 — financial
  const [kvkNumber, setKvkNumber] = useState("");
  const [kvkLookup, setKvkLookup] = useState<{ loading: boolean; companyName?: string; legalForm?: string; error?: string }>({ loading: false });
  const [kvkCompanyName, setKvkCompanyName] = useState("");
  const [contractType, setContractType] = useState("ZZP");
  const [hourlyRate, setHourlyRate] = useState("");

  // Employer step 1
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  // Profile completion % for workers
  const completion = Math.round([
    !!photoPreview,
    !!phone,
    !!dateOfBirth,
    !!address,
    !!bio,
    !!postalCode,
    !!city,
  ].filter(Boolean).length / 7 * 100);

  async function lookupBig(value: string) {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length !== 11) { setBigLookup({ loading: false }); return; }
    setBigLookup({ loading: true });
    const res = await fetch(`/api/big?number=${cleaned}`).catch(() => null);
    if (!res) { setBigLookup({ loading: false, error: "Verbinding mislukt" }); return; }
    const d = await res.json();
    setBigLookup({ loading: false, name: d.name, profession: d.profession, error: d.error });
  }

  async function lookupDiploma(value: string) {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length < 6) { setDiplomaLookup({ loading: false }); return; }
    setDiplomaLookup({ loading: true });
    const res = await fetch(`/api/duo?number=${cleaned}`).catch(() => null);
    if (!res) { setDiplomaLookup({ loading: false, error: "Verbinding mislukt" }); return; }
    const d = await res.json();
    setDiplomaLookup({ loading: false, opleiding: d.opleiding, instelling: d.instelling, error: d.error });
  }

  async function lookupAgb(value: string) {
    const cleaned = value.replace(/[-\s]/g, "");
    if (cleaned.length < 8) { setAgbLookup({ loading: false }); return; }
    setAgbLookup({ loading: true });
    const res = await fetch(`/api/agb?code=${cleaned}`).catch(() => null);
    if (!res) { setAgbLookup({ loading: false, error: "Verbinding mislukt" }); return; }
    const d = await res.json();
    setAgbLookup({ loading: false, naam: d.naam, specialisme: d.specialisme, error: d.error });
  }

  async function lookupKvk(value: string) {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length !== 8) { setKvkLookup({ loading: false }); return; }
    setKvkLookup({ loading: true });
    const res = await fetch(`/api/kvk?number=${cleaned}`).catch(() => null);
    if (!res) { setKvkLookup({ loading: false, error: "Verbinding mislukt" }); return; }
    const d = await res.json();
    setKvkLookup({ loading: false, companyName: d.companyName, legalForm: d.legalForm, error: d.error });
    if (d.companyName && !kvkCompanyName) setKvkCompanyName(d.companyName);
  }

  async function saveStep(stepData: any) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, ...stepData }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Er ging iets mis.");
      return false;
    }
    return true;
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    let data: any = {};

    if (role === "WORKER") {
      if (step === 1) data = { phone, bio, dateOfBirth, address, city, postalCode, primaryFunction };
      if (step === 2) data = {};
      if (step === 3) data = { registrationType, bigNumber, skjNumber, kabizNumber, agbCode, crkboNumber, nvpaNipNumber, diplomaNumber };
      if (step === 4) data = { kvkNumber, kvkCompanyName, contractType, hourlyRate };
    } else {
      if (step === 1) data = { description, address, city, postalCode, website };
      if (step === 2) data = {};
      if (step === 3) data = { kvkNumber };
      if (step === 4) data = {};
    }

    const ok = await saveStep(data);
    if (!ok) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      router.push(role === "WORKER" ? "/dashboard/zzper" : "/dashboard/organisatie");
    }
  }

  function skip() {
    if (step < 4) setStep(step + 1);
    else router.push(role === "WORKER" ? "/dashboard/zzper" : "/dashboard/organisatie");
  }

  // Show terms screen first for workers
  if (role === "WORKER" && !termsAccepted) {
    return <TermsScreen name={name} onAccept={() => setTermsAccepted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-10 py-5 flex items-center justify-between" style={{ background: "var(--dark)" }}>
        <Link href="/" className="no-underline text-[20px] font-bold tracking-[-0.5px]"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
          Care<span style={{ color: "rgba(255,255,255,0.8)" }}>din</span>
        </Link>
        <div className="flex items-center gap-3">
          {role === "WORKER" && (
            <span className="text-[12px] font-semibold"
              style={{ color: completion >= 80 ? "var(--teal-mid)" : "rgba(255,255,255,0.4)" }}>
              Profiel {completion}% compleet
            </span>
          )}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: "var(--teal)" }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 md:px-12 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>
            Welkom, {name.split(" ")[0]}!
          </p>
          <h1 className="text-[30px] font-bold tracking-[-0.5px] mb-8"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Stel je profiel in
          </h1>

          <Stepper steps={steps} active={step - 1} />

          <form onSubmit={handleNext}>

            {/* ──── WORKER STEP 1: Profiel & foto ──── */}
            {role === "WORKER" && step === 1 && (
              <div className="space-y-6">
                {/* Profile completion bar */}
                <div className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold" style={{ color: "var(--dark)" }}>
                      Jouw profiel is je visitekaartje
                    </span>
                    <span className="text-[13px] font-bold" style={{ color: "var(--teal)" }}>{completion}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--teal-light)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${completion}%`, background: "var(--teal)" }} />
                  </div>
                  <p className="text-[12px] mt-2" style={{ color: "var(--muted)" }}>
                    Zorginstellingen hebben je telefoonnummer nodig om contact met je op te nemen.
                  </p>
                </div>

                {/* Photo upload */}
                <div>
                  <div className="text-[13px] font-semibold mb-3" style={{ color: "var(--text)" }}>Profielfoto</div>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{
                        background: photoPreview ? "transparent" : "var(--teal-light)",
                        border: `2px dashed ${photoPreview ? "var(--teal)" : "var(--border)"}`,
                      }}>
                      {photoPreview
                        ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        : <span className="text-2xl">📷</span>}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[40px] text-[13px] font-semibold cursor-pointer"
                        style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none" }}>
                        {photoPreview ? "Foto wijzigen" : "Foto uploaden"}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setPhotoPreview(URL.createObjectURL(file));
                          }} />
                      </label>
                      <p className="text-[11px] mt-1.5" style={{ color: "var(--muted)" }}>JPG of PNG · max. 5MB</p>
                      <div className="mt-3 rounded-xl px-3 py-2.5 text-[11px] leading-[1.7]" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                        <div className="font-bold mb-1">📸 Richtlijnen profielfoto</div>
                        <div>✓ Duidelijk gezicht, bij voorkeur in werkkleding</div>
                        <div>✓ Neutrale of witte achtergrond</div>
                        <div>✓ Goede belichting, geen filters</div>
                        <div style={{ color: "#ef4444" }}>✗ Geen groepsfoto&apos;s, logo&apos;s of tekst</div>
                        <div style={{ color: "#ef4444" }}>✗ Geen zonnebril of hoed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone + birthdate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                      style={{ color: "var(--muted)" }}>Telefoonnummer</label>
                    <div className="flex">
                      <div className="flex items-center px-3 rounded-l-xl text-sm font-semibold flex-shrink-0"
                        style={{ background: "var(--teal-light)", border: "1.5px solid var(--teal)", borderRight: "none", color: "var(--teal)" }}>
                        +31
                      </div>
                      <input type="tel" value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="6 12 34 56 78"
                        className="flex-1 px-4 py-3 rounded-r-xl text-sm outline-none bg-white"
                        style={{ border: "1.5px solid var(--border)", borderLeft: "none", fontFamily: "inherit", color: "var(--text)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                      style={{ color: "var(--muted)" }}>Geboortedatum</label>
                    <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Over jezelf <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optioneel)</span>
                  </label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    placeholder="Korte beschrijving van je ervaring en specialisaties…"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white resize-none"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
                </div>

                {/* Functie */}
                <div>
                  <label className="block text-[12px] font-semibold mb-2 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>Primaire functie</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: "VERPLEEGKUNDIGE",           label: "Verpleegkundige" },
                      { value: "VERZORGENDE_IG",            label: "Verzorgende IG" },
                      { value: "HELPENDE_PLUS",             label: "Helpende Plus" },
                      { value: "HELPENDE",                  label: "Helpende" },
                      { value: "ZORGASSISTENT",             label: "Zorgassistent" },
                      { value: "GGZ_AGOOG",                 label: "GGZ Agoog" },
                      { value: "PERSOONLIJK_BEGELEIDER",    label: "Persoonlijk Begeleider" },
                      { value: "GEDRAGSDESKUNDIGE",         label: "Gedragsdeskundige" },
                      { value: "FYSIOTHERAPEUT",            label: "Fysiotherapeut" },
                      { value: "ERGOTHERAPEUT",             label: "Ergotherapeut" },
                      { value: "LOGOPEDIST",                label: "Logopedist" },
                      { value: "KRAAMVERZORGENDE",          label: "Kraamverzorgende" },
                      { value: "ARTS",                      label: "Arts" },
                      { value: "SPECIALIST_OUDERENGENEESKUNDE", label: "Specialist Ouderengeneeskunde" },
                      { value: "OVERIG",                    label: "Overig" },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setPrimaryFunction(opt.value)}
                        className="px-3 py-2.5 rounded-xl text-sm text-left font-medium cursor-pointer"
                        style={{
                          background: primaryFunction === opt.value ? "var(--teal)" : "#fff",
                          color: primaryFunction === opt.value ? "#fff" : "var(--dark)",
                          border: primaryFunction === opt.value ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                          fontFamily: "inherit",
                        }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <AddressAutocomplete
                  address={address}
                  postalCode={postalCode}
                  city={city}
                  onChange={({ address: a, postalCode: p, city: c }) => {
                    setAddress(a); setPostalCode(p); setCity(c);
                  }}
                />
              </div>
            )}

            {/* ──── WORKER STEP 2: Stripe Identity + VOG ──── */}
            {role === "WORKER" && step === 2 && (
              <div className="space-y-6">
                <StripeIdentityStep />

                {/* VOG upload */}
                <div className="rounded-2xl p-5 bg-white" style={{ border: "0.5px solid var(--border)" }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">📄</span>
                    <div>
                      <div className="text-[14px] font-bold mb-1" style={{ color: "var(--dark)" }}>
                        Verklaring Omtrent Gedrag (VOG)
                      </div>
                      <p className="text-[12px] leading-[1.65]" style={{ color: "var(--muted)" }}>
                        Veel zorginstellingen vereisen een geldige VOG. Upload hem nu of later vanuit je profiel. Een VOG is geldig voor 1 jaar en is aan te vragen via <a href="https://www.justis.nl/producten/vog" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>justis.nl</a>.
                      </p>
                    </div>
                  </div>

                  {vogFile ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(22,101,52,0.07)", border: "1px solid rgba(22,101,52,0.25)" }}>
                      <span>✅</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ color: "#166534" }}>{vogFile.name}</div>
                        <div className="text-[11px]" style={{ color: "#166534" }}>{(vogFile.size / 1024).toFixed(0)} KB</div>
                      </div>
                      <button type="button" onClick={() => setVogFile(null)}
                        className="text-xs font-semibold cursor-pointer"
                        style={{ color: "#991B1B", background: "none", border: "none" }}>
                        Verwijderen
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-[13px] font-semibold"
                      style={{ background: "var(--teal-light)", color: "var(--teal)", border: "1.5px dashed var(--teal)" }}>
                      📎 VOG uploaden (PDF of foto)
                      <input type="file" accept=".pdf,image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setVogFile(f); }} />
                    </label>
                  )}

                  <div className="flex items-center gap-2 mt-3 text-[11px]" style={{ color: "var(--muted)" }}>
                    <span>ℹ️</span>
                    <span>Je VOG is alleen zichtbaar voor geverifieerde zorginstellingen</span>
                  </div>
                </div>
              </div>
            )}

            {/* ──── WORKER STEP 3: Registraties ──── */}
            {role === "WORKER" && step === 3 && (() => {
              const NO_REG_NEEDED = ["ZORGASSISTENT", "HELPENDE", "HELPENDE_PLUS", "PERSOONLIJK_BEGELEIDER", "OVERIG"];
              const registratieOptioneel = primaryFunction && NO_REG_NEEDED.includes(primaryFunction);
              return (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                    Beroepsregistraties
                  </h2>
                  <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>
                    Voeg je registraties toe zodat zorginstellingen jouw kwalificaties kunnen verifiëren.
                  </p>
                </div>

                {registratieOptioneel && (
                  <div className="rounded-2xl p-5" style={{ background: "rgba(22,101,52,0.06)", border: "1.5px solid rgba(22,101,52,0.25)" }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <div className="flex-1">
                        <div className="text-[14px] font-bold mb-1" style={{ color: "#166534" }}>
                          Geen verplichte registratie voor jouw functie
                        </div>
                        <p className="text-[13px] leading-[1.65]" style={{ color: "#166534" }}>
                          Als {primaryFunction === "ZORGASSISTENT" ? "Zorgassistent" : primaryFunction === "HELPENDE_PLUS" ? "Helpende Plus" : primaryFunction === "HELPENDE" ? "Helpende" : primaryFunction === "PERSOONLIJK_BEGELEIDER" ? "Persoonlijk Begeleider" : "zorgprofessional"} is een BIG-, SKJ- of andere registratie niet vereist. Je kunt deze stap overslaan — of optioneel toch een registratie toevoegen.
                        </p>
                        <button type="button" onClick={skip}
                          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-[40px] text-sm font-bold cursor-pointer"
                          style={{ background: "#166534", color: "#fff", border: "none", fontFamily: "inherit" }}>
                          Doorgaan zonder registratie →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: "BIG-register", desc: "Verpleegkundigen, artsen, fysiotherapeuten e.a.", href: "https://www.bigregister.nl", link: "bigregister.nl" },
                    { title: "SKJ-register", desc: "Professionals in jeugdzorg en gedragswetenschappers.", href: "https://www.skjeugd.nl", link: "skjeugd.nl" },
                    { title: "KABIZ", desc: "Gedragsdeskundigen, orthopedagogen en GZ-psychologen.", href: "https://www.kabiz.nl", link: "kabiz.nl" },
                    { title: "CRKBO", desc: "Zelfstandige trainers en docenten in de zorg (BTW-vrijstelling).", href: "https://www.crkbo.nl", link: "crkbo.nl" },
                    { title: "NVPA / NIP", desc: "Psychologen en agogen — beroepsvereniging (geen wettelijke verplichting).", href: "https://www.psynip.nl", link: "psynip.nl" },
                  ].map(r => (
                    <div key={r.title} className="rounded-xl p-4" style={{ background: "var(--teal-light)", border: "0.5px solid rgba(26,122,106,0.2)" }}>
                      <div className="text-sm font-bold mb-1" style={{ color: "var(--dark)" }}>{r.title}</div>
                      <p className="text-xs leading-[1.6]" style={{ color: "var(--muted)" }}>{r.desc}</p>
                      <a href={r.href} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs font-semibold no-underline" style={{ color: "var(--teal)" }}>
                        {r.link} →
                      </a>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[13px] font-semibold mb-3" style={{ color: "var(--text)" }}>Welke registratie heb je?</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {([
                      { value: "BIG",      label: "BIG",       icon: "🏥" },
                      { value: "SKJ",      label: "SKJ",       icon: "👶" },
                      { value: "KABIZ",    label: "KABIZ",     icon: "🧠" },
                      { value: "CRKBO",    label: "CRKBO",     icon: "📋" },
                      { value: "NVPA_NIP", label: "NVPA/NIP",  icon: "🧬" },
                      { value: "MEERDERE", label: "Meerdere",  icon: "✅" },
                      { value: "NONE",     label: "Geen",      icon: "—"  },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setRegistrationType(opt.value)}
                        className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-left cursor-pointer"
                        style={{
                          background: registrationType === opt.value ? "var(--teal)" : "#fff",
                          color: registrationType === opt.value ? "#fff" : "var(--dark)",
                          border: registrationType === opt.value ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                          fontFamily: "inherit",
                        }}>
                        <span>{opt.icon}</span><span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {(registrationType === "BIG" || registrationType === "MEERDERE") && (
                  <div>
                    <Field label="BIG-nummer">
                      <input type="text" value={bigNumber}
                        onChange={e => { setBigNumber(e.target.value); lookupBig(e.target.value); }}
                        placeholder="11-cijferig nummer, bijv. 19025142501" />
                    </Field>
                    <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                      Vind je nummer op <a href="https://www.bigregister.nl" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>bigregister.nl</a>
                    </p>
                    {bigLookup.loading && <p className="text-xs mt-1.5" style={{ color: "var(--teal)" }}>Zoeken in BIG-register…</p>}
                    {!bigLookup.loading && bigLookup.name && (
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold" style={{ color: "#166534" }}>
                        ✓ {bigLookup.name}{bigLookup.profession ? ` — ${bigLookup.profession}` : ""}
                      </div>
                    )}
                    {!bigLookup.loading && bigLookup.error && (
                      <p className="text-xs mt-1.5" style={{ color: "#991B1B" }}>{bigLookup.error}</p>
                    )}
                  </div>
                )}

                {(registrationType === "SKJ" || registrationType === "MEERDERE") && (
                  <Field label="SKJ-nummer">
                    <input type="text" value={skjNumber} onChange={e => setSkjNumber(e.target.value)}
                      placeholder="SKJ-registratienummer" />
                  </Field>
                )}

                {(registrationType === "KABIZ" || registrationType === "MEERDERE") && (
                  <Field label="KABIZ-nummer">
                    <input type="text" value={kabizNumber} onChange={e => setKabizNumber(e.target.value)}
                      placeholder="KABIZ-registratienummer" />
                  </Field>
                )}

                {(registrationType === "CRKBO" || registrationType === "MEERDERE") && (
                  <Field label="CRKBO-nummer">
                    <input type="text" value={crkboNumber} onChange={e => setCrkboNumber(e.target.value)}
                      placeholder="CRKBO-registratienummer" />
                  </Field>
                )}

                {(registrationType === "NVPA_NIP" || registrationType === "MEERDERE") && (
                  <Field label="NVPA / NIP-lidmaatschapsnummer">
                    <input type="text" value={nvpaNipNumber} onChange={e => setNvpaNipNumber(e.target.value)}
                      placeholder="Lidmaatschapsnummer" />
                  </Field>
                )}

                <div>
                  <Field label="DUO Diplomanummer (optioneel)">
                    <input type="text" value={diplomaNumber}
                      onChange={e => { setDiplomaNumber(e.target.value); lookupDiploma(e.target.value); }}
                      placeholder="Bijv. 1234567890" />
                  </Field>
                  <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                    Verifieer je zorgopleiding via het <a href="https://mijn.diploma-register.nl" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>DUO Diplomaregister</a>
                  </p>
                  {diplomaLookup.loading && <p className="text-xs mt-1.5" style={{ color: "var(--teal)" }}>Zoeken in DUO register…</p>}
                  {!diplomaLookup.loading && diplomaLookup.opleiding && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold" style={{ color: "#166534" }}>
                      ✓ {diplomaLookup.opleiding}{diplomaLookup.instelling ? ` — ${diplomaLookup.instelling}` : ""}
                    </div>
                  )}
                  {!diplomaLookup.loading && diplomaLookup.error && (
                    <p className="text-xs mt-1.5" style={{ color: "#991B1B" }}>{diplomaLookup.error}</p>
                  )}
                </div>

                <div>
                  <Field label="AGB-code (optioneel)">
                    <input type="text" value={agbCode}
                      onChange={e => { setAgbCode(e.target.value); lookupAgb(e.target.value); }}
                      placeholder="bijv. 03-123456" />
                  </Field>
                  <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                    Vereist voor ZZP-ers die declareren bij zorginstellingen of verzekeraars.
                  </p>
                  {agbLookup.loading && <p className="text-xs mt-1.5" style={{ color: "var(--teal)" }}>Zoeken in AGB-register…</p>}
                  {!agbLookup.loading && agbLookup.naam && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold" style={{ color: "#166534" }}>
                      ✓ {agbLookup.naam}{agbLookup.specialisme ? ` — ${agbLookup.specialisme}` : ""}
                    </div>
                  )}
                  {!agbLookup.loading && agbLookup.error && (
                    <p className="text-xs mt-1.5" style={{ color: "#991B1B" }}>{agbLookup.error}</p>
                  )}
                </div>

                {registrationType && registrationType !== "NONE" && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(26,122,106,0.07)", border: "0.5px solid rgba(26,122,106,0.25)" }}>
                    <span className="mt-0.5">🔍</span>
                    <p className="text-xs leading-[1.65]" style={{ color: "var(--teal)" }}>
                      Je registratienummer wordt geverifieerd binnen 24 uur. Tot die tijd is je profiel zichtbaar maar gemarkeerd als <strong>in verificatie</strong>.
                    </p>
                  </div>
                )}
                {registrationType === "NONE" && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: "#FEF9EC", border: "0.5px solid #F3D569" }}>
                    <span className="mt-0.5">⚠️</span>
                    <p className="text-xs leading-[1.65]" style={{ color: "#7C6205" }}>
                      Sommige diensten vereisen een beroepsregistratie. Zonder registratie kun je je alleen aanmelden voor ongeregistreerde functies.
                    </p>
                  </div>
                )}
              </div>
              );
            })()}

            {/* ──── WORKER STEP 4: Financieel ──── */}
            {role === "WORKER" && step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Financiële gegevens</h2>
                  <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>Stel je tarief in en koppel je betaalgegevens voor automatische uitbetaling binnen 48 uur.</p>
                </div>

                <div className="rounded-xl p-5" style={{ background: "var(--teal-light)", border: "0.5px solid rgba(26,122,106,0.2)" }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: "var(--dark)" }}>Type contract</div>
                  <div className="flex gap-3">
                    {["ZZP", "LOONDIENST"].map((t) => (
                      <button key={t} type="button" onClick={() => setContractType(t)}
                        className="px-5 py-2 rounded-[40px] text-sm font-semibold cursor-pointer"
                        style={{
                          background: contractType === t ? "var(--teal)" : "#fff",
                          color: contractType === t ? "#fff" : "var(--teal)",
                          border: "1.5px solid var(--teal)",
                          fontFamily: "inherit",
                        }}>
                        {t === "ZZP" ? "ZZP'er" : "Loondienst"}
                      </button>
                    ))}
                  </div>
                </div>

                {contractType === "ZZP" && (
                  <div className="space-y-3">
                    <div>
                      <Field label="KvK-nummer">
                        <input type="text" value={kvkNumber}
                          onChange={e => { setKvkNumber(e.target.value); lookupKvk(e.target.value); }}
                          placeholder="8-cijferig nummer" />
                      </Field>
                      {kvkLookup.loading && <p className="text-xs mt-1.5" style={{ color: "var(--teal)" }}>Zoeken in KvK-register…</p>}
                      {!kvkLookup.loading && kvkLookup.companyName && (
                        <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold" style={{ color: "#166534" }}>
                          ✓ {kvkLookup.companyName}{kvkLookup.legalForm ? ` (${kvkLookup.legalForm})` : ""}
                        </div>
                      )}
                      {!kvkLookup.loading && kvkLookup.error && (
                        <p className="text-xs mt-1.5" style={{ color: "#991B1B" }}>{kvkLookup.error}</p>
                      )}
                    </div>
                    <Field label="Handelsnaam">
                      <input type="text" value={kvkCompanyName} onChange={e => setKvkCompanyName(e.target.value)}
                        placeholder="Automatisch ingevuld na KvK-opzoeking" />
                    </Field>
                  </div>
                )}

                <Field label="Gewenst uurtarief (€)">
                  <input type="number" min="35" max="150" step="0.50" value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)} placeholder="35.00" />
                </Field>

                <div className="rounded-xl p-6 text-center" style={{ background: "var(--teal-light)", border: "1.5px dashed var(--teal)" }}>
                  <div className="text-3xl mb-2">🏦</div>
                  <div className="text-base font-semibold mb-1" style={{ color: "var(--dark)" }}>Bankrekening koppelen</div>
                  <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Voor automatische uitbetalingen via Stripe Connect. Je kunt dit ook later doen vanuit je dashboard.</p>
                  <button type="button" disabled
                    className="px-6 py-2.5 rounded-[40px] text-sm font-semibold"
                    style={{ background: "var(--teal)", color: "#fff", border: "none", opacity: 0.5, cursor: "not-allowed", fontFamily: "inherit" }}>
                    Bankrekening koppelen (binnenkort)
                  </button>
                </div>
              </div>
            )}

            {/* ──── EMPLOYER STEPS ──── */}
            {role === "EMPLOYER" && step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Organisatiegegevens</h2>
                <Field label="Beschrijving">
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                    placeholder="Beschrijf je zorginstelling, specialisaties en werkcultuur…" />
                </Field>
                <Field label="Website (optioneel)">
                  <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.uwinstelling.nl" />
                </Field>
                <Field label="Adres">
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Zorgstraat 1" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Postcode">
                    <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="1234 AB" />
                  </Field>
                  <Field label="Stad">
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Utrecht" />
                  </Field>
                </div>
              </div>
            )}

            {role === "EMPLOYER" && step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Logo uploaden</h2>
                <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Je logo verschijnt op je vacatures. JPG, PNG of SVG, max 2MB.</p>
                <UploadPlaceholder label="Organisatielogo" />
              </div>
            )}

            {role === "EMPLOYER" && step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>KvK-verificatie</h2>
                <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>We halen je bedrijfsnaam automatisch op uit het KvK-register.</p>
                <div>
                  <Field label="KvK-nummer" required>
                    <input type="text" required value={kvkNumber}
                      onChange={e => { setKvkNumber(e.target.value); lookupKvk(e.target.value); }}
                      placeholder="8-cijferig nummer" />
                  </Field>
                  {kvkLookup.loading && <p className="text-xs mt-1.5" style={{ color: "var(--teal)" }}>Zoeken in KvK-register…</p>}
                  {!kvkLookup.loading && kvkLookup.companyName && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
                      ✓ {kvkLookup.companyName}{kvkLookup.legalForm ? ` — ${kvkLookup.legalForm}` : ""}
                    </div>
                  )}
                  {!kvkLookup.loading && kvkLookup.error && (
                    <p className="text-xs mt-1.5" style={{ color: "#991B1B" }}>{kvkLookup.error}</p>
                  )}
                </div>
              </div>
            )}

            {role === "EMPLOYER" && step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>Factuurgegevens</h2>
                <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Facturen worden automatisch aangemaakt na afgeronde diensten.</p>
                <div className="rounded-xl p-8 text-center" style={{ background: "var(--teal-light)", border: "1.5px dashed var(--teal)" }}>
                  <div className="text-3xl mb-3">📄</div>
                  <div className="text-base font-semibold mb-1" style={{ color: "var(--dark)" }}>Automatische facturatie</div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Je kunt factuurgegevens later instellen in je profiel.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              <div>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="text-sm font-semibold cursor-pointer"
                    style={{ color: "var(--teal)", background: "none", border: "none", fontFamily: "inherit" }}>
                    ← Vorige
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={skip}
                  className="text-sm font-semibold cursor-pointer"
                  style={{ color: "var(--muted)", background: "none", border: "none", fontFamily: "inherit" }}>
                  Overslaan
                </button>
                <button type="submit" disabled={loading}
                  className="px-7 py-3 rounded-[40px] text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
                  style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
                  {loading ? "Opslaan…" : step === 4 ? "Klaar! Naar dashboard →" : "Volgende →"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── STRIPE IDENTITY STEP ──────────────────────────────────────
function StripeIdentityStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startVerification() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/stripe/identity", { method: "POST" });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data.error ?? "Kon verificatie niet starten.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Identiteitsverificatie
        </h2>
        <p className="text-sm leading-[1.7]" style={{ color: "var(--muted)" }}>
          We verifiëren je identiteit via Stripe Identity — veilig, snel en voldoet aan AVG-wetgeving.
        </p>
      </div>

      {/* What happens */}
      <div className="space-y-3">
        {[
          { icon: "📷", title: "Foto van je ID", desc: "Maak een foto van je paspoort, rijbewijs of ID-kaart." },
          { icon: "🤳", title: "Selfie met liveness check", desc: "Een korte selfie om te bevestigen dat jij het bent." },
          { icon: "⚡", title: "Resultaat binnen 2 minuten", desc: "Stripe verifieert automatisch en geeft direct een resultaat." },
        ].map(s => (
          <div key={s.title} className="flex items-start gap-4 p-4 rounded-xl bg-white"
            style={{ border: "0.5px solid var(--border)" }}>
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div>
              <div className="text-[13px] font-bold mb-0.5" style={{ color: "var(--dark)" }}>{s.title}</div>
              <p className="text-[12px] leading-[1.5]" style={{ color: "var(--muted)" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: "rgba(26,122,106,0.07)", border: "0.5px solid rgba(26,122,106,0.2)" }}>
        <span className="mt-0.5 text-base">🔒</span>
        <p className="text-[12px] leading-[1.65]" style={{ color: "var(--teal)" }}>
          Je documenten worden <strong>nooit</strong> gedeeld met zorginstellingen. Ze worden uitsluitend gebruikt voor éénmalige identiteitsverificatie en daarna versleuteld opgeslagen door Stripe.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={startVerification}
        disabled={loading}
        className="w-full py-4 rounded-[40px] text-[15px] font-bold text-white disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3"
        style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verificatie starten…
          </>
        ) : (
          <>
            Identiteit verifiëren via Stripe →
          </>
        )}
      </button>

      <p className="text-center text-[12px]" style={{ color: "var(--muted)" }}>
        Aangedreven door{" "}
        <span className="font-semibold" style={{ color: "var(--dark)" }}>Stripe Identity</span>
        {" "}· Voldoet aan AVG & eIDAS
      </p>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactElement; required?: boolean }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
        {label}{required && <span style={{ color: "var(--teal)" }}> *</span>}
      </label>
      {React.cloneElement(children, {
        className: "w-full px-4 py-3 rounded-xl text-sm outline-none bg-white resize-none",
        style: { border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" },
      } as any)}
    </div>
  );
}

function UploadPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl p-8 text-center cursor-pointer hover:opacity-80 transition-opacity"
      style={{ background: "var(--teal-light)", border: "1.5px dashed var(--teal)" }}>
      <div className="text-3xl mb-2">📎</div>
      <div className="text-sm font-semibold" style={{ color: "var(--teal)" }}>{label}</div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Klik om te uploaden of sleep hierheen</div>
    </div>
  );
}
