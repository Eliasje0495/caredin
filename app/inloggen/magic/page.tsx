"use client";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function MagicHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    if (!token || !email) { setStatus("error"); return; }
    signIn("magic", { token, email, redirect: false }).then((res) => {
      if (res?.ok) {
        router.replace("/dashboard");
      } else {
        setStatus("error");
      }
    });
  }, [token, email, router]);

  if (status === "error") {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--dark)" }}>
          Link verlopen of ongeldig
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Deze inloglink is verlopen of al gebruikt. Links zijn 15 minuten geldig.
        </p>
        <Link href="/inloggen"
          className="inline-flex mt-2 px-6 py-2.5 rounded-[40px] text-sm font-semibold text-white no-underline"
          style={{ background: "var(--teal)" }}>
          Nieuwe link aanvragen →
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-3">
      <div className="w-10 h-10 mx-auto rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
      <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Inloggen…</p>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="px-12 py-5" style={{ background: "var(--dark)" }}>
        <Link href="/" className="no-underline">
          <span className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--teal-mid)" }}>
            Caredin
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <Suspense fallback={
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }} />
            </div>
          }>
            <MagicHandler />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
