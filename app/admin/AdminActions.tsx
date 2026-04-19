"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminActions({ userId, role, isWorkerVerified, isEmployerVerified }: {
  userId: string; role: string; isWorkerVerified?: boolean; isEmployerVerified?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function act(action: string) {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1.5">
      {role === "WORKER" && !isWorkerVerified && (
        <button onClick={() => act("verify-worker")} disabled={loading}
          className="text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer disabled:opacity-50"
          style={{ background: "#065F4618", color: "#065F46", border: "none", fontFamily: "inherit" }}>
          {loading ? "…" : "Verifiëren"}
        </button>
      )}
      {role === "EMPLOYER" && !isEmployerVerified && (
        <button onClick={() => act("verify-employer")} disabled={loading}
          className="text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer disabled:opacity-50"
          style={{ background: "#065F4618", color: "#065F46", border: "none", fontFamily: "inherit" }}>
          {loading ? "…" : "KvK verif."}
        </button>
      )}
    </div>
  );
}
