"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

const PRIMARY = [
  { href: "/dashboard/organisatie",            label: "Planning" },
  { href: "/dashboard/organisatie/diensten",   label: "Diensten" },
  { href: "/dashboard/organisatie/checkouts",  label: "Checkouts" },
  { href: "/dashboard/organisatie/flexpools",  label: "Flexpools" },
  { href: "/dashboard/organisatie/facturen",   label: "Facturen" },
];

interface Props {
  companyName: string;
  initial: string;
  pendingCheckouts: number;
}

export default function OrgNav({ companyName, initial, pendingCheckouts }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function isActive(href: string) {
    if (href === "/dashboard/organisatie") return path === href;
    return path.startsWith(href);
  }

  return (
    <header className="h-[60px] flex items-center px-8 sticky top-0 z-50 gap-8"
      style={{ background: "var(--dark)", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>

      {/* Logo */}
      <Link href="/dashboard/organisatie" className="no-underline flex-shrink-0 text-[20px] font-bold tracking-[-0.5px]"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
        Care<span style={{ color: "rgba(255,255,255,0.85)" }}>din</span>
      </Link>

      {/* Primary nav */}
      <nav className="flex items-center gap-1 flex-1">
        {PRIMARY.map(n => (
          <Link key={n.href} href={n.href}
            className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-semibold no-underline transition-colors"
            style={{
              color: isActive(n.href) ? "var(--teal-mid)" : "rgba(255,255,255,0.5)",
              background: isActive(n.href) ? "rgba(93,184,164,0.12)" : "transparent",
            }}>
            {n.label}
            {n.href.includes("checkouts") && pendingCheckouts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: "#ef4444" }}>
                {pendingCheckouts}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href="/dashboard/organisatie/diensten/nieuw"
          className="px-4 py-2 rounded-[40px] text-[13px] font-semibold no-underline"
          style={{ background: "var(--teal)", color: "#fff" }}>
          + Dienst plaatsen
        </Link>

        {/* Company dropdown */}
        <div ref={dropRef} className="relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ background: open ? "rgba(255,255,255,0.1)" : "transparent", border: "none", fontFamily: "inherit" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--teal)" }}>
              {initial}
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{companyName}</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>▼</span>
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-2xl overflow-hidden shadow-xl"
              style={{ background: "#fff", border: "0.5px solid var(--border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <div className="text-xs font-bold uppercase tracking-[1px]" style={{ color: "var(--muted)" }}>Account</div>
              </div>
              {[
                { href: "/dashboard/organisatie/profiel",       label: "Profiel" },
                { href: "/dashboard/organisatie/statistieken",  label: "Statistieken" },
                { href: "/dashboard/organisatie/geblokkeerd",   label: "Geblokkeerde professionals" },
                { href: "/dashboard/organisatie/export",        label: "Shifts exporteren" },
                { href: "/dashboard/organisatie/notificaties",  label: "Notificaties" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm no-underline hover:bg-[var(--teal-light)] transition-colors"
                  style={{ color: "var(--dark)" }}>
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: "0.5px solid var(--border)" }}>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-left cursor-pointer"
                  style={{ background: "none", border: "none", color: "#991B1B", fontFamily: "inherit" }}>
                  Uitloggen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
