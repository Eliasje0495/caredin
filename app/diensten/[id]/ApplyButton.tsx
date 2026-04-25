"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  shiftId: string;
  applicationStatus: string | null;
  shiftStatus: string;
  isLoggedIn: boolean;
}

export default function ApplyButton({ shiftId, applicationStatus, shiftStatus, isLoggedIn }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (shiftStatus !== "OPEN" && applicationStatus === null) {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--muted)" }}>
        Dienst niet meer beschikbaar
      </div>
    );
  }

  async function handleWithdraw() {
    const confirmed = window.confirm("Weet je zeker dat je je aanmelding wilt intrekken?");
    if (!confirmed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/shifts/${shiftId}/apply`, { method: "DELETE" });
      if (res.ok) { router.refresh(); }
      else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      }
    } catch { setError("Er ging iets mis. Probeer het opnieuw."); }
    finally { setLoading(false); }
  }

  if (applicationStatus === "ACCEPTED") {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "#dcfce7", color: "#166534" }}>
        ✅ Aangemeld — je bent geaccepteerd!
      </div>
    );
  }

  if (applicationStatus === "REJECTED") {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "#fee2e2", color: "#991b1b" }}>
        ❌ Aanmelding afgewezen
      </div>
    );
  }

  if (applicationStatus === "PENDING") {
    return (
      <div className="space-y-2">
        <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
          style={{ background: "#fef9c3", color: "#854d0e" }}>
          ⏳ Aanmelding in behandeling
        </div>
        <div className="text-center">
          <button onClick={handleWithdraw} disabled={loading}
            className="text-xs underline bg-transparent border-none cursor-pointer disabled:opacity-60"
            style={{ color: "var(--muted)", fontFamily: "inherit" }}>
            {loading ? "Bezig…" : "Intrekken"}
          </button>
        </div>
        {error && <p className="text-xs text-center" style={{ color: "#dc2626" }}>{error}</p>}
      </div>
    );
  }

  if (applicationStatus === "WITHDRAWN") {
    return (
      <div className="space-y-2">
        <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
          style={{ background: "var(--teal-light)", color: "var(--muted)" }}>
          Aanmelding ingetrokken
        </div>
        {shiftStatus === "OPEN" && (
          <Link href={isLoggedIn ? `/diensten/${shiftId}/aanmelden` : `/inloggen?redirect=/diensten/${shiftId}/aanmelden`}
            className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
            style={{ background: "var(--teal)" }}>
            Opnieuw aanmelden →
          </Link>
        )}
        {error && <p className="text-xs text-center" style={{ color: "#dc2626" }}>{error}</p>}
      </div>
    );
  }

  // Default: no application yet, shift is OPEN
  if (!isLoggedIn) {
    return (
      <a href={`/inloggen?redirect=/diensten/${shiftId}/aanmelden`}
        className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
        style={{ background: "var(--teal)" }}>
        Inloggen om te aanmelden →
      </a>
    );
  }

  return (
    <Link href={`/diensten/${shiftId}/aanmelden`}
      className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
      style={{ background: "var(--teal)" }}>
      Aanmelden voor deze dienst →
    </Link>
  );
}
