"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ─── Mega menu content per dropdown ─────────────────────────────────────────
const MENUS = {
  professionals: {
    label: "Voor professionals",
    items: [
      { icon: "🔍", label: "Diensten zoeken",      href: "/diensten",       desc: "Bekijk alle openstaande zorgdiensten" },
      { icon: "📋", label: "Vacatures",             href: "/vacatures",     desc: "Vaste en tijdelijke functies in de zorg" },
      { icon: "👤", label: "Jouw profiel",          href: "/dashboard/zzper/profiel", desc: "Beheer je BIG, KvK en tarieven" },
      { icon: "💼", label: "Flexpools",             href: "/dashboard/zzper/flexpools", desc: "Instellingen waar je eerder werkte" },
      { icon: "💶", label: "Financieel overzicht",  href: "/dashboard/zzper/financieel", desc: "Verdiensten, uitbetalingen en Stripe" },
      { icon: "🛡️", label: "Verzekeringen & pensioen", href: "/dashboard/zzper/verzekeringen", desc: "AOV, beroepsaansprakelijkheid en pensioen" },
    ],
  },
  instellingen: {
    label: "Voor instellingen",
    items: [
      { icon: "📅", label: "Dienst plaatsen",       href: "/dashboard/organisatie/diensten/nieuw", desc: "Publiceer een nieuwe flexdienst" },
      { icon: "📊", label: "Planning",              href: "/dashboard/organisatie",    desc: "Weekplanning en bezetting" },
      { icon: "👥", label: "Professionals vinden",  href: "/professionals",            desc: "Doorzoek geverifieerde zorgprofessionals" },
      { icon: "💼", label: "Flexpools beheren",     href: "/dashboard/organisatie/flexpools", desc: "Jouw vaste pool van flex-professionals" },
      { icon: "🔗", label: "API-integratie",        href: "/dashboard/organisatie/api", desc: "Koppel CaredIn aan je planningssoftware" },
      { icon: "🏢", label: "Voor instellingen",     href: "/voor-instellingen",        desc: "Alles over werken met CaredIn" },
    ],
  },
  over: {
    label: "Over CaredIn",
    items: [
      { icon: "🤝", label: "Onze belofte",          href: "/onze-belofte",   desc: "Wat CaredIn anders maakt" },
      { icon: "📖", label: "Blog",                  href: "/blog",           desc: "Artikelen over flexwerken in de zorg" },
      { icon: "👥", label: "Community",             href: "/community",      desc: "Deel ervaringen met andere professionals" },
      { icon: "❓", label: "Helpdesk",              href: "/helpdesk",       desc: "Veelgestelde vragen en ondersteuning" },
      { icon: "🔒", label: "Privacybeleid",         href: "/privacy",        desc: "Hoe wij omgaan met jouw gegevens" },
    ],
  },
};

type MenuKey = keyof typeof MENUS;

export function Nav() {
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav ref={navRef} className="bg-white sticky top-0 z-50"
      style={{ borderBottom: "0.5px solid var(--border)" }}>

      <div className="h-[68px] flex items-center px-8 justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="no-underline flex-shrink-0" onClick={() => setOpen(null)}>
          <span className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
            Care<span style={{ color: "var(--dark)" }}>din</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {(Object.entries(MENUS) as [MenuKey, typeof MENUS[MenuKey]][]).map(([key, menu]) => (
            <button
              key={key}
              onClick={() => setOpen(open === key ? null : key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer"
              style={{
                background: open === key ? "var(--teal-light)" : "transparent",
                color: open === key ? "var(--teal)" : "var(--muted)",
                border: "none",
                fontFamily: "inherit",
              }}>
              {menu.label}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transform: open === key ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}

          <Link href="/professionals"
            className="px-4 py-2 rounded-xl text-[13px] font-semibold no-underline transition-colors"
            style={{ color: "var(--muted)" }}>
            Professionals
          </Link>
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/inloggen"
            className="px-[18px] py-2 rounded-[40px] text-[13px] font-semibold no-underline"
            style={{ border: "1.5px solid var(--teal)", color: "var(--teal)", background: "transparent" }}>
            Inloggen
          </Link>
          <Link href="/registreren"
            className="px-5 py-2 rounded-[40px] text-[13px] font-semibold text-white no-underline"
            style={{ background: "var(--teal)", border: "none" }}>
            Aanmelden
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl cursor-pointer"
          style={{ background: "none", border: "none", color: "var(--dark)", fontFamily: "inherit" }}>
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mega menu dropdown */}
      {open && (
        <div className="hidden md:block absolute left-0 right-0 top-[68px] z-50"
          style={{ background: "var(--dark)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-2 gap-2">
              {MENUS[open].items.map((item) => (
                <Link key={item.href} href={item.href}
                  onClick={() => setOpen(null)}
                  className="flex items-start gap-4 px-4 py-3.5 rounded-2xl no-underline group transition-colors"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.08)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-white mb-0.5">{item.label}</div>
                    <div className="text-[12px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: "white", borderTop: "0.5px solid var(--border)" }}>
          {(Object.values(MENUS) as typeof MENUS[MenuKey][]).map((menu) => (
            <div key={menu.label} className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[1px] mb-2 px-2" style={{ color: "var(--muted)" }}>
                {menu.label}
              </p>
              {menu.items.map((item) => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline"
                  style={{ color: "var(--dark)" }}>
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="flex gap-2 mt-5 px-2">
            <Link href="/inloggen" onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 rounded-[40px] text-[13px] font-semibold text-center no-underline"
              style={{ border: "1.5px solid var(--teal)", color: "var(--teal)" }}>
              Inloggen
            </Link>
            <Link href="/registreren" onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 rounded-[40px] text-[13px] font-semibold text-white text-center no-underline"
              style={{ background: "var(--teal)" }}>
              Aanmelden
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
