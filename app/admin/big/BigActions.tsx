"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BigActionsProps {
  userId: string;
}

export default function BigActions({ userId }: BigActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/big/${userId}/${action}`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        style={{
          padding: "6px 14px",
          borderRadius: 40,
          fontSize: 12,
          fontWeight: 600,
          cursor: loading !== null ? "not-allowed" : "pointer",
          opacity: loading !== null ? 0.6 : 1,
          background: "#1A7A6A",
          color: "#fff",
          border: "none",
          fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}
      >
        {loading === "approve" ? "…" : "Goedkeuren"}
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        style={{
          padding: "6px 14px",
          borderRadius: 40,
          fontSize: 12,
          fontWeight: 600,
          cursor: loading !== null ? "not-allowed" : "pointer",
          opacity: loading !== null ? 0.6 : 1,
          background: "#FEE2E2",
          color: "#991B1B",
          border: "none",
          fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}
      >
        {loading === "reject" ? "…" : "Afwijzen"}
      </button>
    </div>
  );
}
