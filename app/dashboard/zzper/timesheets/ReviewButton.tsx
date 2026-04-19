"use client";
import { useState } from "react";

interface Props {
  reviewedId: string;
  shiftTitle: string;
  existingRating?: number;
}

function Stars({ rating, onSelect }: { rating: number; onSelect?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          onMouseEnter={() => onSelect && setHover(i)}
          onMouseLeave={() => onSelect && setHover(0)}
          style={{
            fontSize: 28,
            color: i <= (hover || rating) ? "#F5A623" : "#D1D5DB",
            background: "none",
            border: "none",
            cursor: onSelect ? "pointer" : "default",
            padding: "0 2px",
          }}
        >★</button>
      ))}
    </div>
  );
}

export default function ReviewButton({ reviewedId, shiftTitle, existingRating }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [finalRating, setFinalRating] = useState(existingRating ?? 0);

  if (finalRating > 0) {
    return (
      <div className="flex items-center gap-1.5">
        <Stars rating={finalRating} />
        <span className="text-xs" style={{ color: "var(--muted)" }}>Jouw beoordeling</span>
      </div>
    );
  }

  async function submit() {
    if (!rating) { setError("Kies een aantal sterren."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewedId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Er ging iets mis."); return; }
      setFinalRating(rating);
      setOpen(false);
    } catch { setError("Er ging iets mis."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold px-3 py-1.5 rounded-full no-underline"
        style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none", cursor: "pointer" }}
      >
        Beoordeel →
      </button>

      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,28,26,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px", width: "100%", maxWidth: 440 }}>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 700, color: "var(--dark)", margin: "0 0 6px" }}>
              Hoe was je ervaring?
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 20px" }}>{shiftTitle}</p>

            <div style={{ marginBottom: 20 }}>
              <Stars rating={rating} onSelect={setRating} />
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Vertel anderen over je ervaring… (optioneel)"
              rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
            />

            {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={submit}
                disabled={loading}
                style={{ flex: 1, padding: "12px 0", borderRadius: 40, background: "var(--teal)", color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Versturen…" : "Verstuur beoordeling"}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ padding: "12px 20px", borderRadius: 40, background: "transparent", color: "var(--muted)", fontWeight: 600, fontSize: 14, border: "1.5px solid var(--border)", cursor: "pointer" }}
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
