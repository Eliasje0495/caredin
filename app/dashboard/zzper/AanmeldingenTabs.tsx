"use client";
import { useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  hoursWorked: number | null;
  payoutAmount: number | null;
  shift: {
    title: string;
    city: string;
    startTime: string;
    endTime: string;
    hourlyRate: number;
    breakMinutes: number;
    employer: { companyName: string };
  };
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:   "#92400E",
  ACCEPTED:  "#065F46",
  REJECTED:  "#991B1B",
  COMPLETED: "#1E40AF",
  APPROVED:  "#065F46",
  WITHDRAWN: "#6B7280",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING:   "In behandeling",
  ACCEPTED:  "Geaccepteerd",
  REJECTED:  "Afgewezen",
  COMPLETED: "Afgerond",
  APPROVED:  "Goedgekeurd",
  WITHDRAWN: "Ingetrokken",
};

const TABS = [
  { key: "toekomstig", label: "Toekomstig" },
  { key: "afgerond",   label: "Afgerond" },
  { key: "verleden",   label: "Verleden" },
];

export function AanmeldingenTabs({ applications }: { applications: Application[] }) {
  const [tab, setTab] = useState<"toekomstig" | "afgerond" | "verleden">("toekomstig");
  const now = new Date();

  const filtered = applications.filter(app => {
    const start = new Date(app.shift.startTime);
    if (tab === "toekomstig") return start >= now && (app.status === "PENDING" || app.status === "ACCEPTED");
    if (tab === "afgerond")   return app.status === "COMPLETED" || app.status === "APPROVED";
    if (tab === "verleden")   return start < now && app.status !== "COMPLETED" && app.status !== "APPROVED";
    return true;
  });

  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <h2 className="font-semibold text-sm" style={{ color: "var(--dark)" }}>Mijn aanmeldingen</h2>
        <div className="flex items-center gap-3">
          <Link href="/diensten"
            className="px-3.5 py-1.5 rounded-[40px] text-xs font-semibold text-white no-underline"
            style={{ background: "var(--teal)" }}>
            🔍 Shift zoeken
          </Link>
          <Link href="/dashboard/zzper/timesheets" className="text-xs font-semibold no-underline" style={{ color: "var(--teal)" }}>
            Alle bekijken →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-4 pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className="px-4 py-1.5 rounded-[40px] text-[12px] font-semibold transition-colors cursor-pointer"
            style={{
              background: tab === t.key ? "var(--teal)" : "transparent",
              color:      tab === t.key ? "#fff" : "var(--muted)",
              border:     tab === t.key ? "none" : "0.5px solid var(--border)",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="text-3xl mb-3">
            {tab === "toekomstig" ? "📅" : tab === "afgerond" ? "✅" : "🕐"}
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--dark)" }}>
            {tab === "toekomstig" ? "Geen aankomende diensten"
             : tab === "afgerond" ? "Nog geen afgeronde diensten"
             : "Geen verleden aanmeldingen"}
          </p>
          {tab === "toekomstig" && (
            <Link href="/diensten"
              className="inline-flex mt-3 px-5 py-2.5 rounded-full text-sm font-semibold text-white no-underline"
              style={{ background: "var(--teal)" }}>
              Dienst zoeken →
            </Link>
          )}
        </div>
      ) : (
        <div>
          {filtered.map((app, i) => {
            const start = new Date(app.shift.startTime);
            const end   = new Date(app.shift.endTime);
            const fmt   = (d: Date) => d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
            const durationH = (end.getTime() - start.getTime()) / 36e5 - app.shift.breakMinutes / 60;
            const earned = app.payoutAmount
              ? `€${Number(app.payoutAmount).toFixed(2)}`
              : `€${(durationH * Number(app.shift.hourlyRate)).toFixed(2)}`;

            return (
              <div key={app.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
                style={{ borderTop: i === 0 ? "0.5px solid var(--border)" : "none", borderBottom: "0.5px solid var(--border)" }}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-0.5 truncate" style={{ color: "var(--dark)" }}>
                    {app.shift.title}
                  </div>
                  <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                    {app.shift.employer.companyName} · {app.shift.city}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-medium" style={{ color: "var(--teal)" }}>
                      📅 {start.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                      🕐 {fmt(start)} – {fmt(end)}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                      💶 {earned}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{
                    background: (STATUS_COLOR[app.status] ?? "#6B7280") + "20",
                    color: STATUS_COLOR[app.status] ?? "#6B7280",
                  }}>
                  {STATUS_LABEL[app.status] ?? app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
