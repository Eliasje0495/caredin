"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifs, setNotifs]     = useState<Notif[]>([]);
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(setNotifs).catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  async function markAllRead() {
    setLoading(true);
    await fetch("/api/notifications", { method: "POST" });
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setLoading(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); if (!open && unread > 0) markAllRead(); }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: "var(--teal-light)", border: "1px solid var(--border)" }}
      >
        <span style={{ fontSize: 16 }}>🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
            style={{ background: "#EF4444" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl z-50"
          style={{ border: "0.5px solid var(--border)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>Notificaties</span>
            {notifs.length > 0 && (
              <button onClick={markAllRead} disabled={loading}
                className="text-xs font-semibold" style={{ color: "var(--teal)", background: "none", border: "none", cursor: "pointer" }}>
                Alles gelezen
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔕</div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Geen notificaties</p>
              </div>
            ) : (
              notifs.map(n => {
                const content = (
                  <div className="px-4 py-3 flex gap-3" style={{
                    borderBottom: "0.5px solid var(--border)",
                    background: n.read ? "transparent" : "rgba(26,122,106,0.04)",
                  }}>
                    {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--teal)" }} />}
                    {n.read && <div className="w-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold" style={{ color: "var(--dark)" }}>{n.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{n.body}</div>
                      <div className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                        {new Date(n.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
                return n.href ? (
                  <Link key={n.id} href={n.href} className="block no-underline" onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
