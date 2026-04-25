"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function RegistrerenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rolParam = searchParams.get("rol") as "freeflexer" | "bedrijf" | null;

  // Rol picker
  if (!rolParam) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
        <header className="px-12 py-5" style={{ background: "var(--dark)" }}>
          <Link href="/" className="no-underline text-[22px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
            Care<span style={{ color: "rgba(255,255,255,0.85)" }}>din</span>
          </Link>
        </header>
        <div className="flex-1 flex items-start justify-center pt-20 px-8">
          <div className="w-full max-w-lg">
            <h1 className="text-[38px] font-bold tracking-[-0.5px] mb-2"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Aanmelden
            </h1>
            <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>Kies je rol om verder te gaan.</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/registreren?rol=freeflexer" className="no-underline">
                <div className="p-7 rounded-2xl cursor-pointer bg-white hover:shadow-md transition-shadow"
                  style={{ border: "0.5px solid var(--border)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                    style={{ background: "var(--teal-light)" }}>🩺</div>
                  <div className="text-lg font-bold mb-1.5" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                    Professional
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Zorgprofessional op zoek naar flexibele diensten.
                  </div>
                </div>
              </Link>
              <Link href="/registreren/instelling" className="no-underline">
                <div className="p-7 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                  style={{ background: "var(--dark)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                    style={{ background: "rgba(255,255,255,0.1)" }}>🏥</div>
                  <div className="text-lg font-bold mb-1.5 text-white" style={{ fontFamily: "var(--font-fraunces)" }}>
                    Zorginstelling
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Organisatie die geverifieerd zorgpersoneel zoekt.
                  </div>
                </div>
              </Link>
            </div>
            <p className="mt-8 text-sm text-center" style={{ color: "var(--muted)" }}>
              Al een account?{" "}
              <Link href="/inloggen" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Inloggen →</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return rolParam === "bedrijf"
    ? <BedrijfForm />
    : <ProfessionalForm />;
}

// ─── BEDRIJF FORM ─────────────────────────────────────────────
function BedrijfForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = await fetch("/api/auth/registreren", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, rol: "bedrijf", companyName }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Er ging iets mis."); setLoading(false); return; }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard/onboarding");
  }

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      {/* Cross-link banner */}
      <div className="px-12 py-3 flex items-center gap-3"
        style={{ background: "var(--teal-light)", borderBottom: "0.5px solid rgba(26,122,106,0.15)" }}>
        <span className="text-sm" style={{ color: "var(--muted)" }}>Op zoek naar werk?</span>
        <Link href="/registreren?rol=freeflexer"
          className="text-sm font-semibold no-underline underline"
          style={{ color: "var(--teal)" }}>
          Meld je aan als professional
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-44px)]">
        {/* Left: Form */}
        <div className="flex-1 px-12 py-14 max-w-xl">
          <Link href="/" className="no-underline text-[20px] font-bold tracking-[-0.5px] block mb-10"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
            Care<span style={{ color: "var(--dark)" }}>din</span>
          </Link>

          <h1 className="text-[34px] font-bold tracking-[-0.5px] leading-[1.1] mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Plaats je eerste dienst in 5 minuten.
          </h1>
          <p className="text-sm mb-8 leading-[1.7]" style={{ color: "var(--muted)" }}>
            Meld je aan bij CaredIn, vergelijk geverifieerde zorgprofessionals en vul je diensten — zonder bureau, zonder marge.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bedrijfsnaam */}
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Instellingsnaam <span style={{ color: "var(--teal)" }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>🔍</span>
                <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="Naam instelling of organisatie"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>
            </div>

            {/* Naam */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Voornaam <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="Peter"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Achternaam <span style={{ color: "var(--teal)" }}>*</span>
                </label>
                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="de Wit"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Zakelijk e-mailadres <span style={{ color: "var(--teal)" }}>*</span>
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="mijnnaam@domein.nl"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
            </div>

            {/* Wachtwoord */}
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Wachtwoord <span style={{ color: "var(--teal)" }}>*</span>
              </label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required minLength={8}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white pr-12"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                  style={{ color: "var(--muted)", background: "none", border: "none", fontFamily: "inherit" }}>
                  {showPass ? "Verberg" : "Toon"}
                </button>
              </div>
            </div>

            {/* Marketing */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 rounded cursor-pointer"
                style={{ accentColor: "var(--teal)" }} />
              <span className="text-sm leading-[1.6]" style={{ color: "var(--muted)" }}>
                Ik geef CaredIn toestemming om mij via e-mail op de hoogte te houden van relevante updates en ontwikkelingen. Ik kan me hiervoor altijd uitschrijven.
              </span>
            </label>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-[40px] text-[15px] font-bold text-white disabled:opacity-60 cursor-pointer mt-2"
              style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
              {loading ? "Aanmelden…" : "Mijn instelling aanmelden →"}
            </button>

            <p className="text-xs text-center leading-[1.6]" style={{ color: "var(--muted)" }}>
              Door je aan te melden ga je akkoord met onze{" "}
              <Link href="/voorwaarden" className="no-underline underline" style={{ color: "var(--teal)" }}>gebruikersvoorwaarden</Link>
              {" "}en{" "}
              <Link href="/privacy" className="no-underline underline" style={{ color: "var(--teal)" }}>privacybeleid</Link>.
            </p>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: "var(--muted)" }}>
            Al een account?{" "}
            <Link href="/inloggen" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Inloggen →</Link>
          </p>
          <p className="mt-3 text-sm text-center" style={{ color: "var(--muted)" }}>
            Zorginstelling?{" "}
            <Link href="/registreren/instelling" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Registreer hier →</Link>
          </p>
        </div>

        {/* Right: dark panel */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-14"
          style={{ background: "var(--dark)" }}>
          <div className="text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
            Care<span style={{ color: "rgba(255,255,255,0.7)" }}>din</span>
          </div>
          <div>
            <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(93,184,164,0.12) 0%, transparent 70%)" }} />
            <blockquote className="text-[22px] font-bold leading-[1.3] mb-6"
              style={{ fontFamily: "var(--font-fraunces)", color: "#fff" }}>
              &quot;Binnen 2 uur na het plaatsen van onze eerste dienst hadden we al drie aanmeldingen van geverifieerde professionals.&quot;
            </blockquote>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Hoofd Planning · Zorginstelling Amsterdam
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { num: "4.200+", lab: "Professionals" },
                { num: "€3,–",  lab: "Per uur" },
                { num: "< 2 min", lab: "Dienst plaatsen" },
              ].map(s => (
                <div key={s.lab} className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-[24px] font-bold text-white mb-0.5"
                    style={{ fontFamily: "var(--font-fraunces)" }}>{s.num}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.lab}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFESSIONAL FORM ────────────────────────────────────────
function ProfessionalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") ?? "";
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const pwStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const pwColors = ["transparent", "#EF4444", "#F59E0B", "var(--teal)"];
  const pwLabels = ["", "Te kort", "Redelijk", "Sterk"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const res = await fetch("/api/auth/registreren", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, rol: "freeflexer", ...(refCode ? { referralCode: refCode } : {}) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Er ging iets mis."); setLoading(false); return; }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard/onboarding");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#fff" }}>
      {/* ── LEFT: Form ── */}
      <div className="flex flex-col w-full lg:max-w-[520px] px-10 py-10 xl:px-14 xl:py-12">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="no-underline text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
            Care<span style={{ color: "var(--dark)" }}>din</span>
          </Link>
          <Link href="/registreren/instelling"
            className="text-[12px] font-semibold no-underline px-3.5 py-1.5 rounded-[40px]"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
            Zorginstelling? →
          </Link>
        </div>

        {/* Step badge */}
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full mb-6 text-[11px] font-bold uppercase tracking-[0.8px]"
          style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
          Stap 1 van 4 · Account aanmaken
        </div>

        <h1 className="text-[38px] font-bold tracking-[-1.5px] leading-[1.05] mb-3"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Jouw zorg.<br />Jouw schema.<br />Jouw tarief.
        </h1>
        <p className="text-sm mb-8 leading-[1.75]" style={{ color: "var(--muted)", maxWidth: "380px" }}>
          Gratis aanmelden. Geen bureau ertussen. Kies zelf je diensten en word binnen 48 uur uitbetaald.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Name row */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>Voornaam</label>
                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="Fatima"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
                  style={{ color: "var(--muted)" }}>Achternaam</label>
                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="El-Amin"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
            </div>
            <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg"
              style={{ background: "var(--teal-light)", border: "1px solid rgba(26,122,106,0.15)" }}>
              <span className="text-[13px] flex-shrink-0 mt-px">🪪</span>
              <p className="text-[11px] leading-[1.6]" style={{ color: "var(--teal)" }}>
                Vul je naam in <strong>exact zoals op je ID-bewijs</strong> — dit is vereist voor verificatie van je BIG-, SKJ- of andere beroepsregistraties.
              </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
              style={{ color: "var(--muted)" }}>E-mailadres</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white transition-all"
              style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
          </div>

          {/* Password with strength meter */}
          <div>
            <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.5px]"
              style={{ color: "var(--muted)" }}>Wachtwoord</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} required minLength={8}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none bg-white pr-16 transition-all"
                style={{ border: "1.5px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold cursor-pointer"
                style={{ color: "var(--teal)", background: "none", border: "none", fontFamily: "inherit" }}>
                {showPass ? "Verberg" : "Toon"}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1 flex-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                      style={{ background: pwStrength >= i ? pwColors[pwStrength] : "var(--border)" }} />
                  ))}
                </div>
                <span className="text-[11px] font-semibold" style={{ color: pwColors[pwStrength] }}>
                  {pwLabels[pwStrength]}
                </span>
              </div>
            )}
          </div>

          {/* Marketing */}
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0 rounded cursor-pointer"
              style={{ accentColor: "var(--teal)" }} />
            <span className="text-[12px] leading-[1.6]" style={{ color: "var(--muted)" }}>
              Houd mij op de hoogte van nieuwe diensten en updates via e-mail.
            </span>
          </label>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-[40px] text-[15px] font-bold text-white disabled:opacity-60 cursor-pointer"
            style={{ background: "var(--teal)", fontFamily: "inherit", border: "none", marginTop: "8px" }}>
            {loading ? "Account aanmaken…" : "Account aanmaken →"}
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-5 pt-1">
            {["🔒 Gratis", "✅ geverifieerd", "⚡ 48u uitbetaling"].map(t => (
              <span key={t} className="text-[11px]" style={{ color: "var(--muted)" }}>{t}</span>
            ))}
          </div>

          <p className="text-[11px] text-center leading-[1.7]" style={{ color: "var(--muted)" }}>
            Door je aan te melden ga je akkoord met onze{" "}
            <Link href="/voorwaarden" className="no-underline underline" style={{ color: "var(--teal)" }}>voorwaarden</Link>
            {" "}en{" "}
            <Link href="/privacy" className="no-underline underline" style={{ color: "var(--teal)" }}>privacybeleid</Link>.
          </p>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: "var(--muted)" }}>
          Al een account?{" "}
          <Link href="/inloggen" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Inloggen →</Link>
        </p>
        <p className="mt-3 text-sm text-center" style={{ color: "var(--muted)" }}>
          Zorginstelling?{" "}
          <Link href="/registreren/instelling" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>Registreer hier →</Link>
        </p>
      </div>

      {/* ── RIGHT: Dark panel ── */}
      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden"
        style={{ background: "var(--dark)" }}>

        {/* Ambient glow */}
        <div className="absolute top-[-120px] right-[-120px] w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.15) 0%, transparent 65%)" }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(93,184,164,0.08) 0%, transparent 65%)" }} />

        <div className="relative flex flex-col h-full px-14 py-12 justify-between">
          {/* Logo */}
          <div className="text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
            Care<span style={{ color: "rgba(255,255,255,0.7)" }}>din</span>
          </div>

          {/* Main content */}
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[1.2px] mb-6"
              style={{ color: "var(--teal-mid)" }}>
              Hoe het werkt
            </div>

            {/* Journey steps */}
            <div className="space-y-0 mb-10">
              {[
                { n: "1", title: "Account aanmaken", desc: "Naam, e-mail, wachtwoord — klaar in 60 seconden.", active: true },
                { n: "2", title: "Registraties uploaden", desc: "Verificatie duurt gemiddeld 2 werkuren.", active: false },
                { n: "3", title: "Diensten ontdekken", desc: "Filter op locatie, specialisme en tarief.", active: false },
                { n: "4", title: "Uitbetaling binnen 48u", desc: "Direct op je rekening, geen bureau ertussen.", active: false },
              ].map((step, i, arr) => (
                <div key={step.n} className="flex gap-4">
                  {/* Connector line */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                      style={{
                        background: step.active ? "var(--teal)" : "rgba(255,255,255,0.08)",
                        color: step.active ? "#fff" : "rgba(255,255,255,0.3)",
                        border: step.active ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}>
                      {step.n}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="text-[15px] font-bold leading-[1.2] mb-1"
                      style={{ color: step.active ? "#fff" : "rgba(255,255,255,0.45)" }}>
                      {step.title}
                    </div>
                    <div className="text-[12px] leading-[1.6]"
                      style={{ color: step.active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)" }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Quote */}
            <blockquote className="text-[18px] font-bold leading-[1.35] mb-3"
              style={{ fontFamily: "var(--font-fraunces)", color: "#fff" }}>
              &quot;Ik werk nu al drie maanden via CaredIn. Ik kies zelf mijn diensten en word binnen 48 uur uitbetaald.&quot;
            </blockquote>
            <div className="text-[12px] flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "var(--teal)" }}>F</div>
              Fatima · Verpleegkundige IG · Rotterdam
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "4.200+", lab: "Professionals" },
              { num: "€0,–",   lab: "Bureaumarge" },
              { num: "48u",    lab: "Uitbetaling" },
            ].map(s => (
              <div key={s.lab} className="rounded-2xl px-4 py-3.5 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <div className="text-[22px] font-bold text-white mb-0.5"
                  style={{ fontFamily: "var(--font-fraunces)" }}>{s.num}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrerenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
      </div>
    }>
      <RegistrerenForm />
    </Suspense>
  );
}
