"use client";
import { useState } from "react";

const TOPICS = [
  { icon: "🔍", label: "Diensten vinden" },
  { icon: "📋", label: "Aanmeldingsproces" },
  { icon: "💶", label: "Uitbetaling" },
  { icon: "👤", label: "Mijn profiel" },
  { icon: "📱", label: "App / website" },
  { icon: "💬", label: "Overig" },
];

export default function FeedbackPage() {
  const [topic, setTopic]     = useState<string | null>(null);
  const [rating, setRating]   = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!rating || !message.trim()) return;
    setLoading(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, rating, message }),
    }).catch(() => {});
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="px-8 py-10">
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-[24px] font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Bedankt voor je feedback!
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We lezen elke reactie en gebruiken het om CaredIn beter te maken.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <div className="max-w-xl mx-auto">
        <p className="text-[12px] font-semibold uppercase tracking-[0.8px] mb-1" style={{ color: "var(--teal)" }}>Jouw mening</p>
        <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Geef feedback
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Help ons CaredIn beter te maken. Je feedback wordt direct gelezen door ons team.
        </p>

        {/* Onderwerp */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold mb-3" style={{ color: "var(--dark)" }}>Waarover gaat je feedback?</div>
          <div className="grid grid-cols-3 gap-2">
            {TOPICS.map(t => (
              <button key={t.label} onClick={() => setTopic(t.label)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-center transition-all"
                style={{
                  border: topic === t.label ? "1.5px solid var(--teal)" : "0.5px solid var(--border)",
                  background: topic === t.label ? "var(--teal-light)" : "white",
                  color: topic === t.label ? "var(--teal)" : "var(--muted)",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}>
                <span className="text-xl">{t.icon}</span>
                <span className="text-[11px] font-semibold leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Beoordeling */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold mb-3" style={{ color: "var(--dark)" }}>Hoe tevreden ben je overall?</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setRating(n)}
                className="flex-1 py-3 rounded-2xl text-xl transition-all"
                style={{
                  border: rating === n ? "1.5px solid var(--teal)" : "0.5px solid var(--border)",
                  background: rating === n ? "var(--teal-light)" : "white",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}>
                {["😞", "😕", "😐", "😊", "😍"][n - 1]}
              </button>
            ))}
          </div>
          {rating && (
            <p className="text-[11px] mt-1.5 text-center" style={{ color: "var(--teal)" }}>
              {["Erg ontevreden", "Ontevreden", "Neutraal", "Tevreden", "Erg tevreden"][rating - 1]}
            </p>
          )}
        </div>

        {/* Bericht */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold mb-2" style={{ color: "var(--dark)" }}>Vertel ons meer</div>
          <textarea
            rows={5}
            placeholder="Wat kan er beter? Wat werkt goed? Elke reactie helpt."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none"
            style={{
              border: "0.5px solid var(--border)",
              color: "var(--dark)",
              background: "white",
              fontFamily: "inherit",
            }}
          />
          <div className="text-[11px] text-right mt-1" style={{ color: "var(--muted)" }}>{message.length}/500</div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!rating || !message.trim() || loading}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-opacity"
          style={{
            background: "var(--teal)",
            opacity: !rating || !message.trim() || loading ? 0.4 : 1,
            cursor: !rating || !message.trim() || loading ? "not-allowed" : "pointer",
            border: "none",
            fontFamily: "inherit",
          }}>
          {loading ? "Versturen..." : "Feedback versturen →"}
        </button>
      </div>
    </div>
  );
}
