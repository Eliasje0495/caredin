"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const DAYS_NL = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MONTHS_NL = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
const FUNCTION_SHORT: Record<string, string> = {
  VERPLEEGKUNDIGE: "Verpleegk.", VERZORGENDE_IG: "Verz. IG", HELPENDE_PLUS: "Helpende+",
  HELPENDE: "Helpende", ZORGASSISTENT: "Zorgass.", GGZ_AGOOG: "GGZ", ARTS: "Arts",
  PERSOONLIJK_BEGELEIDER: "PB", GEDRAGSDESKUNDIGE: "Gedrags.", FYSIOTHERAPEUT: "Fysio",
  ERGOTHERAPEUT: "Ergot.", LOGOPEDIST: "Logoped.", KRAAMVERZORGENDE: "Kraam", OVERIG: "Overig",
};
const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  OPEN:        { bg: "rgba(26,122,106,0.08)",  text: "#1A7A6A", dot: "#1A7A6A" },
  FILLED:      { bg: "rgba(30,64,175,0.08)",   text: "#1E40AF", dot: "#1E40AF" },
  IN_PROGRESS: { bg: "rgba(180,83,9,0.08)",    text: "#B45309", dot: "#F59E0B" },
  COMPLETED:   { bg: "rgba(55,65,81,0.08)",    text: "#374151", dot: "#9CA3AF" },
  APPROVED:    { bg: "rgba(6,95,70,0.08)",     text: "#065F46", dot: "#10B981" },
  CANCELLED:   { bg: "rgba(153,27,27,0.08)",   text: "#991B1B", dot: "#EF4444" },
};
const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open", FILLED: "Ingevuld", IN_PROGRESS: "Bezig",
  COMPLETED: "Afgerond", APPROVED: "Goedgekeurd", CANCELLED: "Geannuleerd",
};

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

interface Shift {
  id: string;
  title: string;
  function: string;
  status: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  isUrgent: boolean;
  city: string;
  _count: { applications: number };
  applications: { id: string; user: { name: string } }[];
}

interface Props {
  initialShifts: Shift[];
  initialWeekStart: string; // ISO string of Monday
}

export default function WeekPlanningClient({ initialShifts, initialWeekStart }: Props) {
  const [weekStart, setWeekStart] = useState(new Date(initialWeekStart));
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  async function loadWeek(monday: Date) {
    setLoading(true);
    const iso = monday.toISOString().split("T")[0];
    const res = await fetch(`/api/shifts/week?from=${iso}`);
    if (res.ok) setShifts(await res.json());
    setLoading(false);
  }

  function navigate(dir: -1 | 1) {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + dir * 7);
    setWeekStart(next);
    loadWeek(next);
  }

  function goToday() {
    const monday = getMonday(new Date());
    setWeekStart(monday);
    loadWeek(monday);
  }

  // Build 7-day array
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekNum = getWeekNumber(weekStart);
  const monthLabel = (() => {
    const months = new Set(days.map(d => d.getMonth()));
    if (months.size === 1) return MONTHS_NL[days[0].getMonth()];
    return `${MONTHS_NL[days[0].getMonth()]} / ${MONTHS_NL[days[6].getMonth()]}`;
  })();

  function shiftsForDay(day: Date) {
    return shifts.filter(s => {
      const d = new Date(s.startTime);
      return d.getFullYear() === day.getFullYear() &&
             d.getMonth() === day.getMonth() &&
             d.getDate() === day.getDate();
    });
  }

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();
  const isPast  = (d: Date) => d < today;

  return (
    <div>
      {/* Planning toolbar */}
      <div className="flex items-center gap-3 px-8 py-4 bg-white"
        style={{ borderBottom: "0.5px solid var(--border)" }}>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer"
            style={{ background: "none", border: "0.5px solid var(--border)", color: "var(--dark)", fontFamily: "inherit" }}>
            ‹
          </button>
          <button onClick={goToday}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            style={{ background: "none", border: "0.5px solid var(--border)", color: "var(--dark)", fontFamily: "inherit" }}>
            Vandaag
          </button>
          <button onClick={() => navigate(1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer"
            style={{ background: "none", border: "0.5px solid var(--border)", color: "var(--dark)", fontFamily: "inherit" }}>
            ›
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
            Week {weekNum}
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>{monthLabel} {days[0].getFullYear()}</span>
        </div>

        {loading && <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />}

        <div className="ml-auto flex items-center gap-3">
          {/* Status legend */}
          <div className="hidden lg:flex items-center gap-3">
            {[["OPEN","Open"],["FILLED","Ingevuld"],["IN_PROGRESS","Bezig"]].map(([s,l]) => (
              <div key={s} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_STYLE[s]?.dot }} />
                {l}
              </div>
            ))}
          </div>

          <Link href="/dashboard/organisatie/diensten/nieuw"
            className="px-5 py-2 rounded-[40px] text-sm font-semibold text-white no-underline"
            style={{ background: "var(--teal)" }}>
            + Dienst toevoegen
          </Link>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="px-8 py-6">
        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "0.5px solid var(--border)" }}>

          {/* Day headers */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {days.map((day, i) => {
              const today_ = isToday(day);
              return (
                <div key={i}
                  className="py-3 px-3 text-center"
                  style={{
                    background: today_ ? "var(--dark)" : "transparent",
                    borderRight: i < 6 ? "0.5px solid var(--border)" : "none",
                    borderBottom: "0.5px solid var(--border)",
                  }}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.8px]"
                    style={{ color: today_ ? "rgba(255,255,255,0.5)" : isPast(day) ? "var(--muted)" : "var(--muted)" }}>
                    {DAYS_NL[i]}
                  </div>
                  <div className="text-[22px] font-bold leading-tight"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: today_ ? "#fff" : isPast(day) ? "var(--muted)" : "var(--dark)",
                    }}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day columns with shifts */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", minHeight: "400px" }}>
            {days.map((day, i) => {
              const dayShifts = shiftsForDay(day);
              const past = isPast(day) && !isToday(day);
              return (
                <div key={i}
                  className="p-2 space-y-1.5 align-top"
                  style={{
                    borderRight: i < 6 ? "0.5px solid var(--border)" : "none",
                    background: past ? "rgba(0,0,0,0.015)" : "transparent",
                    verticalAlign: "top",
                  }}>
                  {dayShifts.map(shift => {
                    const style = STATUS_STYLE[shift.status] ?? STATUS_STYLE.OPEN;
                    const start = new Date(shift.startTime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
                    const end   = new Date(shift.endTime).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
                    const accepted = shift.applications[0];
                    return (
                      <Link key={shift.id}
                        href={`/dashboard/organisatie/diensten/${shift.id}`}
                        className="block rounded-lg px-2.5 py-2 no-underline group"
                        style={{ background: style.bg, borderLeft: `3px solid ${style.dot}` }}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: style.dot }} />
                          <span className="text-[10px] font-bold truncate" style={{ color: style.text }}>
                            {FUNCTION_SHORT[shift.function] ?? shift.function}
                          </span>
                          {shift.isUrgent && (
                            <span className="text-[8px] font-bold px-1 rounded-sm text-white ml-auto" style={{ background: "#ef4444" }}>!</span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold truncate" style={{ color: "var(--dark)" }}>
                          {start}–{end}
                        </div>
                        {accepted ? (
                          <div className="text-[10px] truncate mt-0.5" style={{ color: "var(--muted)" }}>
                            {accepted.user.name}
                          </div>
                        ) : (
                          <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                            {shift._count.applications} sollicitatie{shift._count.applications !== 1 ? "s" : ""}
                          </div>
                        )}
                      </Link>
                    );
                  })}

                  {/* Add shift quick link */}
                  {!past && dayShifts.length === 0 && (
                    <Link href={`/dashboard/organisatie/diensten/nieuw`}
                      className="flex items-center justify-center h-8 rounded-lg text-[11px] font-medium no-underline opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100"
                      style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}>
                      +
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Week total */}
        {shifts.length > 0 && (
          <div className="flex items-center gap-6 mt-4 px-1">
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              {shifts.length} dienst{shifts.length !== 1 ? "en" : ""} deze week
            </span>
            {Object.entries(
              shifts.reduce((acc, s) => { acc[s.status] = (acc[s.status] ?? 0) + 1; return acc; }, {} as Record<string, number>)
            ).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_STYLE[status]?.dot ?? "#9CA3AF" }} />
                {count}× {STATUS_LABEL[status] ?? status}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
