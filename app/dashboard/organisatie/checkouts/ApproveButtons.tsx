"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButtons({ appId, shiftId }: { appId: string; shiftId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject") {
    setLoading(action);
    await fetch(`/api/shifts/${shiftId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, appId }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <button onClick={() => act("approve")} disabled={!!loading}
        className="px-4 py-2 rounded-[40px] text-xs font-semibold text-white cursor-pointer disabled:opacity-50 whitespace-nowrap"
        style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
        {loading === "approve" ? "…" : "✓ Goedkeuren"}
      </button>
      <button onClick={() => act("reject")} disabled={!!loading}
        className="px-4 py-2 rounded-[40px] text-xs font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
        style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--muted)", fontFamily: "inherit" }}>
        {loading === "reject" ? "…" : "Afwijzen"}
      </button>
    </div>
  );
}
