"use client";
import { useState } from "react";

// This page is a UI stub — blocking feature requires schema extension.
// Shown to illustrate the concept and allow future implementation.
export default function GeblokkeerdeProfsPage() {
  const [blocked] = useState<{ name: string; reason: string; date: string }[]>([]);

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Geblokkeerde professionals
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Professionals die je hebt geblokkeerd kunnen zich niet meer aanmelden voor jouw diensten.
          </p>
        </div>

        {blocked.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white" style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">🚫</div>
            <div className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Geen geblokkeerde professionals
            </div>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
              Je hebt nog niemand geblokkeerd. Via de aanmeldingenpagina kun je een professional blokkeren.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocked.map((b, i) => (
              <div key={i} className="rounded-2xl px-5 py-4 bg-white flex items-center justify-between"
                style={{ border: "0.5px solid var(--border)" }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{b.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Reden: {b.reason} · {b.date}</div>
                </div>
                <button className="px-4 py-1.5 rounded-[40px] text-xs font-semibold cursor-pointer"
                  style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none", fontFamily: "inherit" }}>
                  Deblokkeren
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
