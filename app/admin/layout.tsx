import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin",              label: "Dashboard",        icon: "⬜" },
  { href: "/admin/gebruikers",   label: "Gebruikers",       icon: "⬜" },
  { href: "/admin/big",          label: "Registratieverificaties", icon: "⬜" },
  { href: "/admin/diensten",     label: "Diensten",         icon: "⬜" },
  { href: "/admin/aanmeldingen", label: "Aanmeldingen",     icon: "⬜" },
  { href: "/admin/chat",         label: "Live chat",        icon: "⬜" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          minWidth: 240,
          background: "#0F1C1A",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 20px",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "#5DB8A4",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            CaredIn
          </span>
          <span
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            {" "}Admin
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
            CaredIn Admin Panel
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          minHeight: "100vh",
          background: "#F4F6F5",
        }}
      >
        {children}
      </main>
    </div>
  );
}

// We use a simple anchor-based nav link (no pathname hook needed in server component)
function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "9px 12px",
        borderRadius: 8,
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        marginBottom: 2,
        transition: "background 0.15s",
      }}
      className="admin-nav-link"
    >
      {label}
    </Link>
  );
}
