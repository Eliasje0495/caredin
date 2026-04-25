"use client";
import { useState } from "react";

export default function InviteWorkerButton({ shiftId, workerId, workerName }: {
  shiftId: string; workerId: string; workerName: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function invite() {
    setState("loading");
    await fetch(`/api/shifts/${shiftId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId }),
    });
    setState("done");
  }

  if (state === "done") return (
    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>
      ✓ Uitgenodigd
    </span>
  );

  return (
    <button onClick={invite} disabled={state === "loading"}
      className="text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer"
      style={{ background: "var(--teal-light)", color: "var(--teal)", border: "none", fontFamily: "inherit" }}>
      {state === "loading" ? "..." : "✉ Uitnodigen"}
    </button>
  );
}
