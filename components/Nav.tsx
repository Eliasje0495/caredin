import Link from "next/link";

export function Nav() {
  return (
    <nav className="bg-white h-[68px] flex items-center px-12 justify-between sticky top-0 z-50"
      style={{ borderBottom: "0.5px solid var(--border)" }}>

      {/* Logo */}
      <Link href="/" className="no-underline flex-shrink-0">
        <span className="text-[22px] font-bold tracking-[-0.5px]"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal)" }}>
          Care<span style={{ color: "var(--dark)" }}>din</span>
        </span>
      </Link>

      {/* Links */}
      <ul className="hidden md:flex gap-7 list-none">
        {[
          { href: "/vacatures",          label: "Voor professionals" },
          { href: "/voor-instellingen",  label: "Voor instellingen" },
          { href: "/professionals",      label: "Professionals" },
          { href: "/blog",              label: "Blog" },
          { href: "/community",         label: "Community" },
          { href: "/onze-belofte",      label: "Onze belofte" },
          { href: "/helpdesk",          label: "Helpdesk" },
        ].map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm font-medium no-underline" style={{ color: "var(--muted)" }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="flex items-center gap-2.5">
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
    </nav>
  );
}
