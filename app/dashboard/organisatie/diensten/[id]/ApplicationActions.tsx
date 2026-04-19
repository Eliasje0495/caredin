"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationActions({ appId, shiftId }: { appId: string; shiftId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function act(action: "accept" | "reject") {
    setLoading(action);
    await fetch(`/api/shifts/${shiftId}/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => act("accept")} disabled={!!loading}
        className="px-3 py-1.5 rounded-[40px] text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50"
        style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
        {loading === "accept" ? "…" : "Accepteren"}
      </button>
      <button onClick={() => act("reject")} disabled={!!loading}
        className="px-3 py-1.5 rounded-[40px] text-[12px] font-semibold cursor-pointer disabled:opacity-50"
        style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--muted)", fontFamily: "inherit" }}>
        {loading === "reject" ? "…" : "Afwijzen"}
      </button>
    </div>
  );
}
