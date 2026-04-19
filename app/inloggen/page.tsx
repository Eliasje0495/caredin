"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InloggenPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"password" | "magic">("password");

  // Password login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Magic link
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("E-mailadres of wachtwoord onjuist.");
    else router.push("/dashboard");
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicError("");
    setMagicLoading(true);
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: magicEmail }),
    });
    setMagicLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMagicError(d.error ?? "Er ging iets mis.");
    } else {
      setMagicSent(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-12 py-5" style={{ background: "var(--dark)", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
        <Link href="/" className="no-underline">
          <span className="text-[22px] font-bold tracking-[-0.5px]" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
            Caredin
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center pt-16 px-8">
        <div className="w-full max-w-md">
          <h1 className="text-[38px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Welkom terug
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Log in op je CaredIn account.</p>

          {/* Tab toggle */}
          <div className="flex gap-1 p-1 rounded-[40px] mb-8" style={{ background: "var(--teal-light)", border: "0.5px solid rgba(26,122,106,0.2)" }}>
            {([
              { id: "password", label: "Met wachtwoord" },
              { id: "magic",    label: "Inloglink per e-mail" },
            ] as const).map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className="flex-1 py-2 rounded-[40px] text-sm font-semibold cursor-pointer"
                style={{
                  background: tab === t.id ? "var(--teal)" : "transparent",
                  color: tab === t.id ? "#fff" : "var(--teal)",
                  border: "none",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Password login */}
          {tab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>E-mailadres</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Wachtwoord</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-[40px] text-[14px] font-semibold text-white disabled:opacity-60 cursor-pointer"
                style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
                {loading ? "Inloggen…" : "Inloggen →"}
              </button>

              <div className="pt-1 text-center">
                <Link href="/wachtwoord-vergeten" className="text-sm no-underline" style={{ color: "var(--muted)" }}>
                  Wachtwoord vergeten?
                </Link>
              </div>
            </form>
          )}

          {/* Magic link */}
          {tab === "magic" && !magicSent && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>E-mailadres</label>
                <input type="email" required value={magicEmail} onChange={(e) => setMagicEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                  style={{ border: "1px solid var(--border)", fontFamily: "inherit", color: "var(--text)" }} />
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                We sturen een link naar je e-mailadres. Klik op de link om direct in te loggen — geen wachtwoord nodig.
              </p>

              {magicError && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                  {magicError}
                </div>
              )}

              <button type="submit" disabled={magicLoading}
                className="w-full py-3.5 rounded-[40px] text-[14px] font-semibold text-white disabled:opacity-60 cursor-pointer"
                style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
                {magicLoading ? "Versturen…" : "Stuur inloglink →"}
              </button>
            </form>
          )}

          {tab === "magic" && magicSent && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl"
                style={{ background: "var(--teal-light)" }}>
                ✉️
              </div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
                Check je inbox
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                We hebben een inloglink gestuurd naar <strong>{magicEmail}</strong>. De link is 15 minuten geldig.
              </p>
              <button type="button" onClick={() => setMagicSent(false)}
                className="text-sm font-semibold bg-transparent border-none cursor-pointer p-0"
                style={{ color: "var(--teal)", fontFamily: "inherit" }}>
                Ander e-mailadres gebruiken
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Nog geen account?{" "}
              <Link href="/registreren" className="font-semibold no-underline" style={{ color: "var(--teal)" }}>
                Aanmelden →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
