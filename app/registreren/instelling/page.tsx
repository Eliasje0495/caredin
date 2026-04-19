"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SECTOR_OPTIONS = [
  { value: "VVT",              label: "Ouderenzorg (VVT)" },
  { value: "GGZ",              label: "GGZ" },
  { value: "ZIEKENHUIS",       label: "Ziekenhuis" },
  { value: "JEUGDZORG",        label: "Jeugdzorg" },
  { value: "THUISZORG",        label: "Thuiszorg" },
  { value: "GEHANDICAPTENZORG",label: "Gehandicaptenzorg" },
  { value: "HUISARTSENZORG",   label: "Huisartsenzorg" },
  { value: "KRAAMZORG",        label: "Kraamzorg" },
  { value: "REVALIDATIE",      label: "Revalidatie" },
  { value: "OVERIG",           label: "Overig" },
];

export default function InstellingRegistrerenPage() {
  const router = useRouter();

  // Step state
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]     = useState("");
  const [email,       setEmail]        = useState("");
  const [password,    setPassword]     = useState("");
  const [repeatPass,  setRepeatPass]   = useState("");
  const [companyName, setCompanyName]  = useState("");
  const [kvkNumber,   setKvkNumber]    = useState("");
  const [phone,       setPhone]        = useState("");
  const [showPass,    setShowPass]     = useState(false);
  const [showRepeat,  setShowRepeat]   = useState(false);

  // Step 2 fields
  const [sector,     setSector]     = useState("");
  const [address,    setAddress]    = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city,       setCity]       = useState("");

  // UI state
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1 validation → advance to step 2
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }
    if (password !== repeatPass) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    setActiveStep(2);
  }

  // ── Step 2 submit → API → redirect
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const res = await fetch("/api/auth/registreren/instelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
          kvkNumber,
          phone,
          sector,
          address,
          postalCode,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setLoading(false);
        return;
      }

      await signIn("credentials", { email, password, redirect: false });
      router.push("/dashboard/onboarding");
    } catch {
      setError("Er ging iets mis. Controleer je verbinding en probeer opnieuw.");
      setLoading(false);
    }
  }

  // ── Shared input focus/blur handlers
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--teal)";
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#fff" }}>

      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col w-full lg:max-w-[520px] xl:max-w-[560px] px-10 py-10 xl:px-14 xl:py-12 flex-shrink-0">

        {/* Logo + top bar */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="no-underline text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}
          >
            Care<span style={{ color: "var(--dark)" }}>din</span>
          </Link>
          <Link
            href="/registreren?rol=freeflexer"
            className="text-[12px] font-semibold no-underline px-3.5 py-1.5 rounded-[40px]"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Professional? →
          </Link>
        </div>

        {/* Step badge */}
        <div
          className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full mb-6 text-[11px] font-bold uppercase tracking-[0.8px]"
          style={{ background: "var(--teal-light)", color: "var(--teal)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
          Registreer als zorginstelling
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all"
                style={{
                  background: activeStep >= n ? "var(--teal)" : "#fff",
                  border: `2px solid ${activeStep >= n ? "var(--teal)" : "var(--border)"}`,
                  color: activeStep >= n ? "#fff" : "var(--muted)",
                }}
              >
                {activeStep > n ? "✓" : n}
              </div>
              <span
                className="text-[12px] font-semibold hidden sm:block"
                style={{ color: activeStep >= n ? "var(--dark)" : "var(--muted)" }}
              >
                {n === 1 ? "Account" : "Locatie & sector"}
              </span>
              {n < 2 && (
                <div
                  className="w-8 h-px mx-1"
                  style={{ background: activeStep > n ? "var(--teal)" : "var(--border)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ─── STEP 1 FORM ─── */}
        {activeStep === 1 && (
          <>
            <h1
              className="text-[34px] font-bold tracking-[-1.2px] leading-[1.05] mb-3"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Uw instelling aanmelden.
            </h1>
            <p className="text-sm mb-7 leading-[1.75]" style={{ color: "var(--muted)", maxWidth: "400px" }}>
              Maak een gratis account aan en vind geverifieerde zorgprofessionals — zonder bureau, zonder marge.
            </p>

            <form onSubmit={handleStep1} className="space-y-4 flex-1">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Voornaam <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="text" required value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jan"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Achternaam <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="text" required value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="de Vries"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Company name */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Instellingsnaam <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <input
                  type="text" required value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Zorggroep Noord B.V."
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>

              {/* KvK + Phone row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    KvK-nummer <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="text" required value={kvkNumber}
                    onChange={e => setKvkNumber(e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Telefoonnummer <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="tel" required value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Zakelijk e-mailadres <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="naam@instelling.nl"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Wachtwoord <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} required minLength={8}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Minimaal 8 tekens"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white pr-16 transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold cursor-pointer"
                    style={{ color: "var(--teal)", background: "none", border: "none", fontFamily: "inherit" }}
                  >
                    {showPass ? "Verberg" : "Toon"}
                  </button>
                </div>
              </div>

              {/* Repeat password */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Herhaal wachtwoord <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRepeat ? "text" : "password"} required minLength={8}
                    value={repeatPass} onChange={e => setRepeatPass(e.target.value)}
                    placeholder="Herhaal je wachtwoord"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white pr-16 transition-all"
                    style={{
                      border: `1.5px solid ${repeatPass && repeatPass !== password ? "#EF4444" : "var(--border)"}`,
                      fontFamily: "inherit",
                      color: "var(--text)",
                    }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                  <button
                    type="button" onClick={() => setShowRepeat(!showRepeat)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold cursor-pointer"
                    style={{ color: "var(--teal)", background: "none", border: "none", fontFamily: "inherit" }}
                  >
                    {showRepeat ? "Verberg" : "Toon"}
                  </button>
                </div>
                {repeatPass && repeatPass !== password && (
                  <p className="text-[11px] mt-1" style={{ color: "#EF4444" }}>Wachtwoorden komen niet overeen.</p>
                )}
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-[40px] text-[15px] font-bold text-white cursor-pointer mt-2"
                style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}
              >
                Volgende stap →
              </button>

              <p className="text-[11px] text-center leading-[1.7]" style={{ color: "var(--muted)" }}>
                Door je aan te melden ga je akkoord met onze{" "}
                <Link href="/voorwaarden" className="no-underline underline" style={{ color: "var(--teal)" }}>
                  gebruikersvoorwaarden
                </Link>{" "}en{" "}
                <Link href="/privacy" className="no-underline underline" style={{ color: "var(--teal)" }}>
                  privacybeleid
                </Link>.
              </p>
            </form>
          </>
        )}

        {/* ─── STEP 2 FORM ─── */}
        {activeStep === 2 && (
          <>
            <h1
              className="text-[34px] font-bold tracking-[-1.2px] leading-[1.05] mb-3"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}
            >
              Locatie & sector
            </h1>
            <p className="text-sm mb-7 leading-[1.75]" style={{ color: "var(--muted)", maxWidth: "400px" }}>
              Vertel ons in welke sector uw instelling actief is en waar u gevestigd bent.
            </p>

            <form onSubmit={handleStep2} className="space-y-4 flex-1">

              {/* Sector */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Sector <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <select
                  required value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all appearance-none cursor-pointer"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: sector ? "var(--text)" : "var(--muted)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                >
                  <option value="" disabled>Kies een sector…</option>
                  {SECTOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>
                  Adres <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <input
                  type="text" required value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Voorbeeldstraat 12"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>

              {/* Postal + City row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Postcode <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="text" required value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="1234 AB"
                    maxLength={7}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                    style={{ color: "var(--muted)" }}>
                    Stad <span style={{ color: "var(--teal)" }}>*</span>
                  </label>
                  <input
                    type="text" required value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Amsterdam"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                    style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                  {error}
                </div>
              )}

              {/* Back + Submit buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveStep(1); setError(""); }}
                  className="flex-shrink-0 px-6 py-4 rounded-[40px] text-[14px] font-semibold cursor-pointer"
                  style={{ border: "1.5px solid var(--border)", color: "var(--muted)", background: "none", fontFamily: "inherit" }}
                >
                  ← Terug
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 py-4 rounded-[40px] text-[15px] font-bold text-white disabled:opacity-60 cursor-pointer"
                  style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}
                >
                  {loading ? "Account aanmaken…" : "Account aanmaken →"}
                </button>
              </div>

              <p className="text-[11px] text-center leading-[1.7]" style={{ color: "var(--muted)" }}>
                Door je aan te melden ga je akkoord met onze{" "}
                <Link href="/voorwaarden" className="no-underline underline" style={{ color: "var(--teal)" }}>
                  gebruikersvoorwaarden
                </Link>{" "}en{" "}
                <Link href="/privacy" className="no-underline underline" style={{ color: "var(--teal)" }}>
                  privacybeleid
                </Link>.
              </p>
            </form>
          </>
        )}

        {/* Al een account */}
        <p className="mt-6 text-sm text-center" style={{ color: "var(--muted)" }}>
          Al een account?{" "}
          <Link href="/inloggen" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>
            Inloggen →
          </Link>
        </p>
      </div>

      {/* ── RIGHT PANEL (dark) ── */}
      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden" style={{ background: "var(--dark)" }}>

        {/* Ambient glows */}
        <div
          className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 65%)" }}
        />

        <div className="relative flex flex-col h-full px-14 py-12 justify-between">

          {/* Logo */}
          <div
            className="text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}
          >
            Care<span style={{ color: "rgba(255,255,255,0.7)" }}>din</span>
          </div>

          {/* Main headline */}
          <div>
            <h2
              className="text-[40px] font-bold leading-[1.1] mb-8"
              style={{ fontFamily: "var(--font-fraunces)", color: "#fff" }}
            >
              Vind de juiste<br />
              <em className="not-italic" style={{ color: "var(--teal-mid)" }}>professional.</em>
              <br />
              Direct beschikbaar.
            </h2>

            {/* Trust points */}
            <div className="space-y-4 mb-10">
              {[
                { icon: "🏥", text: "Geverifieerde ZZP'ers — BIG & SKJ gecheckt" },
                { icon: "⚡", text: "Binnen 24u geplaatst — gemiddeld 3 aanmeldingen per dienst" },
                { icon: "💰", text: "Geen bemiddelingskosten — slechts €3,– per gewerkt uur" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "rgba(93,184,164,0.12)", border: "0.5px solid rgba(93,184,164,0.2)" }}
                  >
                    {item.icon}
                  </div>
                  <p className="text-[14px] leading-[1.55] pt-1.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Quote */}
            <blockquote
              className="text-[18px] font-bold leading-[1.35] mb-3"
              style={{ fontFamily: "var(--font-fraunces)", color: "#fff" }}
            >
              &quot;Binnen 2 uur na het plaatsen van onze eerste dienst hadden we al drie aanmeldingen van geverifieerde professionals.&quot;
            </blockquote>
            <div className="flex items-center gap-2 text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "var(--teal)" }}
              >
                M
              </div>
              Marieke · Hoofd Planning · Zorginstelling Amsterdam
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "4.200+", lab: "Professionals" },
              { num: "€3,–",  lab: "Per uur platform" },
              { num: "< 2 min", lab: "Dienst plaatsen" },
            ].map((s) => (
              <div
                key={s.lab}
                className="rounded-2xl px-4 py-3.5 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="text-[22px] font-bold text-white mb-0.5"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {s.num}
                </div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
