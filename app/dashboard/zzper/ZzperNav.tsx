"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_GROUPS = [
  {
    heading: "Account instellingen",
    items: [
      { icon: "👤", label: "Mijn profiel",                href: "/dashboard/zzper/profiel" },
      { icon: "💼", label: "Flexpools",                   href: "/dashboard/zzper/flexpools" },
      { icon: "💶", label: "Financieel overzicht",        href: "/dashboard/zzper/financieel" },
      { icon: "🛡️", label: "Mijn verzekeringen & pensioen", href: "/dashboard/zzper/verzekeringen" },
      { icon: "🔔", label: "Notificaties",                href: "/dashboard/zzper/notificaties" },
    ],
  },
  {
    heading: "Meer van CaredIn",
    items: [
      { icon: "💬", label: "Geef feedback",      href: "/feedback" },
      { icon: "❓", label: "Helpdesk",            href: "/helpdesk" },
      { icon: "👥", label: "Community",           href: "/community" },
      { icon: "🎁", label: "Vrienden uitnodigen", href: "/dashboard/zzper/uitnodigen" },
    ],
  },
  {
    heading: "Documenten",
    items: [
      { icon: "🔒", label: "Privacybeleid", href: "/privacy" },
      { icon: "📄", label: "Voorwaarden",   href: "/voorwaarden" },
    ],
  },
];

interface Props {
  userName: string;
  userInitial: string;
  pendingCount?: number;
}

export function ZzperNav({ userName, userInitial, pendingCount }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ background: "#fff", borderRight: "0.5px solid var(--border)" }}>

      {/* Logo + user */}
      <div className="px-5 py-5" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <Link href="/" className="no-underline block mb-5">
          <span className="text-[20px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
            Care<span style={{ color: "var(--dark)" }}>din</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
            style={{ background: "var(--teal)" }}>
            {userInitial}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: "var(--dark)" }}>{userName}</div>
            <Link href="/dashboard/zzper" className="text-[11px] no-underline" style={{ color: "var(--teal)" }}>
              Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.heading}>
            <div className="text-[10px] font-bold uppercase tracking-[1.2px] px-2 mb-2"
              style={{ color: "var(--muted)" }}>
              {group.heading}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium no-underline transition-colors"
                    style={{
                      background: isActive ? "var(--teal-light)" : "transparent",
                      color: isActive ? "var(--teal)" : "var(--muted)",
                    }}>
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.label === "Notificaties" && (pendingCount ?? 0) > 0 && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: "#EF4444" }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: "0.5px solid var(--border)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium w-full text-left cursor-pointer"
          style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "inherit" }}>
          <span className="text-base">🚪</span>
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
