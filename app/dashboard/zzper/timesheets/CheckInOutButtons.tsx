"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  shiftId:       string;
  shiftTitle:    string;
  employerName:  string;
  employerUserId?: string;
  hourlyRate:    number;
  checkedInAt:   string | null;
  checkedIn:     boolean;
  checkedOut:    boolean;
}

function Stars({ rating, onSelect }: { rating: number; onSelect?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          onMouseEnter={() => onSelect && setHover(i)}
          onMouseLeave={() => onSelect && setHover(0)}
          style={{
            fontSize: 36,
            lineHeight: 1,
            color: i <= (hover || rating) ? "#F5A623" : "#E5E7EB",
            background: "none",
            border: "none",
            cursor: onSelect ? "pointer" : "default",
            padding: "0 1px",
            transition: "color 0.1s",
          }}
        >★</button>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "Slecht",
  2: "Matig",
  3: "Oké",
  4: "Goed",
  5: "Uitstekend!",
};

const SUGGESTIONS: Record<number, string[]> = {
  5: [
    "Uitstekende begeleiding en duidelijke communicatie.",
    "Heel fijn team, kom graag terug!",
    "Alles was perfect geregeld, ik voelde me welkom.",
    "Professionele instelling met warme sfeer.",
  ],
  4: [
    "Fijne werkplek en prettige collega's.",
    "Goede organisatie, duidelijke afspraken.",
    "Prettige sfeer, kleine verbeterpuntjes.",
    "Goed ontvangen, vlotte communicatie.",
  ],
  3: [
    "Prima instelling, maar communicatie kan beter.",
    "Oké ervaring, wat meer begeleiding zou fijn zijn.",
    "Redelijk georganiseerd, ruimte voor verbetering.",
  ],
  2: [
    "Matige organisatie, onduidelijke afspraken.",
    "Weinig begeleiding gehad tijdens de dienst.",
    "Communicatie verliep niet soepel.",
  ],
  1: [
    "Slechte organisatie, afspraken niet nagekomen.",
    "Geen begeleiding of introductie ontvangen.",
    "Zou deze instelling niet aanbevelen.",
  ],
};

export default function CheckInOutButtons({
  shiftId, shiftTitle, employerName, employerUserId,
  hourlyRate, checkedInAt, checkedIn, checkedOut,
}: Props) {
  const router = useRouter();
  const [loading, setLoading]       = useState(false);
  const [modal, setModal]           = useState<"checkout" | null>(null);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [payout, setPayout]         = useState(0);

  // Review state
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [reviewStep, setReviewStep] = useState<"review" | "done">("review");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError]     = useState("");

  async function doCheckin() {
    setLoading(true);
    await fetch(`/api/shifts/${shiftId}/checkin`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  async function doCheckout() {
    setLoading(true);
    const res  = await fetch(`/api/shifts/${shiftId}/checkout`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      const h = data.hoursWorked ?? 0;
      setHoursWorked(h);
      setPayout(Math.round(h * hourlyRate * 100) / 100);
      setModal("checkout");
    } else {
      router.refresh();
    }
  }

  async function submitReview() {
    if (!rating || !employerUserId) { setReviewStep("done"); return; }
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewedId: employerUserId, rating, comment }),
      });
      if (!res.ok) {
        const d = await res.json();
        setReviewError(d.error ?? "Er ging iets mis.");
        setReviewLoading(false);
        return;
      }
    } catch {
      setReviewError("Er ging iets mis.");
      setReviewLoading(false);
      return;
    }
    setReviewLoading(false);
    setReviewStep("done");
  }

  function closeModal() {
    setModal(null);
    router.refresh();
  }

  // ── Already checked out ──
  if (checkedOut) {
    return (
      <div
        className="text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{ background: "var(--teal-light)", color: "var(--teal)" }}
      >
        ✓ Uitgecheckt
      </div>
    );
  }

  // ── Check-in button ──
  if (!checkedIn) {
    return (
      <button
        onClick={doCheckin}
        disabled={loading}
        className="px-4 py-1.5 rounded-[40px] text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
        style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}
      >
        {loading ? "…" : "Inchecken →"}
      </button>
    );
  }

  // ── Check-out button + modal ──
  return (
    <>
      <button
        onClick={doCheckout}
        disabled={loading}
        className="px-4 py-1.5 rounded-[40px] text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
        style={{ background: "#7C3AED", border: "none", fontFamily: "inherit" }}
      >
        {loading ? "…" : "Uitchecken →"}
      </button>

      {modal === "checkout" && (
        <div
          onClick={(e) => e.target === e.currentTarget && reviewStep === "done" && closeModal()}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(10,25,22,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 24,
            width: "100%",
            maxWidth: 460,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          }}>

            {/* ── Top banner ── */}
            <div style={{
              background: "linear-gradient(135deg, #0f6b5e 0%, #1a7a6a 100%)",
              padding: "32px 36px 28px",
              position: "relative",
            }}>
              {/* Decorative circle */}
              <div style={{
                position: "absolute", right: -40, top: -40,
                width: 160, height: 160,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
              }} />
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: "#fff",
                fontFamily: "var(--font-fraunces)",
                lineHeight: 1.2,
              }}>
                Dienst afgerond!
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                {shiftTitle} · {employerName}
              </div>

              {/* Stats row */}
              <div style={{
                display: "flex", gap: 24, marginTop: 20,
                background: "rgba(0,0,0,0.15)",
                borderRadius: 14, padding: "14px 18px",
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    Uren gewerkt
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "var(--font-fraunces)" }}>
                    {hoursWorked.toFixed(1)}u
                  </div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    Verwachte uitbetaling
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "var(--font-fraunces)" }}>
                    €{payout.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Review / Done ── */}
            <div style={{ padding: "28px 36px 32px" }}>

              {reviewStep === "review" ? (
                <>
                  {employerUserId ? (
                    <>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--dark)", fontFamily: "var(--font-fraunces)", marginBottom: 4 }}>
                        Hoe was je ervaring bij {employerName}?
                      </div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
                        Je beoordeling helpt andere professionals een goede keuze te maken.
                      </div>

                      <Stars rating={rating} onSelect={(n) => { setRating(n); setComment(""); }} />
                      {rating > 0 && (
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", marginTop: 6 }}>
                          {RATING_LABELS[rating]}
                        </div>
                      )}

                      {/* Suggestie-chips */}
                      {rating > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                          {SUGGESTIONS[rating]?.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setComment(s)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 40,
                                fontSize: 12,
                                fontWeight: 500,
                                fontFamily: "inherit",
                                cursor: "pointer",
                                transition: "all 0.12s",
                                background: comment === s ? "var(--teal)" : "var(--bg)",
                                color: comment === s ? "#fff" : "var(--dark)",
                                border: comment === s
                                  ? "1.5px solid var(--teal)"
                                  : "1.5px solid var(--border)",
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Vertel anderen over je ervaring… (optioneel)"
                        rows={3}
                        style={{
                          width: "100%", marginTop: 16,
                          padding: "10px 14px",
                          borderRadius: 12,
                          border: "1.5px solid var(--border)",
                          fontSize: 14, fontFamily: "inherit",
                          resize: "none", boxSizing: "border-box",
                          outline: "none",
                          color: "var(--dark)",
                        }}
                      />

                      {reviewError && (
                        <div style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{reviewError}</div>
                      )}

                      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button
                          onClick={submitReview}
                          disabled={reviewLoading}
                          style={{
                            flex: 1, padding: "13px 0",
                            borderRadius: 40,
                            background: rating ? "var(--teal)" : "var(--border)",
                            color: rating ? "#fff" : "var(--muted)",
                            fontWeight: 600, fontSize: 14,
                            border: "none", cursor: rating ? "pointer" : "not-allowed",
                            transition: "background 0.15s",
                          }}
                        >
                          {reviewLoading ? "Versturen…" : "Verstuur beoordeling"}
                        </button>
                        <button
                          onClick={() => setReviewStep("done")}
                          style={{
                            padding: "13px 20px", borderRadius: 40,
                            background: "transparent", color: "var(--muted)",
                            fontWeight: 600, fontSize: 14,
                            border: "1.5px solid var(--border)", cursor: "pointer",
                          }}
                        >
                          Sla over
                        </button>
                      </div>
                    </>
                  ) : (
                    /* No employer userId — skip review step */
                    <button
                      onClick={closeModal}
                      style={{
                        width: "100%", padding: "13px 0",
                        borderRadius: 40, background: "var(--teal)",
                        color: "#fff", fontWeight: 600, fontSize: 14,
                        border: "none", cursor: "pointer",
                      }}
                    >
                      Sluiten
                    </button>
                  )}
                </>
              ) : (
                /* Done state */
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🙌</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--dark)", fontFamily: "var(--font-fraunces)", marginBottom: 6 }}>
                    Bedankt!
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
                    De instelling beoordeelt je uren. Na goedkeuring ontvang je €{payout.toFixed(2)} binnen 48 uur.
                  </div>
                  <button
                    onClick={closeModal}
                    style={{
                      width: "100%", padding: "13px 0",
                      borderRadius: 40, background: "var(--teal)",
                      color: "#fff", fontWeight: 600, fontSize: 15,
                      border: "none", cursor: "pointer",
                    }}
                  >
                    Naar mijn diensten
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
