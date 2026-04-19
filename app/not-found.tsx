import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="text-[80px] font-bold leading-none mb-4"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-light)" }}>
        404
      </div>
      <h1 className="text-[28px] font-bold mb-2"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
        Pagina niet gevonden
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--muted)" }}>
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link href="/"
        className="px-6 py-3 rounded-[40px] text-sm font-semibold text-white no-underline"
        style={{ background: "var(--teal)" }}>
        Terug naar home →
      </Link>
    </div>
  );
}
