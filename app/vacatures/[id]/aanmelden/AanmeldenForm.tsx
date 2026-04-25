"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Requirement {
  label: string;
  met: boolean;
  note?: string;
}

interface Props {
  shiftId: string;
  overeenkomstUrl: string;
  requirements: Requirement[];
  canApply: boolean;
  blockerMessage?: string;
  successHref?: string;
  backHref?: string;
}

export default function AanmeldenForm({
  shiftId,
  overeenkomstUrl,
  requirements,
  canApply,
  blockerMessage,
  successHref,
  backHref,
}: Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!agreed) {
      setError("Bevestig dat je de modelovereenkomst hebt gelezen.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/shifts/${shiftId}/apply`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.push(successHref ?? `/vacatures/${shiftId}?aangemeld=1`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis, probeer het opnieuw.");
    }
  }

  return (
    <div className="space-y-5">

      {/* Vereisten checklist */}
      {requirements.length > 0 && (
        <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Vereiste registraties
          </h2>
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.label} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: req.met ? "#16a34a" : "#ef4444" }}
                >
                  {req.met ? "✓" : "✗"}
                </span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--dark)" }}>{req.label}</div>
                  {req.note && (
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{req.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!canApply && blockerMessage && (
            <div className="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: "#fef2f2", color: "#dc2626", border: "0.5px solid #fca5a5" }}>
              {blockerMessage}
            </div>
          )}
        </div>
      )}

      {/* Modelovereenkomst */}
      <div className="rounded-2xl p-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
        <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Modelovereenkomst van Opdracht
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          CaredIn werkt op basis van een modelovereenkomst die is goedgekeurd door de Belastingdienst
          (nr. 90615.36558). Lees de overeenkomst zorgvuldig door voordat je je aanmeldt.
        </p>
        <a
          href={overeenkomstUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-underline"
          style={{ background: "var(--teal-light)", color: "var(--teal)", border: "0.5px solid var(--teal)" }}
        >
          <span>📄</span>
          Modelovereenkomst bekijken & downloaden →
        </a>

        {/* Checkbox */}
        <label className="flex items-start gap-3 mt-5 cursor-pointer select-none">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: "var(--teal)" }}
            />
          </div>
          <span className="text-sm leading-relaxed" style={{ color: "var(--dark)" }}>
            Ik heb de modelovereenkomst gelezen en ga akkoord met de voorwaarden van CaredIn.
            Ik bevestig dat ik als zelfstandige (ZZP) werk en geen gezagsverhouding aanvaard.
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#dc2626" }}>
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          href={backHref ?? `/vacatures/${shiftId}`}
          className="flex-1 py-3 rounded-[40px] text-[14px] font-semibold text-center no-underline"
          style={{ background: "var(--teal-light)", color: "var(--muted)" }}
        >
          Annuleren
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading || !canApply}
          className="flex-1 py-3 rounded-[40px] text-[14px] font-semibold text-white cursor-pointer disabled:opacity-50"
          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}
        >
          {loading ? "Bezig…" : "Aanmelden voor deze dienst →"}
        </button>
      </div>
    </div>
  );
}
