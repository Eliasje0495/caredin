"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageButton({ workerId, employerUserId }: { workerId: string; employerUserId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function startConvo() {
    setLoading(true);
    const res = await fetch("/api/berichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId: workerId }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/organisatie/berichten/${data.id}`);
    }
    setLoading(false);
  }

  return (
    <button onClick={startConvo} disabled={loading}
      className="text-xs font-semibold px-3 py-1.5 rounded-[40px]"
      style={{ background: "#F3F4F6", color: "var(--dark)", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
      {loading ? "..." : "💬 Stuur bericht"}
    </button>
  );
}
