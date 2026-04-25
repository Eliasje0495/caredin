"use client";
import { useEffect, useState } from "react";

type BlockedWorker = {
  id: string;
  workerId: string;
  workerName: string;
  reason: string | null;
  createdAt: string;
};

export default function GeblokkeerdeProfsPage() {
  const [blocked, setBlocked] = useState<BlockedWorker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employer/blocked")
      .then(r => r.json())
      .then(d => { setBlocked(d.blocked ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleUnblock(workerId: string, name: string) {
    if (!confirm(`${name} deblokkeren?`)) return;
    await fetch("/api/employer/blocked", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId }),
    });
    setBlocked(prev => prev.filter(b => b.workerId !== workerId));
  }

  return (
    <div>
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-1"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Geblokkeerde professionals
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Professionals die je hebt geblokkeerd kunnen zich niet meer aanmelden voor jouw diensten.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
          </div>
        ) : blocked.length === 0 ? (
          <div className="rounded-2xl p-16 text-center bg-white"
            style={{ border: "0.5px solid var(--border)" }}>
            <div className="text-4xl mb-4">🚫</div>
            <div className="text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
              Geen geblokkeerde professionals
            </div>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
              Je hebt nog niemand geblokkeerd. Via de aanmeldingenpagina van een dienst kun je een professional blokkeren.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocked.map(b => (
              <div key={b.id}
                className="rounded-2xl px-5 py-4 bg-white flex items-center justify-between"
                style={{ border: "0.5px solid var(--border)" }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--dark)" }}>{b.workerName}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {b.reason ? `Reden: ${b.reason} · ` : ""}
                    {new Date(b.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(b.workerId, b.workerName)}
                  className="px-4 py-1.5 rounded-[40px] text-xs font-semibold cursor-pointer"
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
