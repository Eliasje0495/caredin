"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Wachtwoorden komen niet overeen."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/wachtwoord-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Er ging iets mis."); }
    else router.push("/inloggen?reset=success");
  }

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>Ongeldige resetlink.</p>
        <Link href="/wachtwoord-vergeten" className="text-sm font-semibold no-underline mt-4 block" style={{ color: "var(--teal)" }}>
          Nieuwe link aanvragen →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Nieuw wachtwoord</label>
        <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Minimaal 8 tekens"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
          style={{ border: "1px solid var(--border)", fontFamily: "inherit" }} />
      </div>
      <div>
        <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Bevestig wachtwoord</label>
        <input type="password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Herhaal wachtwoord"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
          style={{ border: "1px solid var(--border)", fontFamily: "inherit" }} />
      </div>
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>{error}</div>
      )}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-[40px] text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
        style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
        {loading ? "Opslaan…" : "Wachtwoord opslaan →"}
      </button>
    </form>
  );
}

export default function WachtwoordResetPage() {
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
            Nieuw wachtwoord
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Kies een nieuw wachtwoord voor je account.</p>
          <Suspense fallback={<div className="text-sm" style={{ color: "var(--muted)" }}>Laden…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
