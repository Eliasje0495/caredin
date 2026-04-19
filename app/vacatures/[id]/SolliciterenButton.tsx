"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  shiftId: string;
  shiftStatus: string;
  isLoggedIn: boolean;
  hasApplied: boolean;
}

export default function SolliciterenButton({ shiftId, shiftStatus, isLoggedIn, hasApplied }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [error, setError] = useState("");

  if (shiftStatus !== "OPEN") {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--muted)" }}>
        Niet meer beschikbaar
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <a href={`/inloggen?redirect=/vacatures/${shiftId}`}
        className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
        style={{ background: "var(--teal)" }}>
        Inloggen om te solliciteren →
      </a>
    );
  }

  if (applied) {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
        ✓ Aanmelding verstuurd
      </div>
    );
  }

  async function handleApply() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/shifts/${shiftId}/apply`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setApplied(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis.");
    }
  }

  return (
    <div>
      <button onClick={handleApply} disabled={loading}
        className="w-full py-3 rounded-[40px] text-[14px] font-semibold text-white disabled:opacity-60 cursor-pointer"
        style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}>
        {loading ? "Bezig…" : "Solliciteren →"}
      </button>
      {error && <p className="text-xs mt-2 text-center" style={{ color: "#dc2626" }}>{error}</p>}
    </div>
  );
}
