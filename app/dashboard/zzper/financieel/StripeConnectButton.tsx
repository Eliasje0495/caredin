"use client";

import { useState } from "react";

interface Props {
  stripeOnboarded: boolean;
}

export default function StripeConnectButton({ stripeOnboarded }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect");
      if (!res.ok) throw new Error("Kon geen Stripe-link ophalen.");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (stripeOnboarded) {
    return (
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "#d1fae5", color: "#065f46" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Bankrekening gekoppeld
        </span>
        <a
          href="/api/stripe/connect"
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const res = await fetch("/api/stripe/connect");
              if (!res.ok) throw new Error();
              const { url } = await res.json();
              window.location.href = url;
            } catch {
              setLoading(false);
            }
          }}
          className="text-xs font-medium"
          style={{ color: "var(--teal)", textDecoration: "none" }}
        >
          {loading ? "Laden..." : "Beheren \u2192"}
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="px-4 py-2 rounded-[40px] text-sm font-semibold transition-opacity"
      style={{
        background: "var(--teal)",
        color: "#fff",
        border: "none",
        fontFamily: "inherit",
        opacity: loading ? 0.7 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Laden..." : "Koppel bankrekening"}
    </button>
  );
}
