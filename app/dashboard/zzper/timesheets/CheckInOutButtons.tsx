"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckInOutButtons({
  shiftId, checkedIn, checkedOut,
}: {
  shiftId: string; checkedIn: boolean; checkedOut: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function act(action: "checkin" | "checkout") {
    setLoading(true);
    await fetch(`/api/shifts/${shiftId}/${action}`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  if (checkedOut) {
    return (
      <div className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
        ✓ Uitgecheckt
      </div>
    );
  }

  if (checkedIn) {
    return (
      <button onClick={() => act("checkout")} disabled={loading}
        className="px-4 py-1.5 rounded-[40px] text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
        style={{ background: "#7C3AED", border: "none", fontFamily: "inherit" }}>
        {loading ? "…" : "Uitchecken →"}
      </button>
    );
  }

  return (
    <button onClick={() => act("checkin")} disabled={loading}
      className="px-4 py-1.5 rounded-[40px] text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
      style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
      {loading ? "…" : "Inchecken →"}
    </button>
  );
}
