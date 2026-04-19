"use client";
import { useState } from "react";
import Link from "next/link";

export default function WachtwoordVergetenPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/wachtwoord-vergeten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Er ging iets mis."); }
    else setDone(true);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="px-12 py-5" style={{ background: "var(--dark)" }}>
        <Link href="/" className="no-underline">
          <span className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>Caredin</span>
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center pt-16 px-8">
        <div className="w-full max-w-md">
          <h1 className="text-[34px] font-bold tracking-[-0.5px] mb-2"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Wachtwoord vergeten
          </h1>

          {done ? (
            <div className="rounded-xl p-5 mt-4" style={{ background: "var(--teal-light)", border: "0.5px solid var(--teal)" }}>
              <div className="text-sm font-semibold mb-1" style={{ color: "var(--teal)" }}>E-mail verstuurd</div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een resetlink.
              </p>
              <Link href="/inloggen" className="block mt-4 text-sm font-semibold no-underline" style={{ color: "var(--teal)" }}>
                ← Terug naar inloggen
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
                Vul je e-mailadres in. Je ontvangt een link om je wachtwoord opnieuw in te stellen.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>E-mailadres</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                    style={{ border: "1px solid var(--border)", fontFamily: "inherit" }} />
                </div>
                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-[40px] text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
                  style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
                  {loading ? "Versturen…" : "Resetlink versturen →"}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/inloggen" className="text-sm no-underline" style={{ color: "var(--muted)" }}>← Terug naar inloggen</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
