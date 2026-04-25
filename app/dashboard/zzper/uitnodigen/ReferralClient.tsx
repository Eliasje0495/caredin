"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReferralClient({ code, referrals, totalEarned, pendingCount }: {
  code: string;
  referrals: { name: string | null; createdAt: string }[];
  totalEarned: number;
  pendingCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const link = `https://caredin.nl/registreren?ref=${code}`;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Vrienden uitnodigen
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Nodig collega&apos;s uit en verdien <strong style={{ color: "var(--teal)" }}>€25</strong> per collega die hun eerste dienst werkt via Caredin.
        </p>

        {/* Code card */}
        <div className="rounded-2xl p-6 mb-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-[1px] mb-2" style={{ color: "var(--muted)" }}>Jouw uitnodigingslink</div>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <code className="flex-1 text-sm font-mono truncate" style={{ color: "var(--dark)" }}>{link}</code>
            <button onClick={copy}
              className="px-4 py-1.5 rounded-[40px] text-xs font-semibold flex-shrink-0"
              style={{ background: copied ? "#D1FAE5" : "var(--teal)", color: copied ? "#065F46" : "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {copied ? "✓ Gekopieerd!" : "Kopieer"}
            </button>
          </div>
          <div className="flex gap-3">
            <a href={`https://wa.me/?text=${encodeURIComponent(`Hé! Ik werk via Caredin als zorgprofessional. Probeer het ook: ${link}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 rounded-[40px] text-sm font-semibold text-center no-underline"
              style={{ background: "#25D366", color: "#fff" }}>
              Deel via WhatsApp
            </a>
            <a href={`mailto:?subject=Werken via Caredin&body=Hé! Probeer Caredin voor zorgdiensten: ${link}`}
              className="flex-1 px-4 py-2.5 rounded-[40px] text-sm font-semibold text-center no-underline"
              style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
              Deel via e-mail
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Uitgenodigd",      value: referrals.length },
            { label: "Bonus verdiend",   value: `€${totalEarned.toFixed(0)}` },
            { label: "Nog te ontvangen", value: `€${(pendingCount * 25).toFixed(0)}` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 bg-white text-center" style={{ border: "0.5px solid var(--border)" }}>
              <div className="text-[22px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-2xl p-5 mb-6 bg-white" style={{ border: "0.5px solid var(--border)" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: "var(--dark)" }}>Hoe werkt het?</div>
          {[
            ["1", "Deel jouw link met collega's"],
            ["2", "Ze registreren zich via jouw link"],
            ["3", "Ze werken hun eerste dienst"],
            ["4", "Jij ontvangt €25 bonus op je rekening"],
          ].map(([n, s]) => (
            <div key={n} className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "var(--teal)" }}>{n}</div>
              <span className="text-sm" style={{ color: "var(--muted)" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Referral list */}
        {referrals.length > 0 && (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            <div className="px-5 py-3 text-sm font-semibold" style={{ borderBottom: "0.5px solid var(--border)", color: "var(--dark)" }}>
              Uitgenodigde collega&apos;s ({referrals.length})
            </div>
            {referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: i < referrals.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                <span className="text-sm" style={{ color: "var(--dark)" }}>{r.name ?? "Anoniem"}</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {new Date(r.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
