"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Props {
  shiftId: string;
  shiftStatus: string;
  isLoggedIn: boolean;
  hasApplied: boolean;
}

export default function SolliciterenButton({ shiftId, shiftStatus, isLoggedIn, hasApplied }: Props) {
  const searchParams = useSearchParams();
  const justApplied = searchParams.get("aangemeld") === "1";

  if (shiftStatus !== "OPEN") {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--muted)" }}>
        Niet meer beschikbaar
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <a href={`/inloggen?redirect=/vacatures/${shiftId}/aanmelden`}
        className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
        style={{ background: "var(--teal)" }}>
        Inloggen om te aanmelden →
      </a>
    );
  }

  if (hasApplied || justApplied) {
    return (
      <div className="w-full py-3 rounded-[40px] text-sm font-semibold text-center"
        style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
        ✓ Aanmelding verstuurd
      </div>
    );
  }

  return (
    <Link
      href={`/vacatures/${shiftId}/aanmelden`}
      className="block w-full py-3 rounded-[40px] text-[14px] font-semibold text-white text-center no-underline"
      style={{ background: "var(--teal)" }}
    >
      Solliciteren →
    </Link>
  );
}
