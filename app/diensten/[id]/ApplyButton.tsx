"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  shiftId: string;
  applicationStatus: string | null; // PENDING, ACCEPTED, REJECTED, WITHDRAWN, or null
  shiftStatus: string;
}

export default function ApplyButton({ shiftId, applicationStatus, shiftStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shift no longer open (and no existing application)
  if (shiftStatus !== "OPEN" && applicationStatus === null) {
    return (
      <div
        className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--muted)" }}
      >
        Dienst niet meer beschikbaar
      </div>
    );
  }

  async function handleApply() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/shifts/${shiftId}/apply`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      }
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw() {
    const confirmed = window.confirm(
      "Weet je zeker dat je je aanmelding wilt intrekken?"
    );
    if (!confirmed) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/shifts/${shiftId}/apply`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      }
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  // ACCEPTED
  if (applicationStatus === "ACCEPTED") {
    return (
      <div
        className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "#dcfce7", color: "#166534" }}
      >
        ✅ Aangemeld — je bent geaccepteerd!
      </div>
    );
  }

  // REJECTED
  if (applicationStatus === "REJECTED") {
    return (
      <div
        className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "#fee2e2", color: "#991b1b" }}
      >
        ❌ Aanmelding afgewezen
      </div>
    );
  }

  // PENDING
  if (applicationStatus === "PENDING") {
    return (
      <div className="space-y-2">
        <div
          className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
          style={{ background: "#fef9c3", color: "#854d0e" }}
        >
          ⏳ Aanmelding in behandeling
        </div>
        <div className="text-center">
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="text-xs underline bg-transparent border-none cursor-pointer disabled:opacity-60"
            style={{ color: "var(--muted)", fontFamily: "inherit" }}
          >
            {loading ? "Bezig…" : "Intrekken"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-center" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // WITHDRAWN — allow re-apply if shift is still open
  if (applicationStatus === "WITHDRAWN") {
    return (
      <div className="space-y-2">
        <div
          className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
          style={{ background: "var(--teal-light)", color: "var(--muted)" }}
        >
          Aanmelding ingetrokken
        </div>
        {shiftStatus === "OPEN" && (
          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full py-3 rounded-[40px] text-[14px] font-semibold text-white disabled:opacity-60 cursor-pointer"
            style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Bezig…
              </span>
            ) : (
              "Opnieuw aanmelden →"
            )}
          </button>
        )}
        {error && (
          <p className="text-xs text-center" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // Default: no application yet, shift is OPEN
  return (
    <div className="space-y-2">
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full py-3 rounded-[40px] text-[15px] font-semibold text-white disabled:opacity-60 cursor-pointer"
        style={{ background: "var(--teal)", fontFamily: "inherit", border: "none" }}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Bezig…
          </span>
        ) : (
          "Aanmelden voor deze dienst →"
        )}
      </button>
      {error && (
        <p className="text-xs text-center" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
