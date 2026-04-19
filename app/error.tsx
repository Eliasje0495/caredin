"use client";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-[28px] font-bold mb-2"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
        Er is iets misgegaan
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--muted)" }}>
        {error.message ?? "Een onverwachte fout is opgetreden."}
      </p>
      <div className="flex gap-3">
        <button onClick={reset}
          className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white cursor-pointer"
          style={{ background: "var(--teal)", border: "none", fontFamily: "inherit" }}>
          Opnieuw proberen
        </button>
        <Link href="/"
          className="px-6 py-3 rounded-[40px] text-sm font-semibold no-underline"
          style={{ border: "1.5px solid var(--teal)", color: "var(--teal)" }}>
          Terug naar home
        </Link>
      </div>
    </div>
  );
}
